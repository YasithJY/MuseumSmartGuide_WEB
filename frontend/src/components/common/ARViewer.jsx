import React, { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';

const AFRAME_SRC = 'https://aframe.io/releases/1.4.2/aframe.min.js';
const ARJS_SRC = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js';

const loadScript = (src) => new Promise((resolve, reject) => {
  if (document.querySelector(`script[src="${src}"]`)) return resolve();
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = resolve;
  script.onerror = () => reject(new Error(`Failed to load ${src}`));
  document.body.appendChild(script);
});

// Marker-based WebAR viewer using AR.js + A-Frame.
// Scans the standard "Hiro" marker and renders the given glTF/GLB model on top of it.
const ARViewer = ({ modelUrl, title, onClose }) => {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [markerFound, setMarkerFound] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [modelStatus, setModelStatus] = useState('loading model…');
  const sceneRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadScript(AFRAME_SRC)
      .then(() => loadScript(ARJS_SRC))
      .then(() => { if (!cancelled) setReady(true); })
      .catch(() => { if (!cancelled) setLoadError('Could not load the AR engine. Check your connection and try again.'); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const marker = sceneRef.current?.querySelector('a-marker');
    if (!marker) return;
    const onFound = () => setMarkerFound(true);
    const onLost = () => setMarkerFound(false);
    marker.addEventListener('markerFound', onFound);
    marker.addEventListener('markerLost', onLost);
    return () => {
      marker.removeEventListener('markerFound', onFound);
      marker.removeEventListener('markerLost', onLost);
    };
  }, [ready]);

  // The GLB's native units are unknown, so guessing a fixed scale either makes
  // it invisibly tiny or absurdly huge. Once the model loads, measure its real
  // bounding box and rescale it to a size sensible relative to the marker.
  useEffect(() => {
    if (!ready) return;
    const entity = sceneRef.current?.querySelector('[gltf-model]');
    if (!entity) return;

    const onLoaded = (e) => {
      try {
        const THREE = window.AFRAME.THREE;
        const model = e.detail.model;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 1.5;
        const factor = targetSize / maxDim;
        entity.setAttribute('scale', `${factor} ${factor} ${factor}`);
        setModelStatus(`model loaded: raw size ${size.x.toFixed(2)}x${size.y.toFixed(2)}x${size.z.toFixed(2)} → scale ${factor.toFixed(4)}`);
      } catch (err) {
        setModelStatus(`model-loaded handler error: ${err.message}`);
      }
    };
    const onError = () => setModelStatus('MODEL FAILED TO LOAD');

    entity.addEventListener('model-loaded', onLoaded);
    entity.addEventListener('model-error', onError);
    return () => {
      entity.removeEventListener('model-loaded', onLoaded);
      entity.removeEventListener('model-error', onError);
    };
  }, [ready]);

  // AR.js hardcodes the camera feed's z-index to -2 (#arjs-video) and also
  // letterboxes both the video and the a-scene canvas to a small fixed-ish
  // box instead of the viewport. Force both to fill the screen, above the
  // page but below our own UI overlay (z-[100]), and keep reasserting it
  // since AR.js recomputes its own (small) sizing on resize/orientation.
  useEffect(() => {
    if (!ready) return;

    const DESIRED = {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      marginLeft: '0px',
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      objectFit: 'cover',
    };

    const isCorrect = (el) => Object.entries(DESIRED).every(([k, v]) => el.style[k] === v);

    const fillScreen = (el, zIndex) => {
      if (!el || isCorrect(el)) return;
      Object.assign(el.style, DESIRED);
      el.style.zIndex = zIndex;
    };

    const updateDebug = () => {
      const video = document.getElementById('arjs-video');
      const canvas = sceneRef.current?.querySelector('canvas');
      setDebugInfo(
        `win ${window.innerWidth}x${window.innerHeight} | ` +
        `video ${video ? `${video.offsetWidth}x${video.offsetHeight} ml:${video.style.marginLeft}` : 'none'} | ` +
        `canvas ${canvas ? `${canvas.offsetWidth}x${canvas.offsetHeight} ml:${canvas.style.marginLeft}` : 'none'}`
      );
    };

    // AR.js reapplies its own (small, centered) sizing continuously as it
    // processes camera frames, so a polling interval alone loses the race.
    // Watch the style attribute directly and correct it the instant AR.js
    // touches it.
    let videoObserver = null;
    let canvasObserver = null;

    const attach = () => {
      const video = document.getElementById('arjs-video');
      const canvas = sceneRef.current?.querySelector('canvas');

      if (video) {
        fillScreen(video, '1');
        if (!videoObserver) {
          videoObserver = new MutationObserver(() => fillScreen(video, '1'));
          videoObserver.observe(video, { attributes: true, attributeFilter: ['style'] });
        }
      }
      if (canvas) {
        fillScreen(canvas, '2');
        if (!canvasObserver) {
          canvasObserver = new MutationObserver(() => fillScreen(canvas, '2'));
          canvasObserver.observe(canvas, { attributes: true, attributeFilter: ['style'] });
        }
      }
      updateDebug();
    };

    attach();
    const interval = setInterval(attach, 300);

    return () => {
      clearInterval(interval);
      videoObserver?.disconnect();
      canvasObserver?.disconnect();
      document.getElementById('arjs-video')?.remove();
    };
  }, [ready]);

  return (
    <div className="fixed inset-0 z-[100] bg-black" style={{ background: ready ? 'transparent' : 'black' }}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <MdClose className="w-7 h-7" />
      </button>

      <div className="absolute top-4 left-4 z-20 bg-black/60 text-white text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg max-w-[75%]">
        {loadError
          ? loadError
          : !ready
            ? 'Starting AR camera…'
            : markerFound
              ? `Viewing: ${title}`
              : 'Point your camera at the AR marker'}
      </div>

      {debugInfo && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 text-lime-300 text-[10px] font-mono px-2 py-1 rounded break-all space-y-1">
          <div>{debugInfo}</div>
          <div>{modelStatus}</div>
        </div>
      )}

      {!ready && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      )}

      {ready && (
        <div ref={sceneRef} className="w-full h-full">
          <a-scene
            embedded
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; alpha: true"
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;"
          >
            <a-marker preset="hiro">
              <a-entity
                gltf-model={modelUrl}
                scale="1 1 1"
                position="0 0 0"
                rotation="-90 0 0"
              ></a-entity>
            </a-marker>
            <a-entity camera=""></a-entity>
          </a-scene>
        </div>
      )}
    </div>
  );
};

export default ARViewer;
