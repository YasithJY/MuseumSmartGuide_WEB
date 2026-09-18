import React, { useEffect, useRef, useState } from 'react';
import { MdClose, MdMyLocation } from 'react-icons/md';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 8th Wall's Threejs pipeline module expects a global `window.THREE` (it's
// built to work with a plain <script> include of three.js), but our bundler
// only gives us a local ES-module binding — expose it globally so the
// pipeline module can find it.
window.THREE = THREE;

// 8th Wall's engine binary (free, self-hosted since the 8thwall.com platform
// shut down — see https://8thwall.org). It provides markerless world tracking
// (SLAM): the camera feed is analyzed for 6DoF motion so content placed in
// the world stays anchored as the phone moves, without needing a printed
// marker. xrextras/landing-page add the loading spinner and the
// "unsupported browser" screen 8th Wall ships in its own starter templates.
const XR8_SRC = 'https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js';
const XREXTRAS_SRC = 'https://cdn.jsdelivr.net/npm/@8thwall/xrextras@1/dist/xrextras.js';
const LANDING_PAGE_SRC = 'https://cdn.jsdelivr.net/npm/@8thwall/landing-page@1/dist/landing-page.js';

const loadScript = (src, extraAttrs = {}) => new Promise((resolve, reject) => {
  if (document.querySelector(`script[src="${src}"]`)) return resolve();
  const script = document.createElement('script');
  script.src = src;
  script.crossOrigin = 'anonymous';
  Object.entries(extraAttrs).forEach(([k, v]) => script.setAttribute(k, v));
  script.onload = resolve;
  script.onerror = () => reject(new Error(`Failed to load ${src}`));
  document.head.appendChild(script);
});

const waitForXR8 = () => new Promise((resolve) => {
  if (window.XR8) return resolve();
  window.addEventListener('xrloaded', () => resolve(), { once: true });
});

// Markerless WebAR viewer using 8th Wall's SLAM engine + three.js.
// Turns on the camera, tracks the surroundings in 6DoF, and lets the user
// tap anywhere to drop the model onto the real-world floor plane at that spot.
const ARViewer = ({ modelUrl, title, onClose }) => {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [modelStatus, setModelStatus] = useState('loading model…');
  const [debugInfo, setDebugInfo] = useState('');
  const canvasRef = useRef(null);
  const statsRef = useRef({ cameraStatus: 'unknown', exception: '', frames: 0 });

  useEffect(() => {
    let cancelled = false;

    const appKey = import.meta.env.VITE_8THWALL_APP_KEY;
    if (!appKey) {
      setLoadError('Missing 8th Wall app key. Set VITE_8THWALL_APP_KEY in frontend/.env (see 8thwall.com console) and restart the dev server.');
      return;
    }

    // 8th Wall's engine locates its own <script> tag by matching src against
    // /(xrweb|xr\.js)(\?.*)?$/, then reads the appKey from either an
    // `appKey` attribute on that tag or an `?appKey=` query param — without
    // it, XR8.run() rejects with an invalid-key error.
    loadScript(XR8_SRC, { async: 'true', 'data-preload-chunks': 'slam', appKey })
      .then(() => Promise.all([loadScript(XREXTRAS_SRC), loadScript(LANDING_PAGE_SRC)]))
      .then(waitForXR8)
      .then(() => { if (!cancelled) setReady(true); })
      .catch((err) => { if (!cancelled) setLoadError(`Could not load the AR engine: ${err.message}`); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;

    // 8th Wall's FullWindowCanvas module reparents whatever canvas we hand
    // it to a direct child of <body> on its own. Handing it a canvas React
    // never rendered (instead of a ref to a JSX element) avoids a real
    // conflict: if React still thought it owned this node, unmounting would
    // try to remove it from where React put it, not from wherever 8th Wall
    // actually moved it to, which throws.
    const canvas = document.createElement('canvas');
    canvas.id = 'camerafeed';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    let model = null;

    const placementModule = {
      name: 'museum-model-placement',
      onStart: ({ canvas }) => {
        const { scene, camera, renderer } = window.XR8.Threejs.xrScene();

        // GlTextureRenderer draws the raw camera feed to the canvas each
        // frame before Three.js's own render pass runs. Three.js's default
        // autoClear wipes that out before the 3D scene is composited on top,
        // so the canvas ends up fully transparent — visible frames rendered,
        // nothing ever shown. Disabling it is required by every 8th Wall +
        // Three.js integration.
        renderer.autoClear = false;

        // GLB models typically use PBR materials (MeshStandardMaterial etc.)
        // that only reflect actual light sources — with none in the scene
        // they render as flat black silhouettes regardless of the model
        // itself. Add basic ambient + directional lighting.
        scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const sun = new THREE.DirectionalLight(0xffffff, 2);
        sun.position.set(0.5, 1, 0.5);
        scene.add(sun);

        // Camera must start above y=0 — 8th Wall uses this initial height to
        // calibrate real-world scale for the tracked scene.
        camera.position.set(0, 1.6, 0);
        window.XR8.XrController.updateCameraProjectionMatrix({
          origin: camera.position,
          facing: camera.quaternion,
        });

        new GLTFLoader().load(
          modelUrl,
          (gltf) => {
            model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const factor = 2.5 / maxDim;
            model.scale.setScalar(factor);
            model.visible = false;
            scene.add(model);
            setModelStatus('Tap a surface to place the model');
          },
          undefined,
          () => setModelStatus('Model failed to load'),
        );

        const placeAt = (clientX, clientY) => {
          if (!model) return;
          const ndc = new THREE.Vector2(
            (clientX / window.innerWidth) * 2 - 1,
            -(clientY / window.innerHeight) * 2 + 1,
          );
          raycaster.setFromCamera(ndc, camera);
          const hit = new THREE.Vector3();
          if (raycaster.ray.intersectPlane(groundPlane, hit)) {
            model.position.copy(hit);
            model.visible = true;
            setModelStatus(`Placed: ${title}`);
          }
        };

        canvas.addEventListener('pointerdown', (e) => placeAt(e.clientX, e.clientY));
      },
    };

    // Diagnostics: the canvas can render fully transparent (page bleeding
    // through) with no thrown error at all if the camera pipeline never
    // actually starts producing frames — these hooks give us visibility
    // into that without needing devtools on the test device.
    statsRef.current = { cameraStatus: 'unknown', exception: '', frames: 0 };
    const diagnosticsModule = {
      name: 'museum-diagnostics',
      onCameraStatusChange: ({ status }) => { statsRef.current.cameraStatus = status; },
      onException: (error) => { statsRef.current.exception = error?.message || String(error); },
      onRender: () => { statsRef.current.frames += 1; },
    };

    // FullWindowCanvas reparents the canvas to a direct child of <body>
    // without giving it `position: fixed` — it just sits in normal document
    // flow (rendering below the app's own content, off the visible screen)
    // instead of overlaying the viewport. Force it back into place.
    const pinCanvas = () => {
      if (canvas.style.position !== 'fixed') canvas.style.position = 'fixed';
      if (canvas.style.top !== '0px') canvas.style.top = '0px';
      if (canvas.style.left !== '0px') canvas.style.left = '0px';
      if (canvas.style.zIndex !== '1') canvas.style.zIndex = '1';
    };

    const debugInterval = setInterval(() => {
      pinCanvas();
      const s = statsRef.current;
      const allCanvases = document.querySelectorAll('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
      setDebugInfo(
        `canvas ${canvas.width}x${canvas.height} (css ${canvas.offsetWidth}x${canvas.offsetHeight}) z:${getComputedStyle(canvas).zIndex} parent:${canvas.parentElement?.tagName} | ` +
        `camera:${s.cameraStatus} | frames:${s.frames} | #canvases:${allCanvases.length} | gl:${gl ? 'ok' : 'NULL'}` +
        (s.exception ? ` | EXC:${s.exception}` : '')
      );
    }, 300);
    pinCanvas();

    // XR8.run() throws/rejects synchronously on an invalid or unregistered
    // app key. Uncaught, that crashes the whole React tree since nothing
    // else in the app catches errors from inside an effect — surface it as
    // a visible error instead.
    try {
      window.XR8.clearCameraPipelineModules();
      window.XR8.addCameraPipelineModules([
        window.XR8.GlTextureRenderer.pipelineModule(),
        window.XR8.Threejs.pipelineModule(),
        window.XR8.XrController.pipelineModule(),
        window.LandingPage.pipelineModule(),
        window.XRExtras.FullWindowCanvas.pipelineModule(),
        window.XRExtras.Loading.pipelineModule(),
        window.XRExtras.RuntimeError.pipelineModule(),
        diagnosticsModule,
        placementModule,
      ]);
      window.XR8.run({ canvas });
    } catch (err) {
      setLoadError(`AR engine failed to start: ${err.message}`);
    }

    return () => {
      clearInterval(debugInterval);
      window.XR8?.stop();
      canvas.remove();
      canvasRef.current = null;
    };
  }, [ready, modelUrl, title]);

  const recenter = () => window.XR8?.XrController?.recenter();

  return (
    <div className="fixed inset-0 z-[100] bg-black pointer-events-none" style={{ background: ready ? 'transparent' : 'black' }}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors pointer-events-auto"
      >
        <MdClose className="w-7 h-7" />
      </button>

      {ready && (
        <button
          onClick={recenter}
          className="absolute top-4 left-4 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors pointer-events-auto"
          title="Recenter"
        >
          <MdMyLocation className="w-6 h-6" />
        </button>
      )}

      <div className="absolute bottom-6 left-4 right-4 z-20 bg-black/60 text-white text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg text-center">
        {loadError
          ? loadError
          : !ready
            ? 'Starting AR camera…'
            : modelStatus}
      </div>

      {debugInfo && (
        <div className="absolute bottom-20 left-4 right-4 z-20 bg-black/70 text-lime-300 text-[10px] font-mono px-2 py-1 rounded break-all">
          {debugInfo}
        </div>
      )}

      {!ready && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      )}
    </div>
  );
};

export default ARViewer;
