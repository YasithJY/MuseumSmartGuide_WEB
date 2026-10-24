import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { MdClose, MdViewInAr, MdPlayArrow, MdPause } from 'react-icons/md';

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
//
// `narration` is a list of { code, label, full, src } tracks; the bar it
// drives lives outside <model-viewer>, so it shows on this 3D preview but not
// inside native AR (Quick Look / Scene Viewer) or WebXR.
const ARViewer = ({ modelUrl, iosModelUrl, title, narration = [], lang, onLangChange, narrationLabel = 'Audio Guide Narrator', onClose }) => {
  const viewerRef = useRef(null);
  const audioRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = narration.find(t => t.code === lang) || narration[0];
  const trackSrc = track?.src;

  // Only one narration at a time: silence the exhibit page's player while
  // the viewer is open, and stop ours when the viewer closes.
  useEffect(() => {
    const audio = audioRef.current;
    document.querySelectorAll('audio').forEach(a => { if (a !== audio) a.pause(); });
    return () => audio?.pause();
  }, []);

  // The src is set imperatively rather than as a JSX prop: React re-applying
  // the attribute would restart loading and cut playback. Switching language
  // mid-play carries straight on in the new language.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackSrc) return;
    const wasPlaying = !audio.paused;
    audio.src = trackSrc;
    setProgress(0);
    if (wasPlaying) audio.play().catch(err => console.error('Playback interrupted:', err));
  }, [trackSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(err => console.error('Playback interrupted:', err));
    else audio.pause();
  };

  const handleTimeUpdate = () => {
    const { currentTime, duration } = audioRef.current;
    setProgress(duration ? (currentTime / duration) * 100 : 0);
  };

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

      {track && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-sm bg-primary/90 backdrop-blur-sm text-parchment border border-gold/40 rounded-xl shadow-lg px-3 py-2.5">
          <audio
            ref={audioRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
              className="flex-shrink-0 p-2.5 bg-gold hover:bg-yellow-600 text-primary rounded-full transition-colors"
            >
              {isPlaying ? <MdPause className="w-5 h-5" /> : <MdPlayArrow className="w-5 h-5" />}
            </button>

            <div className="min-w-0 flex-1 flex flex-col gap-1.5">
              <span className="text-[10px] uppercase text-gold tracking-widest font-bold font-heading truncate">
                {narrationLabel}
              </span>
              <div className="h-1 bg-stone-700 rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {narration.length > 1 && (
              <div className="flex-shrink-0 flex border border-stone-600 rounded-lg overflow-hidden">
                {narration.map(t => (
                  <button
                    key={t.code}
                    title={t.full}
                    onClick={() => onLangChange?.(t.code)}
                    className={`px-2 py-1 text-xs font-bold transition-colors
                      ${t.code === track.code ? 'bg-gold text-primary' : 'text-stone-300 hover:bg-white/10'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!loaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      )}

      {loadError && (
        <div className="absolute top-20 left-4 right-4 z-20 bg-black/60 text-white text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg text-center">
          {loadError}
        </div>
      )}
    </div>
  );
};

export default ARViewer;
