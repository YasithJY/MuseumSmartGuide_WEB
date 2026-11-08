import React, {
  Component,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { MdAdd, MdRemove, MdCenterFocusStrong, MdClose, MdLocationOn, MdAccessTime, MdChevronRight, MdDirections } from 'react-icons/md';
import { ThemeContext } from '../../context/ThemeContext';
import { LangContext } from '../../context/LangContext';
import {
  BEACH_Y,
  WATER_Y,
  LANDMARKS,
  MAHAWELI,
  buildTerrainGeometry,
  outlines,
  scatterTrees,
  terrainY,
  toScene,
} from './islandData';
import Sigiriya from './Sigiriya';

const GOLD = '#C9A227';
const DEFAULT_TARGET = new THREE.Vector3(0.7, 0, 3.5);
const DEFAULT_POLAR = 0.86; // radians from straight-down
const DEFAULT_AZIMUTH = 0.12;
const PIN_SCALE = 2.4;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

// Projects a label's anchor to screen pixels, keeping it far enough from the left
// and right edges that the (centred) label is never cut off.
const projected = new THREE.Vector3();
const clampedLabelPosition = (el, camera, size) => {
  projected.setFromMatrixPosition(el.matrixWorld).project(camera);
  const x = ((projected.x + 1) / 2) * size.width;
  const y = ((1 - projected.y) / 2) * size.height;
  const margin = Math.min(size.width < 640 ? 88 : 130, size.width / 2);
  return [THREE.MathUtils.clamp(x, margin, size.width - margin), y];
};

const museumName = (museum, lang) =>
  (lang !== 'en' && museum.translations?.[lang]?.name) || museum.name;

const sceneAt = (lat, lng, lift = 0) => {
  const { x, z } = toScene(lat, lng);
  return [x, terrainY(x, z) + lift, z];
};

/* ------------------------------------------------------------------ */
/* Scene pieces                                                        */
/* ------------------------------------------------------------------ */

// Sandy base (its sides dip under the sea) with the sculpted, painted land on top.
function Island({ dark }) {
  const slabGeometry = useMemo(() => {
    const shapes = outlines.map((o) => new THREE.Shape(o.map(([x, y]) => new THREE.Vector2(x, y))));
    const depth = 0.3;
    const bevelThickness = 0.06;
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.12,
      bevelSegments: 3,
      curveSegments: 1,
    });
    g.rotateX(-Math.PI / 2); // shape's +y (north) becomes -z, extrusion goes up
    g.translate(0, BEACH_Y - depth - bevelThickness, 0);
    return g;
  }, []);
  const terrainGeometry = useMemo(buildTerrainGeometry, []);

  useEffect(() => () => {
    slabGeometry.dispose();
    terrainGeometry.dispose();
  }, [slabGeometry, terrainGeometry]);

  return (
    <group>
      <mesh geometry={slabGeometry} receiveShadow>
        <meshStandardMaterial color={dark ? '#c2ad84' : '#efdcab'} roughness={1} />
      </mesh>
      <mesh geometry={terrainGeometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ---- sea: lagoon colours, rolling surf lines and shore foam, fading into the page ---- */

const SEA_SIZE = 140;
const SEA_CENTER_X = 1;
const SEA_CENTER_Z = 0;
const SEA_RES = 1024;
const SEA_RANGE = 16; // units of coast distance stored in the texture

// Rasterises the coast and runs a chamfer distance transform: each texel = distance to land.
const buildCoastDistanceTexture = () => {
  const N = SEA_RES;
  const scale = N / SEA_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = N;
  canvas.height = N;
  const ctx = canvas.getContext('2d');
  // canvas row 0 = south edge, matching the plane's uv.y = 0
  const px = (x) => (x - SEA_CENTER_X + SEA_SIZE / 2) * scale;
  const py = (yNorth) => (yNorth + SEA_CENTER_Z + SEA_SIZE / 2) * scale;
  ctx.fillStyle = '#fff';
  outlines.forEach((o) => {
    ctx.beginPath();
    o.forEach(([x, y], k) => (k ? ctx.lineTo(px(x), py(y)) : ctx.moveTo(px(x), py(y))));
    ctx.closePath();
    ctx.fill();
  });
  const img = ctx.getImageData(0, 0, N, N).data;
  const d = new Float32Array(N * N);
  for (let k = 0; k < N * N; k++) d[k] = img[k * 4 + 3] > 127 ? 0 : 1e9;
  const D = Math.SQRT2;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const k = j * N + i;
      let v = d[k];
      if (v === 0) continue;
      if (i > 0) v = Math.min(v, d[k - 1] + 1);
      if (j > 0) {
        v = Math.min(v, d[k - N] + 1);
        if (i > 0) v = Math.min(v, d[k - N - 1] + D);
        if (i < N - 1) v = Math.min(v, d[k - N + 1] + D);
      }
      d[k] = v;
    }
  }
  for (let j = N - 1; j >= 0; j--) {
    for (let i = N - 1; i >= 0; i--) {
      const k = j * N + i;
      let v = d[k];
      if (v === 0) continue;
      if (i < N - 1) v = Math.min(v, d[k + 1] + 1);
      if (j < N - 1) {
        v = Math.min(v, d[k + N] + 1);
        if (i < N - 1) v = Math.min(v, d[k + N + 1] + D);
        if (i > 0) v = Math.min(v, d[k + N - 1] + D);
      }
      d[k] = v;
    }
  }
  const out = new Uint8Array(N * N);
  for (let k = 0; k < N * N; k++) {
    const units = Math.max(0, d[k] - 0.5) / scale;
    out[k] = Math.min(255, Math.round((units / SEA_RANGE) * 255));
  }
  const tex = new THREE.DataTexture(out, N, N, THREE.RedFormat, THREE.UnsignedByteType);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
};

const SEA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SEA_FRAGMENT = /* glsl */ `
  uniform sampler2D uDist;
  uniform float uTime;
  uniform float uRange;
  uniform vec3 uShallow;
  uniform vec3 uMid;
  uniform vec3 uDeep;
  uniform vec3 uFoam;
  uniform float uFoamStrength;
  varying vec2 vUv;

  void main() {
    float d = texture2D(uDist, vUv).r * uRange;

    vec3 col = mix(uShallow, uMid, smoothstep(0.15, 2.0, d));
    col = mix(col, uDeep, smoothstep(1.8, 10.0, d));

    // soft surf lines rolling in towards the beach
    float w = fract(d * 0.85 + uTime * 0.1);
    float surf = smoothstep(0.0, 0.05, w) * (1.0 - smoothstep(0.05, 0.16, w));
    surf *= (1.0 - smoothstep(0.3, 2.6, d)) * smoothstep(0.15, 0.35, d);
    col = mix(col, uFoam, surf * 0.4 * uFoamStrength);

    // lacy foam hugging the shore
    float wobble = 0.05 * sin(uTime * 1.1 + vUv.x * 420.0) * sin(vUv.y * 380.0 - uTime * 0.7);
    float shore = 1.0 - smoothstep(0.12, 0.32, d + wobble);
    col = mix(col, uFoam, shore * 0.85 * uFoamStrength);

    // faint shimmer on open water
    col += sin(vUv.x * 900.0 + uTime * 0.6) * sin(vUv.y * 820.0 - uTime * 0.5) * 0.012;

    // vignette: the sea melts into the page like an illustrated chart
    float r = length((vUv - 0.5) * vec2(1.3, 1.0)) * 2.0;
    float alpha = 1.0 - smoothstep(0.42, 0.9, r);

    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const SEA_COLORS = {
  light: { shallow: '#9fe0d2', mid: '#5fb8c4', deep: '#3d8fae', foam: '#ffffff', foamStrength: 1 },
  dark: { shallow: '#2f7d7d', mid: '#1f5a6b', deep: '#173f55', foam: '#cfe6e4', foamStrength: 0.55 },
};

function Sea({ dark, still }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SEA_VERTEX,
        fragmentShader: SEA_FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uDist: { value: buildCoastDistanceTexture() },
          uTime: { value: 0 },
          uRange: { value: SEA_RANGE },
          uShallow: { value: new THREE.Color() },
          uMid: { value: new THREE.Color() },
          uDeep: { value: new THREE.Color() },
          uFoam: { value: new THREE.Color() },
          uFoamStrength: { value: 1 },
        },
      }),
    []
  );

  useEffect(() => {
    const c = SEA_COLORS[dark ? 'dark' : 'light'];
    const u = material.uniforms;
    u.uShallow.value.set(c.shallow);
    u.uMid.value.set(c.mid);
    u.uDeep.value.set(c.deep);
    u.uFoam.value.set(c.foam);
    u.uFoamStrength.value = c.foamStrength;
  }, [dark, material]);

  useEffect(() => () => {
    material.uniforms.uDist.value.dispose();
    material.dispose();
  }, [material]);

  useFrame(({ clock }) => {
    if (!still) material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[SEA_CENTER_X, WATER_Y, SEA_CENTER_Z]} material={material} renderOrder={-1}>
      <planeGeometry args={[SEA_SIZE, SEA_SIZE]} />
    </mesh>
  );
}

/* ---- low-poly forests ---- */

function Trees({ keepClear }) {
  const { broadleaf, pines } = useMemo(() => scatterTrees(keepClear), [keepClear]);
  const canopyRef = useRef();
  const pineRef = useRef();
  const trunkRef = useRef();

  const geometries = useMemo(() => {
    const canopy = new THREE.IcosahedronGeometry(0.22, 0);
    canopy.translate(0, 0.32, 0);
    const pine = new THREE.ConeGeometry(0.15, 0.52, 6);
    pine.translate(0, 0.32, 0);
    const trunk = new THREE.CylinderGeometry(0.022, 0.032, 0.16, 5);
    trunk.translate(0, 0.08, 0);
    return { canopy, pine, trunk };
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const place = (t) => {
      dummy.position.set(t.x, t.y - 0.02, t.z);
      dummy.rotation.set(0, t.rot, 0);
      dummy.scale.setScalar(t.scale);
      dummy.updateMatrix();
    };
    broadleaf.forEach((t, i) => {
      place(t);
      canopyRef.current.setMatrixAt(i, dummy.matrix);
      canopyRef.current.setColorAt(i, t.color);
      trunkRef.current.setMatrixAt(i, dummy.matrix);
    });
    pines.forEach((t, i) => {
      place(t);
      pineRef.current.setMatrixAt(i, dummy.matrix);
      pineRef.current.setColorAt(i, t.color);
      trunkRef.current.setMatrixAt(broadleaf.length + i, dummy.matrix);
    });
    [canopyRef, pineRef, trunkRef].forEach(({ current }) => {
      current.instanceMatrix.needsUpdate = true;
      if (current.instanceColor) current.instanceColor.needsUpdate = true;
      current.computeBoundingSphere();
    });
  }, [broadleaf, pines]);

  useEffect(() => () => Object.values(geometries).forEach((g) => g.dispose()), [geometries]);

  return (
    <group>
      <instancedMesh key={`c${broadleaf.length}`} ref={canopyRef} args={[geometries.canopy, undefined, broadleaf.length]} castShadow receiveShadow>
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
      <instancedMesh key={`p${pines.length}`} ref={pineRef} args={[geometries.pine, undefined, pines.length]} castShadow receiveShadow>
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
      <instancedMesh key={`t${broadleaf.length + pines.length}`} ref={trunkRef} args={[geometries.trunk, undefined, broadleaf.length + pines.length]} castShadow>
        <meshStandardMaterial color="#7a5537" roughness={1} />
      </instancedMesh>
    </group>
  );
}

/* ---- the Mahaweli, draped over the hills ---- */

function River({ dark }) {
  const geometry = useMemo(() => {
    const points = MAHAWELI.map(([lat, lng]) => {
      const p = toScene(lat, lng);
      return new THREE.Vector3(p.x, 0, p.z);
    });
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const N = 320;
    const pos = [];
    const index = [];
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const p = curve.getPoint(t);
      const tan = curve.getTangent(t);
      const len = Math.hypot(tan.x, tan.z) || 1;
      const nx = -tan.z / len;
      const nz = tan.x / len;
      const half = 0.035 + 0.07 * t; // widens towards the sea
      [-1, 1].forEach((s) => {
        const x = p.x + nx * half * s;
        const z = p.z + nz * half * s;
        pos.push(x, terrainY(x, z) + 0.05, z);
      });
      if (k < N) index.push(2 * k, 2 * k + 2, 2 * k + 1, 2 * k + 1, 2 * k + 2, 2 * k + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={dark ? '#3f8fa6' : '#5bb3cc'}
        roughness={0.3}
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  );
}

/* ---- little heritage landmarks ---- */

const STONE = '#efe9dc';

function Stupa() {
  return (
    <group scale={2.3}>
      <mesh position-y={0.03} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.06, 32]} />
        <meshStandardMaterial color="#d9cfbb" roughness={0.9} />
      </mesh>
      <mesh position-y={0.085} castShadow>
        <cylinderGeometry args={[0.28, 0.29, 0.05, 32]} />
        <meshStandardMaterial color={STONE} roughness={0.8} />
      </mesh>
      <mesh position-y={0.11} scale={[1, 0.95, 1]} castShadow>
        <sphereGeometry args={[0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={STONE} roughness={0.6} />
      </mesh>
      <mesh position-y={0.4} castShadow>
        <boxGeometry args={[0.09, 0.07, 0.09]} />
        <meshStandardMaterial color={STONE} roughness={0.7} />
      </mesh>
      <mesh position-y={0.55} castShadow>
        <coneGeometry args={[0.045, 0.26, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Lighthouse({ dark }) {
  return (
    <group scale={2.3}>
      <mesh position-y={0.25} castShadow>
        <cylinderGeometry args={[0.055, 0.085, 0.5, 14]} />
        <meshStandardMaterial color="#fbf8f2" roughness={0.6} />
      </mesh>
      {[0.14, 0.34].map((y) => (
        <mesh key={y} position-y={y}>
          <cylinderGeometry args={[0.083 - y * 0.06, 0.087 - y * 0.06, 0.06, 14]} />
          <meshStandardMaterial color="#b9473a" roughness={0.6} />
        </mesh>
      ))}
      <mesh position-y={0.55}>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
        <meshStandardMaterial color="#ffe7a3" emissive="#ffcf5a" emissiveIntensity={dark ? 2.5 : 0.6} />
      </mesh>
      <mesh position-y={0.63} castShadow>
        <coneGeometry args={[0.075, 0.09, 12]} />
        <meshStandardMaterial color="#b9473a" roughness={0.6} />
      </mesh>
    </group>
  );
}

const LANDMARK_MODELS = { stupa: Stupa, sigiriya: Sigiriya, lighthouse: Lighthouse };

const mapLabelClass =
  'font-display italic whitespace-nowrap select-none text-primary/75 dark:text-parchment/70 [text-shadow:0_1px_2px_rgba(252,250,245,0.9)] dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.8)]';

function Landmarks({ dark, portal }) {
  return LANDMARKS.map((l) => {
    const Model = LANDMARK_MODELS[l.id];
    const position = sceneAt(l.lat, l.lng);
    return (
      <group key={l.id} position={position}>
        <Model dark={dark} origin={position} />
        <Html position={[0, -0.05, l.labelZ ?? 0.95]} center portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className={`${mapLabelClass} text-[11px]`}>{l.name}</span>
        </Html>
      </group>
    );
  });
}

const SEA_LABELS = [
  { text: 'Indian Ocean', lat: 5.35, lng: 81.3 },
  { text: 'Bay of Bengal', lat: 9.55, lng: 82.05 },
  { text: 'Gulf of Mannar', lat: 8.55, lng: 79.15 },
];

function SeaLabels({ portal }) {
  return SEA_LABELS.map((l) => {
    const { x, z } = toScene(l.lat, l.lng);
    return (
      <Html key={l.text} position={[x, WATER_Y, z]} center portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span className="hidden sm:inline font-display italic whitespace-nowrap select-none text-[13px] tracking-[0.3em] text-white/85 [text-shadow:0_1px_3px_rgba(20,70,95,0.55)] dark:text-[#9cc9d6]/70">
          {l.text}
        </span>
      </Html>
    );
  });
}

/* ---- drifting clouds and outrigger boats ---- */

const CLOUDS = [
  { lat: 7.05, lng: 80.42, y: 4.4, s: 1.5, phase: 0 },
  { lat: 6.45, lng: 81.05, y: 5.0, s: 1.2, phase: 2.1 },
  { lat: 9.15, lng: 80.25, y: 5.3, s: 1.3, phase: 4.2 },
  { lat: 5.55, lng: 79.55, y: 4.2, s: 1.4, phase: 1.3 },
  { lat: 8.75, lng: 81.95, y: 4.8, s: 1.2, phase: 3.4 },
];
const PUFFS = [
  [0, 0, 0, 0.55],
  [0.6, -0.1, 0.08, 0.42],
  [-0.58, -0.12, -0.04, 0.4],
  [0.22, 0.24, -0.12, 0.4],
  [-0.24, 0.14, 0.22, 0.36],
];

function Cloud({ lat, lng, y, s, phase, still, dark }) {
  const ref = useRef();
  const { x, z } = toScene(lat, lng);
  useFrame(({ clock }) => {
    if (still || !ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = x + Math.sin(t * 0.05 + phase) * 1.6;
    ref.current.position.y = y + Math.sin(t * 0.4 + phase) * 0.08;
  });
  return (
    <group ref={ref} position={[x, y, z]} scale={s}>
      {PUFFS.map(([px, py, pz, r]) => (
        <mesh key={`${px}${py}`} position={[px, py, pz]}>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={dark ? '#cdd3df' : '#ffffff'} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

const BOATS = [
  { lat: 7.3, lng: 79.6, heading: 0.6, phase: 0 },
  { lat: 8.72, lng: 81.5, heading: 2.2, phase: 1.7 },
  { lat: 5.78, lng: 80.55, heading: -0.4, phase: 3.1 },
];

const sailShape = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0.22, 0);
  s.quadraticCurveTo(0.12, 0.2, 0.02, 0.36);
  s.lineTo(0, 0);
  return s;
})();

function Boat({ lat, lng, heading, phase, still }) {
  const ref = useRef();
  const { x, z } = toScene(lat, lng);
  useFrame(({ clock }) => {
    if (still || !ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = WATER_Y + Math.sin(t * 1.4 + phase) * 0.015;
    ref.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.06;
    ref.current.position.x = x + Math.sin(t * 0.04 + phase) * 0.8;
  });
  return (
    <group ref={ref} position={[x, WATER_Y, z]} rotation-y={heading} scale={1.6}>
      <mesh position-y={0.03} castShadow>
        <boxGeometry args={[0.42, 0.06, 0.09]} />
        <meshStandardMaterial color="#8a5a3b" roughness={0.9} />
      </mesh>
      {/* outrigger float */}
      <mesh position={[0, 0.02, 0.2]}>
        <boxGeometry args={[0.3, 0.03, 0.035]} />
        <meshStandardMaterial color="#6e4a32" roughness={0.9} />
      </mesh>
      {[-0.08, 0.08].map((bx) => (
        <mesh key={bx} position={[bx, 0.05, 0.1]}>
          <boxGeometry args={[0.015, 0.015, 0.2]} />
          <meshStandardMaterial color="#6e4a32" />
        </mesh>
      ))}
      <mesh position={[-0.1, 0.06, 0]} castShadow>
        <shapeGeometry args={[sailShape]} />
        <meshStandardMaterial color="#f4ead2" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function MuseumPin({ label, position, selected, showLabel, onSelect, phase, portal, still }) {
  const bob = useRef();
  const ring = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }) => {
    if (still) {
      if (bob.current) bob.current.position.y = 0.15;
      if (ring.current) ring.current.material.opacity = 0;
      return;
    }
    const t = clock.getElapsedTime();
    if (bob.current) bob.current.position.y = 0.15 + Math.sin(t * 2 + phase) * 0.06;
    if (ring.current) {
      const p = (t * 0.7 + phase) % 1;
      const s = 0.6 + p * 1.6;
      ring.current.scale.set(s, s, s);
      ring.current.material.opacity = 0.7 * (1 - p);
    }
  });

  const active = selected || hovered;
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group position={[position.x, position.y, position.z]} scale={PIN_SCALE}>
      {/* pulse on the ground */}
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.02}>
        <ringGeometry args={[0.22, 0.3, 48]} />
        <meshBasicMaterial color={GOLD} transparent depthWrite={false} />
      </mesh>

      <group
        ref={bob}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        {/* map-pin: inverted cone with a sphere head, tip at local origin */}
        <mesh position-y={0.4} rotation-x={Math.PI} castShadow>
          <coneGeometry args={[0.24, 0.8, 32]} />
          <meshStandardMaterial color={GOLD} metalness={0.2} roughness={0.35} emissive={GOLD} emissiveIntensity={active ? 0.5 : 0.18} />
        </mesh>
        <mesh position-y={0.85} castShadow>
          <sphereGeometry args={[0.3, 32, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.2} roughness={0.3} emissive={GOLD} emissiveIntensity={active ? 0.5 : 0.18} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.12, 20, 16]} />
          <meshStandardMaterial color="#2C1A14" roughness={0.6} />
        </mesh>
        {/* generous invisible hit area for fingers */}
        <mesh position-y={0.6}>
          <sphereGeometry args={[0.6, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {(showLabel || active) && (
          // Anchored at the top of the pin head and lifted above it in screen space,
          // so it never covers the pin whatever the camera angle. The transform must
          // sit on drei's wrapper div (via `style`), otherwise the wrapper's
          // un-transformed box would swallow clicks meant for the pin.
          <Html
            position={[0, 1.15, 0]}
            portal={portal}
            zIndexRange={[20, 10]}
            calculatePosition={clampedLabelPosition}
            style={{ transform: 'translate(-50%, calc(-100% - 8px))' }}
          >
            <button
              type="button"
              onClick={onSelect}
              title={label}
              className={`block whitespace-nowrap max-w-[160px] sm:max-w-none truncate rounded-full px-3 py-1 text-[11px] font-semibold shadow-md border transition-colors ${
                selected
                  ? 'bg-primary text-parchment border-gold'
                  : 'bg-[#FCFAF5]/95 text-primary border-stone-200 dark:bg-stone-800/95 dark:text-parchment dark:border-stone-600'
              }`}
            >
              {label}
            </button>
          </Html>
        )}
      </group>
    </group>
  );
}

const sphericalOffset = (distance, polar, azimuth) =>
  new THREE.Vector3().setFromSphericalCoords(distance, polar, azimuth);

// Smoothly animates OrbitControls' target and the camera towards a goal.
const CameraRig = forwardRef(function CameraRig({ controlsRef, compassRef, defaultDistance, instant }, ref) {
  const { camera } = useThree();
  const goal = useRef(null);

  const currentAzimuth = () => {
    const t = controlsRef.current?.target ?? DEFAULT_TARGET;
    return Math.atan2(camera.position.x - t.x, camera.position.z - t.z);
  };

  const setGoal = (target, distance, polar, azimuth) => {
    goal.current = {
      target: target.clone(),
      position: target.clone().add(sphericalOffset(distance, polar, azimuth)),
    };
  };

  useImperativeHandle(ref, () => ({
    reset: () => setGoal(DEFAULT_TARGET, defaultDistance, DEFAULT_POLAR, DEFAULT_AZIMUTH),
    flyTo: (target) => setGoal(target, 26, 0.75, currentAzimuth()),
    zoom: (factor) => {
      const c = controlsRef.current;
      if (!c) return;
      const offset = camera.position.clone().sub(c.target);
      const distance = THREE.MathUtils.clamp(offset.length() * factor, c.minDistance, c.maxDistance);
      goal.current = {
        target: c.target.clone(),
        position: c.target.clone().add(offset.setLength(distance)),
      };
    },
    cancel: () => { goal.current = null; },
  }));

  // intro: swoop down from high above onto the island
  useLayoutEffect(() => {
    camera.position.copy(DEFAULT_TARGET).add(sphericalOffset(defaultDistance * 1.7, 0.15, -0.7));
    camera.lookAt(DEFAULT_TARGET);
    setGoal(DEFAULT_TARGET, defaultDistance, DEFAULT_POLAR, DEFAULT_AZIMUTH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, dt) => {
    const c = controlsRef.current;
    if (goal.current && c) {
      const k = instant ? 1 : 1 - Math.exp(-Math.min(dt, 0.1) * 3);
      c.target.lerp(goal.current.target, k);
      camera.position.lerp(goal.current.position, k);
      c.update();
      if (
        camera.position.distanceToSquared(goal.current.position) < 1e-4 &&
        c.target.distanceToSquared(goal.current.target) < 1e-4
      ) {
        goal.current = null;
      }
    }
    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${currentAzimuth()}rad)`;
    }
  });

  return null;
});

/* ------------------------------------------------------------------ */
/* Error boundary so a WebGL failure never breaks the Museums page     */
/* ------------------------------------------------------------------ */

class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

const SriLankaMap3D = ({ museums = [], onExplore }) => {
  const { darkMode } = useContext(ThemeContext);
  const { lang } = useContext(LangContext);
  const [selectedId, setSelectedId] = useState(null);
  const [inView, setInView] = useState(true);
  const [zoomHint, setZoomHint] = useState(false);
  const wrapperRef = useRef();
  const controlsRef = useRef();
  const rigRef = useRef();
  const compassRef = useRef();
  const labelLayerRef = useRef();
  const hintTimer = useRef();
  const coarse = useMemo(isCoarsePointer, []);
  const reduceMotion = useMemo(prefersReducedMotion, []);
  const webgl = useMemo(hasWebGL, []);
  const [aspect, setAspect] = useState(null); // measured before the canvas mounts

  const pins = useMemo(
    () =>
      museums
        .filter((m) => Number.isFinite(m.location?.lat) && Number.isFinite(m.location?.lng))
        .map((m, i) => {
          const { x, z } = toScene(m.location.lat, m.location.lng);
          return { museum: m, position: new THREE.Vector3(x, terrainY(x, z), z), phase: i * 0.37 };
        }),
    [museums]
  );
  const selected = pins.find((p) => p.museum._id === selectedId)?.museum;

  // keep forests away from pins and landmarks so they stay readable
  const keepClear = useMemo(
    () => [
      ...pins.map((p) => ({ x: p.position.x, z: p.position.z, r: 1.1 })),
      ...LANDMARKS.flatMap((l) => {
        const p = toScene(l.lat, l.lng);
        return l.clear.map(([dx, dz, r]) => ({ x: p.x + dx, z: p.z + dz, r }));
      }),
    ],
    [pins]
  );

  // portrait screens need the camera further back to fit the whole island
  const defaultDistance = aspect < 1 ? 92 : aspect < 1.4 ? 80 : 72;

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (el) setAspect(el.clientWidth / Math.max(1, el.clientHeight));
  }, []);

  // pause rendering while the map is scrolled out of view
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Desktop: plain wheel scrolls the page; Ctrl/⌘ + wheel (or trackpad pinch) zooms.
  // Touch: pinch always zooms.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      const allow = e.ctrlKey || e.metaKey;
      if (controlsRef.current) controlsRef.current.enableZoom = allow;
      if (!allow) {
        setZoomHint(true);
        clearTimeout(hintTimer.current);
        hintTimer.current = setTimeout(() => setZoomHint(false), 1400);
      }
    };
    const onPointerDown = (e) => {
      if (e.pointerType === 'touch' && controlsRef.current) controlsRef.current.enableZoom = true;
    };
    el.addEventListener('wheel', onWheel, { capture: true, passive: true });
    el.addEventListener('pointerdown', onPointerDown, { capture: true });
    return () => {
      el.removeEventListener('wheel', onWheel, { capture: true });
      el.removeEventListener('pointerdown', onPointerDown, { capture: true });
      clearTimeout(hintTimer.current);
    };
  }, []);

  const selectPin = (pin) => {
    setSelectedId(pin.museum._id);
    rigRef.current?.flyTo(pin.position);
  };

  const resetView = () => {
    setSelectedId(null);
    rigRef.current?.reset();
  };

  const listFallback = (
    <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm font-semibold text-primary dark:text-parchment">The 3D map isn't supported on this device.</p>
      <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1">
        {pins.map(({ museum }) => (
          <li key={museum._id}>
            <button type="button" className="hover:text-gold underline-offset-2 hover:underline" onClick={() => onExplore?.(museum)}>
              {museumName(museum, lang)} — {museum.location?.address}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  // parchment page the illustrated sea fades into
  const seaBackground = darkMode
    ? 'radial-gradient(ellipse at 50% 45%, #1f2a30 0%, #1c1f22 55%, #1a1715 100%)'
    : 'radial-gradient(ellipse at 50% 45%, #f7f2e4 0%, #f1e9d5 60%, #e9dfc6 100%)';

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[560px] sm:h-[620px] rounded-xl overflow-hidden border-2 border-gold shadow-md"
      style={{ background: seaBackground }}
    >
      {!webgl ? (
        listFallback
      ) : aspect === null ? null : (
        <MapErrorBoundary fallback={listFallback}>
          <Canvas
            shadows="percentage"
            dpr={[1, 2]}
            frameloop={inView ? 'always' : 'never'}
            camera={{ fov: 30, near: 1, far: 400, position: [0, 120, 40] }}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
            onPointerMissed={() => setSelectedId(null)}
            aria-label="3D map of Sri Lanka showing museum locations"
            onCreated={({ gl }) => {
              // On phones let one finger scroll the page; two fingers rotate / zoom the map.
              if (coarse) requestAnimationFrame(() => { gl.domElement.style.touchAction = 'pan-y'; });
            }}
          >
            <hemisphereLight args={darkMode ? ['#9fb0d0', '#3a4a3a', 0.9] : ['#fff8e8', '#8a9a6a', 1.35]} />
            <directionalLight
              position={[-22, 38, -18]}
              intensity={darkMode ? 1.5 : 2.6}
              color={darkMode ? '#c9d6ff' : '#ffe9c2'}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
              shadow-camera-near={1}
              shadow-camera-far={120}
              shadow-bias={-0.0004}
              shadow-normalBias={0.03}
            />

            {/* soft fill from the south so faces turned towards the viewer aren't murky */}
            <directionalLight position={[12, 18, 34]} intensity={darkMode ? 0.25 : 0.55} color="#fff2dc" />

            <Sea dark={darkMode} still={reduceMotion} />
            <Island dark={darkMode} />
            <River dark={darkMode} />
            <Trees keepClear={keepClear} />
            <Landmarks dark={darkMode} portal={labelLayerRef} />
            <SeaLabels portal={labelLayerRef} />
            {CLOUDS.map((c) => (
              <Cloud key={c.phase} {...c} still={reduceMotion} dark={darkMode} />
            ))}
            {BOATS.map((b) => (
              <Boat key={b.phase} {...b} still={reduceMotion} />
            ))}

            {pins.map((pin) => (
              <MuseumPin
                key={pin.museum._id}
                label={museumName(pin.museum, lang)}
                position={pin.position}
                phase={pin.phase}
                selected={pin.museum._id === selectedId}
                showLabel={pins.length <= 8}
                onSelect={() => selectPin(pin)}
                portal={labelLayerRef}
                still={reduceMotion}
              />
            ))}

            <OrbitControls
              ref={controlsRef}
              makeDefault
              enablePan={false}
              enableZoom={false}
              enableDamping
              dampingFactor={0.08}
              minDistance={14}
              maxDistance={130}
              maxPolarAngle={1.15}
              rotateSpeed={0.6}
              touches={{ ONE: coarse ? null : THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
              onStart={() => rigRef.current?.cancel()}
            />
            <CameraRig ref={rigRef} controlsRef={controlsRef} compassRef={compassRef} defaultDistance={defaultDistance} instant={reduceMotion} />
          </Canvas>
        </MapErrorBoundary>
      )}

      {/* 3D labels are portalled here, beneath the overlay UI */}
      <div ref={labelLayerRef} className="absolute inset-0 z-0 pointer-events-none [&>*]:pointer-events-auto" />

      {/* ---------- overlay UI ---------- */}
      {webgl && (
        <>
          {/* compass */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-[#FCFAF5]/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow flex items-center justify-center">
              <div ref={compassRef} className="flex flex-col items-center leading-none">
                <span className="text-[9px] font-heading font-bold text-gold">N</span>
                <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
                  <path d="M5 0 L10 9 L5 7 L0 9 Z" fill="#C9A227" />
                  <path d="M5 18 L10 9 L5 11 L0 9 Z" className="fill-stone-400 dark:fill-stone-500" />
                </svg>
              </div>
            </div>
          </div>

          {/* view controls */}
          <div className="absolute top-3 right-3 flex flex-col rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 shadow bg-[#FCFAF5]/90 dark:bg-stone-800/90">
            {[
              { label: 'Zoom in', icon: MdAdd, onClick: () => rigRef.current?.zoom(0.75) },
              { label: 'Zoom out', icon: MdRemove, onClick: () => rigRef.current?.zoom(1.33) },
              { label: 'Reset view', icon: MdCenterFocusStrong, onClick: resetView },
            ].map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                aria-label={label}
                title={label}
                className="w-9 h-9 flex items-center justify-center text-primary dark:text-parchment hover:bg-gold/20 transition-colors border-b last:border-b-0 border-stone-200 dark:border-stone-700"
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* museum quick-pick */}
          {!selected && pins.length > 0 && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {pins.map((pin) => (
                <button
                  key={pin.museum._id}
                  type="button"
                  onClick={() => selectPin(pin)}
                  className="flex items-center gap-1 rounded-full bg-[#FCFAF5]/95 dark:bg-stone-800/95 border border-stone-200 dark:border-stone-700 hover:border-gold px-3 py-1.5 text-[11px] font-semibold text-primary dark:text-parchment shadow transition-colors"
                >
                  <MdLocationOn className="w-3.5 h-3.5 text-gold" />
                  {museumName(pin.museum, lang)}
                </button>
              ))}
            </div>
          )}

          {/* interaction hint */}
          <p
            className={`absolute left-1/2 -translate-x-1/2 top-3 rounded-full bg-primary/85 text-parchment text-[11px] px-3 py-1 pointer-events-none transition-opacity duration-300 ${
              zoomHint ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hold Ctrl (⌘ on Mac) and scroll to zoom
          </p>
          {coarse && !selected && (
            <p className="absolute left-1/2 -translate-x-1/2 top-3 rounded-full bg-primary/70 text-parchment text-[10px] px-3 py-1 pointer-events-none">
              Two fingers to rotate &amp; zoom
            </p>
          )}

          {/* selected museum card */}
          {selected && (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 rounded-xl overflow-hidden bg-[#FCFAF5] dark:bg-stone-800 border border-gold/60 shadow-xl">
              {selected.coverImage && (
                <img src={selected.coverImage} alt="" className="w-full h-28 object-cover" />
              )}
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/65"
              >
                <MdClose className="w-4 h-4" />
              </button>
              <div className="p-4 space-y-2">
                <h4 className="font-heading font-bold text-sm text-primary dark:text-parchment">
                  {museumName(selected, lang)}
                </h4>
                {selected.location?.address && (
                  <p className="flex items-start gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                    <MdLocationOn className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-px" />
                    {selected.location.address}
                  </p>
                )}
                {selected.openingHours?.weekdays && (
                  <p className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                    <MdAccessTime className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    Weekdays {selected.openingHours.weekdays}
                  </p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onExplore?.(selected)}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary text-parchment px-3 py-2 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors font-bold text-[11px] uppercase"
                  >
                    Explore galleries
                    <MdChevronRight className="w-4 h-4 text-gold" />
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selected.location.lat},${selected.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Directions in Google Maps"
                    title="Directions"
                    className="flex items-center justify-center px-3 rounded-lg border border-stone-300 dark:border-stone-600 text-primary dark:text-parchment hover:border-gold transition-colors"
                  >
                    <MdDirections className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SriLankaMap3D;
