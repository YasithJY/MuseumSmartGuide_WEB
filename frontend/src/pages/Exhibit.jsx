import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AudioPlayer from '../components/common/AudioPlayer';
import ARViewer from '../components/common/ARViewer';
import { MdBookmark, MdBookmarkBorder, MdShare, MdArrowBack, MdZoomIn, MdClose, MdViewInAr, MdOutlineQuiz, MdOutlineAccountBalance } from 'react-icons/md';
import ironSmeltingOvenModel from '../assets/3Dmodels/Iron_Smelting_Oven_1.glb?url';
import jethawanaramayaModel from '../assets/3Dmodels/Jethawanaramaya.glb?url';
import sigiriyaModel from '../assets/3Dmodels/sigiriya_1.glb?url';
import tamilAudioSmelting from '../assets/audio/Audio - Tamil/Ancient Wind-Powered Iron Furnaces in Sri Lanka.mp3?url';
import tamilAudioKulasinghe from '../assets/audio/Audio - Tamil/Arumadura Nandasena de Silva Kulasinghe.mp3?url';
import tamilAudioBisokotuwa from '../assets/audio/Audio - Tamil/Bisokotuwa.mp3?url';
import tamilAudioWimalasurendra from '../assets/audio/Audio - Tamil/Devapura Jayasena Wimalasurendra.mp3?url';
import tamilAudioElephantLamp from '../assets/audio/Audio - Tamil/Elephant Lamp.mp3?url';
import tamilAudioRampala from '../assets/audio/Audio - Tamil/Eng. Bamunusinghearachchige Don Rampala.mp3?url';
import tamilAudioJetavana from '../assets/audio/Audio - Tamil/Jetavana Stupa.mp3?url';
import tamilAudioSigiriya from '../assets/audio/Audio - Tamil/Sigiriya.mp3?url';

const API = '/api';

// Per-exhibit AR model, keyed by exhibit _id. Falls back to the smelting
// oven model for exhibits without a dedicated one yet.
const AR_MODEL_BY_EXHIBIT_ID = {
  '65d75b0a66f50b2984950023': jethawanaramayaModel, // Jetavana Stupa (Jethawanarama)
  '65d75b0a66f50b2984950024': sigiriyaModel, // Sigiriya
};

// Tamil audio narration, keyed by exhibit _id. The backend only stores one
// (English) audioUrl per exhibit, so the Tamil track is swapped in on the
// frontend when the visitor selects the Tamil language tab.
const TAMIL_AUDIO_BY_EXHIBIT_ID = {
  '65d75b0a66f50b2984950021': tamilAudioSmelting, // Wind-Powered Steel Smelting
  '65d75b0a66f50b2984950022': tamilAudioElephantLamp, // Elephant Lamp (Ath Pahana)
  '65d75b0a66f50b2984950023': tamilAudioJetavana, // Jetavana Stupa (Jethawanarama)
  '65d75b0a66f50b2984950024': tamilAudioSigiriya, // Sigiriya
  '65d75b0a66f50b2984950025': tamilAudioRampala, // Eng. Bamunusinghearachchige Don Rampala
  '65d75b0a66f50b2984950026': tamilAudioKulasinghe, // Arumadura Nandasena de Silva Kulasinghe
  '65d75b0a66f50b2984950027': tamilAudioWimalasurendra, // Devapura Jayasena Wimalasurendra
  '65d75b0a66f50b2984950028': tamilAudioBisokotuwa, // Bisokotuwa
};

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'si', label: 'සිං', full: 'Sinhala' },
  { code: 'ta', label: 'தமி', full: 'Tamil' },
];

const Exhibit = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [exhibit, setExhibit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFav, setIsFav] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [related, setRelated] = useState([]);

  // ── Language switcher (local to this page) ──────────────────────────────────
  const [displayLang, setDisplayLang] = useState('en');

  // ── Image zoom overlay ──────────────────────────────────────────────────────
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImg, setZoomImg] = useState('');

  // ── AR viewer ─────────────────────────────────────────────────────────────
  const [arOpen, setArOpen] = useState(false);

  useEffect(() => {
    fetchExhibitDetails();
  }, [id]);

  const fetchExhibitDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API}/exhibits/${id}`);
      const found = data.data;
      if (found) {
        setExhibit(found);
        setActiveImage(found.images?.[0] || '');

        if (found.relatedArtifacts?.length > 0) {
          const relRes = await Promise.allSettled(
            found.relatedArtifacts.map(rid =>
              axios.get(`${API}/exhibits/${typeof rid === 'object' ? rid._id : rid}`)
            )
          );
          setRelated(relRes.filter(r => r.status === 'fulfilled').map(r => r.value.data.data).filter(Boolean));
        }

        const visits = JSON.parse(localStorage.getItem('visitHistory') || '[]');
        if (!visits.includes(found._id)) {
          localStorage.setItem('visitHistory', JSON.stringify([found._id, ...visits].slice(0, 20)));
        }
        const favList = JSON.parse(localStorage.getItem('mockFavs') || '[]');
        setIsFav(favList.includes(found._id));
      } else {
        setError('Exhibit not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exhibit.');
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  // Get translated field or fall back to English
  const tx = (field) => {
    if (displayLang === 'en' || !exhibit?.translations?.[displayLang]?.[field]) {
      return exhibit?.[field] || '';
    }
    return exhibit.translations[displayLang][field] || exhibit[field] || '';
  };

  const toggleFav = () => {
    if (!token) { alert('Please log in to save exhibits!'); return; }
    const favList = JSON.parse(localStorage.getItem('mockFavs') || '[]');
    const updated = favList.includes(exhibit._id)
      ? favList.filter(i => i !== exhibit._id)
      : [...favList, exhibit._id];
    setIsFav(!isFav);
    localStorage.setItem('mockFavs', JSON.stringify(updated));
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: exhibit.title, text: exhibit.description, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const openZoom = (img) => { setZoomImg(img); setZoomOpen(true); };
  const closeZoom = () => setZoomOpen(false);

  // ── States ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error || !exhibit) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="flex justify-center"><MdOutlineAccountBalance className="text-5xl text-stone-400" /></div>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-semibold">{error || 'Artifact details not found.'}</p>
        <Link to="/museums" className="text-gold hover:underline text-sm">Back to Galleries</Link>
      </div>
    );
  }

  const fallbackImg = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* ── Top Nav bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to={exhibit.galleryId?._id ? `/gallery/${exhibit.galleryId._id}` : '/museums'}
          className="inline-flex items-center gap-1 text-xs text-primary dark:text-stone-300 hover:text-gold uppercase font-bold">
          <MdArrowBack className="w-4 h-4" />
          <span>Back to {exhibit.galleryId?.name || 'Galleries'}</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {/* ── Language Switcher ── */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm">
            {LANGS.map(l => (
              <button
                key={l.code}
                title={l.full}
                onClick={() => setDisplayLang(l.code)}
                className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-colors
                  ${displayLang === l.code
                    ? 'bg-primary text-parchment'
                    : 'text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Save */}
          <button onClick={toggleFav}
            className="flex items-center gap-1 text-xs border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-lg shadow-sm hover:border-gold transition-colors font-bold uppercase">
            {isFav ? <MdBookmark className="text-gold w-4 h-4" /> : <MdBookmarkBorder className="w-4 h-4" />}
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share */}
          <button onClick={handleShare}
            className="flex items-center gap-1 text-xs border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-lg shadow-sm hover:border-gold transition-colors font-bold uppercase">
            <MdShare className="w-4 h-4 text-primary" />
            <span>{shareSuccess ? 'Copied!' : 'Share'}</span>
          </button>

          {/* AR View */}
          <button onClick={() => setArOpen(true)}
            className="flex items-center gap-1 text-xs border border-gold bg-primary text-parchment px-3 py-1.5 rounded-lg shadow-sm hover:bg-primary/90 transition-colors font-bold uppercase">
            <MdViewInAr className="w-4 h-4 text-gold" />
            <span>AR View</span>
          </button>

          {/* Quiz */}
          <Link to={`/quiz/exhibit/${exhibit._id}`}
            className="flex items-center gap-1 text-xs border border-gold bg-gold text-primary px-3 py-1.5 rounded-lg shadow-sm hover:bg-yellow-600 transition-colors font-bold uppercase">
            <MdOutlineQuiz className="w-4 h-4" />
            <span>Quiz</span>
          </Link>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Images column */}
        <div className="space-y-4">
          {/* Main image with zoom-on-hover */}
          <div
            className="relative h-96 w-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-md bg-stone-100 dark:bg-stone-800 group cursor-zoom-in"
            onClick={() => openZoom(activeImage || fallbackImg)}
          >
            <img
              src={activeImage || fallbackImg}
              alt={exhibit.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />
            {/* Hover hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <MdZoomIn className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Click to Enlarge</span>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          {exhibit.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {exhibit.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(img)}
                  className={`w-20 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-gold shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details column */}
        <div className="space-y-6">
          <div className="space-y-2">
            {exhibit.galleryId?.name && (
              <span className="text-xs uppercase text-accent font-bold tracking-widest font-heading block">
                {exhibit.galleryId.name}
              </span>
            )}
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary dark:text-parchment uppercase leading-tight">
              {tx('title')}
            </h1>
            <div className="w-20 h-1 bg-gold"></div>
          </div>

          <p className="text-base text-stone-500 dark:text-stone-300 leading-relaxed font-light" style={{ whiteSpace: 'pre-wrap' }}>{tx('description')}</p>


          {(() => {
            const audioSrc = (displayLang === 'ta' && TAMIL_AUDIO_BY_EXHIBIT_ID[exhibit._id]) || exhibit.audioUrl;
            return audioSrc && <AudioPlayer src={audioSrc} title={exhibit.title} />;
          })()}

          {exhibit.videoUrl && (
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-primary uppercase">Video Guide</h3>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow">
                <video src={exhibit.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Historical & Timeline ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-stone-200/60 dark:border-stone-700/60">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-lg text-primary dark:text-parchment uppercase tracking-wide">
            Historical Background &amp; Significance
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-300 leading-relaxed font-light whitespace-pre-line">
            {tx('historicalInfo')}
          </p>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-heading font-bold text-lg text-primary dark:text-parchment uppercase tracking-wide">Chronological Timeline</h3>
          <div className="relative border-l-2 border-gold/40 pl-6 ml-2 space-y-6">
            {exhibit.timeline?.length > 0 ? (
              exhibit.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gold border-2 border-parchment dark:border-stone-900 block"></span>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gold font-mono block">{event.year}</span>
                    <h4 className="font-bold text-xs text-primary dark:text-parchment leading-tight">{event.title}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-light">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400">Timeline data unavailable for this exhibit.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Artifacts ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-stone-200/60 dark:border-stone-700/60">
          <h3 className="font-heading font-bold text-lg text-primary dark:text-parchment uppercase tracking-wide">Related Artifacts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(rel => (
              <Link key={rel._id} to={`/exhibit/${rel._id}`}
                className="group block space-y-2 bg-[#FCFAF5] dark:bg-stone-800 border border-stone-200/50 dark:border-stone-700/50 p-3 rounded-lg hover:border-gold transition-colors">
                <div className="h-28 rounded overflow-hidden bg-stone-200">
                  <img src={rel.images?.[0] || fallbackImg} alt={rel.title}
                    className="w-full h-full object-cover object-top transition-transform group-hover:scale-105" />
                </div>
                <h4 className="font-heading font-bold text-xs text-primary dark:text-parchment truncate group-hover:text-gold">{rel.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Image Zoom Lightbox ───────────────────────────────────────────────── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeZoom}
        >
          {/* Close button */}
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <MdClose className="w-7 h-7" />
          </button>

          {/* Thumbnail strip at bottom */}
          {exhibit.images?.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10" onClick={e => e.stopPropagation()}>
              {exhibit.images.map((img, i) => (
                <button key={i} onClick={() => setZoomImg(img)}
                  className={`w-14 h-10 rounded overflow-hidden border-2 flex-shrink-0 transition-all ${zoomImg === img ? 'border-gold scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Zoomed image */}
          <img
            src={zoomImg}
            alt={exhibit.title}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── AR Viewer ─────────────────────────────────────────────────────────── */}
      {arOpen && (
        <ARViewer
          modelUrl={exhibit.arModelUrl || AR_MODEL_BY_EXHIBIT_ID[exhibit._id] || ironSmeltingOvenModel}
          title={exhibit.title}
          onClose={() => setArOpen(false)}
        />
      )}
    </div>
  );
};

export default Exhibit;
