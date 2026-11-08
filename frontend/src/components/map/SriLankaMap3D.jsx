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
  HEX_RADIUS,
  SLAB_DEPTH,
  hexes,
  outlines,
  graticule,
  legendStops,
  surfaceHeight,
  toScene,
} from './islandData';

const GOLD = '#C9A227';
const DEFAULT_TARGET = new THREE.Vector3(0.7, 0, 3.5);
const DEFAULT_POLAR = 0.86; // radians from straight-down
const DEFAULT_AZIMUTH = 0.12;
const PIN_SCALE = 2.6;

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

/* ------------------------------------------------------------------ */
/* Scene pieces                                                        */
/* ------------------------------------------------------------------ */

function Island() {
  const meshRef = useRef();

  const hexGeometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(HEX_RADIUS * 0.985, HEX_RADIUS * 0.985, 1, 6);
    g.translate(0, 0.5, 0); // base at y = 0 so scale.y = column height
    return g;
  }, []);

  const slabGeometry = useMemo(() => {
    const shapes = outlines.map((o) => new THREE.Shape(o.map(([x, y]) => new THREE.Vector2(x, y))));
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: SLAB_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.1,
      bevelSegments: 2,
      curveSegments: 1,
    });
    g.rotateX(-Math.PI / 2); // shape's +y (north) becomes -z, extrusion goes up
    return g;
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    const dummy = new THREE.Object3D();
    hexes.forEach((h, i) => {
      dummy.position.set(h.x, SLAB_DEPTH, h.z);
      dummy.scale.set(1, h.height, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, h.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, []);

  useEffect(() => () => {
    hexGeometry.dispose();
    slabGeometry.dispose();
  }, [hexGeometry, slabGeometry]);

  return (
    <group>
      <mesh geometry={slabGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#e6d6b0" roughness={0.95} />
      </mesh>
      <instancedMesh ref={meshRef} args={[hexGeometry, undefined, hexes.length]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </group>
  );
}

function Graticule({ dark, portal }) {
  const geometry = useMemo(() => {
    const { lats, lngs, latRange, lngRange } = graticule;
    const pts = [];
    lats.forEach((lat) => {
      const a = toScene(lat, lngRange[0]);
      const b = toScene(lat, lngRange[1]);
      pts.push(a.x, 0.01, a.z, b.x, 0.01, b.z);
    });
    lngs.forEach((lng) => {
      const a = toScene(latRange[0], lng);
      const b = toScene(latRange[1], lng);
      pts.push(a.x, 0.01, a.z, b.x, 0.01, b.z);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const labelClass = `text-[10px] font-heading tracking-widest select-none whitespace-nowrap ${
    dark ? 'text-stone-500' : 'text-accent/70'
  }`;

  return (
    <group>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={dark ? '#a8a29e' : '#8d6e63'} transparent opacity={dark ? 0.16 : 0.26} />
      </lineSegments>
      {graticule.lats.map((lat) => {
        const p = toScene(lat, graticule.lngRange[0]);
        return (
          <Html key={`lat${lat}`} position={[p.x - 0.8, 0.02, p.z]} center portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
            <span className={labelClass}>{lat}°N</span>
          </Html>
        );
      })}
      {graticule.lngs.map((lng) => {
        const p = toScene(graticule.latRange[0], lng);
        return (
          <Html key={`lng${lng}`} position={[p.x, 0.02, p.z + 0.8]} center portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
            <span className={labelClass}>{lng}°E</span>
          </Html>
        );
      })}
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
          return { museum: m, position: new THREE.Vector3(x, surfaceHeight(x, z), z), phase: i * 0.37 };
        }),
    [museums]
  );
  const selected = pins.find((p) => p.museum._id === selectedId)?.museum;

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

  const seaBackground = darkMode
    ? 'radial-gradient(ellipse at 50% 45%, #22333a 0%, #1f2a2e 35%, #1c1917 80%)'
    : 'radial-gradient(ellipse at 50% 45%, #d4e5e1 0%, #e3ece4 40%, #f6f1e2 85%)';

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
            <hemisphereLight args={[darkMode ? '#cfd8e3' : '#fffaf0', '#8d6e63', darkMode ? 0.9 : 1.25]} />
            <directionalLight
              position={[-22, 38, -18]}
              intensity={darkMode ? 2.0 : 2.4}
              color="#fff1d6"
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

            {/* sea: transparent so the CSS gradient shows, but it still catches the island's shadow */}
            <mesh rotation-x={-Math.PI / 2} receiveShadow>
              <planeGeometry args={[200, 200]} />
              <shadowMaterial transparent opacity={darkMode ? 0.4 : 0.14} />
            </mesh>

            <Graticule dark={darkMode} portal={labelLayerRef} />
            <Island />

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
          {/* compass + legend */}
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
            <div className="hidden sm:block rounded-lg bg-[#FCFAF5]/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow px-2.5 py-2">
              <p className="text-[9px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 mb-1">Elevation</p>
              <div
                className="h-2 w-28 rounded-full"
                style={{ background: `linear-gradient(to right, ${legendStops.map((s) => s.color).join(', ')})` }}
              />
              <div className="flex justify-between text-[9px] text-stone-500 dark:text-stone-400 mt-0.5">
                <span>Sea level</span>
                <span>2,500 m</span>
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
