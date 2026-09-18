import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { MdClose, MdViewInAr } from 'react-icons/md';

// Renders the model with Google's <model-viewer> web component instead of
// running our own camera/SLAM pipeline. Tapping "View in AR" hands the
// session off to the platform's native AR viewer — WebXR/Scene Viewer
// (ARCore) on Android, AR Quick Look (ARKit) on iOS — which gives real
// persistent world anchors plus built-in pinch-to-scale and rotate for
// free. The trade-off is that once AR launches, that view is native UI we
// can no longer skin with our own buttons.
//
// iOS Quick Look only accepts USDZ models (not glb/gltf) via `ios-src`.
// None of our exhibits have a USDZ export yet, so on iPhone this currently
// falls back to the in-page 3D preview below (drag to orbit, pinch to zoom)
// without a native AR handoff — pass `iosModelUrl` once USDZ versions exist.
const ARViewer = ({ modelUrl, iosModelUrl, title, onClose }) => {
  const viewerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const node = viewerRef.current;
    if (!node) return;
    const onLoad = () => setLoaded(true);
    const onError = () => setLoadError('Could not load the 3D model.');
    node.addEventListener('load', onLoad);
    node.addEventListener('error', onError);
    return () => {
      node.removeEventListener('load', onLoad);
      node.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <MdClose className="w-7 h-7" />
      </button>

      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        ios-src={iosModelUrl || undefined}
        alt={title}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        className="w-full h-full"
      >
        <button
          slot="ar-button"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-primary text-parchment border border-gold px-4 py-2.5 rounded-lg shadow-lg"
        >
          <MdViewInAr className="w-5 h-5 text-gold" />
          View in your space
        </button>
      </model-viewer>

      {!loaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      )}

      {loadError && (
        <div className="absolute bottom-24 left-4 right-4 z-20 bg-black/60 text-white text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg text-center">
          {loadError}
        </div>
      )}
    </div>
  );
};

export default ARViewer;
