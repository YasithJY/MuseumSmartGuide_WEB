// Sigiriya (Lion Rock) in miniature: a sheer granite monolith with grey,
// rust-stained, rain-streaked walls, and a long tilted summit covered in a grid
// of terraced brick ruins and grass, fringed with trees. Exaggerated in size so
// it reads at map scale.
//
// Local frame: origin = ground at the rock's centre, x = east, z = south, y = up.
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const SCALE = 1.3;
const RX = 0.62; // half-length (long axis, east-west)
const RZ = 0.4; // half-width
const H = 1.0; // height of the cliffs
const SEGMENTS = 64;
const ROWS = 44;

// Side profile (radius fraction, height fraction): steep walls that bulge out a
// little up high, a rounded lip, then the summit plateau.
const PROFILE = new THREE.SplineCurve(
  [
    [1.08, -0.1], [1.03, 0.0], [0.98, 0.1], [0.97, 0.3], [0.99, 0.55],
    [1.0, 0.75], [0.98, 0.88], [0.93, 0.95], [0.85, 0.985], [0.6, 1.0], [0.0, 1.0],
  ].map(([r, h]) => new THREE.Vector2(r, h))
);
const TABLE = Array.from({ length: 241 }, (_, k) => PROFILE.getPoint(k / 240));

const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const hash = (x, z) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Irregular, fluted outline with a rounded, bulging nose at the west end.
const wobble = (theta, h) =>
  1 +
  0.045 * Math.sin(3 * theta + 1.3) +
  0.03 * Math.sin(5 * theta + 0.4) +
  0.018 * Math.sin(17 * theta + 2 * h) +
  0.05 * Math.exp(-((theta - Math.PI) ** 2) / 0.4) * smoothstep(0.3, 0.8, h);

// the summit tilts: the west end stands higher than the east
const tilt = (x, h) => Math.pow(Math.max(0, h), 3) * 0.16 * (-x / RX);

const surfacePoint = (theta, r, h, out = 0) => {
  const n = wobble(theta, h);
  const x = Math.cos(theta) * (r * RX * n + out);
  const z = Math.sin(theta) * (r * RZ * n + out);
  return new THREE.Vector3(x, h * H + tilt(x, h), z);
};

const pointOnRock = (theta, h, out = 0) => {
  const p = TABLE.find((q) => q.y >= h) ?? TABLE[TABLE.length - 1];
  return surfacePoint(theta, p.x, h, out);
};

// Height of the summit surface at local (x, z).
const summitY = (x, z) => {
  const rho = Math.hypot(x / RX, z / RZ);
  let p = TABLE[TABLE.length - 1];
  for (let k = TABLE.length - 1; k >= 0 && TABLE[k].x < rho; k--) p = TABLE[k];
  return p.y * H + tilt(x, p.y);
};

const C = (hex) => new THREE.Color(hex);
const GREY = C('#a8a29a');
const PALE = C('#d4cdc2');
const SLATE = C('#5e6068');
const RUST = C('#b8693b');
const MOSS = C('#6f8f45');

const buildRockGeometry = () => {
  const pos = [];
  const col = [];
  const c = new THREE.Color();
  for (let j = 0; j <= ROWS; j++) {
    const p = PROFILE.getPoint(j / ROWS);
    const h = p.y;
    for (let i = 0; i <= SEGMENTS; i++) {
      const theta = (i / SEGMENTS) * Math.PI * 2;
      const v = surfacePoint(theta, p.x, h);
      pos.push(v.x, v.y, v.z);

      // weathered granite: pale and grey bands, dark rain streaks, rust stains
      c.copy(GREY).lerp(PALE, smoothstep(0.55, 1, 0.5 + 0.5 * Math.sin(theta * 11 + 1.7 * Math.sin(theta * 3 + h * 4))) * 0.7);
      c.lerp(SLATE, smoothstep(0.6, 1, 0.5 + 0.5 * Math.sin(theta * 19 + h * 5 + 1.1)) * 0.65);
      const rust =
        smoothstep(0.2, 0.9, 0.5 + 0.5 * Math.sin(theta * 2 + 2.4)) *
        smoothstep(0.45, 1, 0.5 + 0.5 * Math.sin(theta * 9 + h * 3)) *
        (1 - smoothstep(0.75, 0.95, h));
      c.lerp(RUST, rust * 0.9);
      c.lerp(SLATE, (1 - smoothstep(0.0, 0.25, h)) * 0.35); // darker at the foot
      c.lerp(MOSS, smoothstep(0.93, 0.975, h)); // grassy lip and summit
      col.push(c.r, c.g, c.b);
    }
  }
  const index = [];
  const row = SEGMENTS + 1;
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < SEGMENTS; i++) {
      const a = j * row + i;
      index.push(a, a + 1, a + row, a + 1, a + row + 1, a + row);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
};

// Terraced ruins: tiers stepping down the tilted summit, each split into a few
// plots of different widths, mostly grass with the odd exposed brick floor.
const TIER = 0.15;
const STEP = 0.03;
const TERRACE_DEPTH = 0.1;
const buildTerraces = () => {
  const grass = [];
  const brick = [];
  for (let x0 = -RX; x0 < RX - 0.01; x0 += TIER) {
    const x = x0 + TIER / 2;
    const half = RZ * 0.8 * Math.sqrt(Math.max(0, 1 - (x / (RX * 0.82)) ** 2));
    if (half < 0.07) continue;
    const n = 2 + Math.floor(hash(x, 7) * 3);
    const weights = Array.from({ length: n }, (_, k) => 0.6 + hash(x, k + 11));
    const total = weights.reduce((a, b) => a + b, 0);
    let z = -half;
    weights.forEach((w, k) => {
      const d = (2 * half * w) / total;
      const zc = z + d / 2;
      z += d;
      const r = hash(x + k, zc);
      const top = Math.ceil((summitY(x, zc) + 0.015) / STEP) * STEP + (r > 0.6 ? STEP : 0);
      (r > 0.88 ? brick : grass).push({ x, z: zc, w: TIER * 0.93, d: d * 0.93, top });
    });
  }
  return { grass, brick };
};

// Trees and shrubs along the summit rim, plus a few clinging to cliff ledges.
const buildShrubs = () => {
  const out = [];
  const N = 26;
  for (let k = 0; k < N; k++) {
    const theta = (k / N) * Math.PI * 2 + (hash(k, 1) - 0.5) * 0.2;
    const rho = 0.84 + hash(k, 2) * 0.1;
    const x = Math.cos(theta) * rho * RX;
    const z = Math.sin(theta) * rho * RZ;
    out.push({ x, y: summitY(x, z) + 0.015, z, r: 0.035 + hash(k, 3) * 0.03 });
  }
  [[0.6, 0.45], [2.2, 0.62], [3.6, 0.38], [5.1, 0.55]].forEach(([theta, h], k) => {
    const p = pointOnRock(theta, h, 0.025);
    out.push({ x: p.x, y: p.y, z: p.z, r: 0.04 + hash(k, 4) * 0.02 });
  });
  return out;
};

const SHRUB_COLORS = ['#4f8a3a', '#5e9a44', '#447d35', '#6aa24b'].map(C);
const LEDGE_Y = 0.52 * H; // grassy ledge partway up the north face

export default function Sigiriya() {
  const grassRef = useRef();
  const brickRef = useRef();
  const shrubRef = useRef();

  const assets = useMemo(() => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, -0.5, 0); // top face at y = 0
    const wall = new THREE.MeshStandardMaterial({ color: '#8c5a43', roughness: 0.95 });
    const grassTop = new THREE.MeshStandardMaterial({ color: '#88aa58', roughness: 0.95 });
    const brickTop = new THREE.MeshStandardMaterial({ color: '#a8694e', roughness: 0.95 });
    return {
      rock: buildRockGeometry(),
      box,
      shrub: new THREE.IcosahedronGeometry(1, 0),
      // BoxGeometry groups: +x, -x, +y (top), -y, +z, -z
      grassMaterials: [wall, wall, grassTop, wall, wall, wall],
      brickMaterials: [wall, wall, brickTop, wall, wall, wall],
      ...buildTerraces(),
      shrubs: buildShrubs(),
    };
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const place = (mesh, list) => {
      list.forEach((t, i) => {
        dummy.position.set(t.x, t.top, t.z);
        dummy.scale.set(t.w, TERRACE_DEPTH, t.d);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };
    place(grassRef.current, assets.grass);
    place(brickRef.current, assets.brick);
    assets.shrubs.forEach((s, i) => {
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(s.r, s.r * 0.85, s.r);
      dummy.updateMatrix();
      shrubRef.current.setMatrixAt(i, dummy.matrix);
      shrubRef.current.setColorAt(i, SHRUB_COLORS[i % SHRUB_COLORS.length]);
    });
    shrubRef.current.instanceMatrix.needsUpdate = true;
    shrubRef.current.instanceColor.needsUpdate = true;
    shrubRef.current.computeBoundingSphere();
  }, [assets]);

  useEffect(
    () => () => {
      assets.rock.dispose();
      assets.box.dispose();
      assets.shrub.dispose();
      new Set([...assets.grassMaterials, ...assets.brickMaterials]).forEach((m) => m.dispose());
    },
    [assets]
  );

  const ledge = pointOnRock(-Math.PI / 2 + 0.35, LEDGE_Y / H, 0.06);

  return (
    <group scale={SCALE}>
      <mesh geometry={assets.rock} castShadow receiveShadow>
        <meshStandardMaterial vertexColors emissive="#4a4540" emissiveIntensity={0.3} roughness={0.95} flatShading />
      </mesh>

      {/* grassy ledge on the north side */}
      <group position={[ledge.x, LEDGE_Y, ledge.z]} rotation-y={-0.25}>
        <mesh position-y={-LEDGE_Y / 2} castShadow receiveShadow>
          <boxGeometry args={[0.42, LEDGE_Y, 0.16]} />
          <meshStandardMaterial color="#8f8a84" emissive="#3a3530" emissiveIntensity={0.25} roughness={0.95} flatShading />
        </mesh>
        <mesh position-y={0.01}>
          <boxGeometry args={[0.43, 0.02, 0.17]} />
          <meshStandardMaterial color="#7fa552" roughness={0.95} />
        </mesh>
      </group>

      {/* terraced palace ruins on the summit */}
      <instancedMesh ref={grassRef} args={[assets.box, assets.grassMaterials, assets.grass.length]} castShadow receiveShadow />
      <instancedMesh ref={brickRef} args={[assets.box, assets.brickMaterials, assets.brick.length]} castShadow receiveShadow />

      {/* trees on the rim and ledges */}
      <instancedMesh ref={shrubRef} args={[assets.shrub, undefined, assets.shrubs.length]} castShadow>
        <meshStandardMaterial flatShading roughness={0.9} />
      </instancedMesh>
    </group>
  );
}
