import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AudioPlayer from '../components/common/AudioPlayer';
import { mockExhibits } from '../utils/mockData';
import { MdBookmark, MdBookmarkBorder, MdShare, MdArrowBack } from 'react-icons/md';

const Exhibit = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [exhibit, setExhibit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetchExhibitDetails();
  }, [id]);

  const fetchExhibitDetails = () => {
    setLoading(true);
    const found = mockExhibits.find(ex => ex._id === id);
    if (found) {
      setExhibit(found);
      setActiveImage(found.images?.[0] || '');
      
      // Load related artifacts
      if (found.relatedArtifacts) {
        const relatedList = mockExhibits.filter(item => found.relatedArtifacts.includes(item._id));
        setRelated(relatedList);
      }

      // Check local favorites list
      const favList = JSON.parse(localStorage.getItem('mockFavs') || '[]');
      setIsFav(favList.includes(found._id));
      
      // Log simple mock visit history
      const visits = JSON.parse(localStorage.getItem('mockVisits') || '[]');
      if (!visits.includes(found._id)) {
        visits.push(found._id);
        localStorage.setItem('mockVisits', JSON.stringify(visits));
      }
    }
    setLoading(false);
  };

  const toggleFavouriteStatus = () => {
    if (!token) {
      alert("Please log in to save exhibits to your favourites list!");
      return;
    }
    const favList = JSON.parse(localStorage.getItem('mockFavs') || '[]');
    let updated;
    if (favList.includes(exhibit._id)) {
      updated = favList.filter(item => item !== exhibit._id);
      setIsFav(false);
    } else {
      updated = [...favList, exhibit._id];
      setIsFav(true);
    }
    localStorage.setItem('mockFavs', JSON.stringify(updated));
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: exhibit.title,
        text: exhibit.description,
        url: currentUrl,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(currentUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!exhibit) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <p className="text-sm text-stone-500 font-semibold">Artifact details not found.</p>
        <Link to="/museums" className="text-gold hover:underline">Back to Galleries</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back and Utility navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/gallery/${exhibit.galleryId?._id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:text-gold uppercase font-bold">
          <MdArrowBack className="w-4 h-4" />
          <span>Back to Gallery ({exhibit.galleryId?.name})</span>
        </Link>

        <div className="flex gap-2">
          <button 
            onClick={toggleFavouriteStatus} 
            className="flex items-center gap-1 text-xs border border-stone-300 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:border-gold transition-colors font-bold uppercase"
          >
            {isFav ? <MdBookmark className="text-gold w-4 h-4" /> : <MdBookmarkBorder className="w-4 h-4" />}
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
          
          <button 
            onClick={handleShare} 
            className="flex items-center gap-1 text-xs border border-stone-300 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:border-gold transition-colors font-bold uppercase"
          >
            <MdShare className="w-4 h-4 text-primary" />
            <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Images & Basic Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Images Columns */}
        <div className="space-y-4">
          <div className="h-96 w-full rounded-xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
            <img 
              src={activeImage || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'} 
              alt={exhibit.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Selectors */}
          {exhibit.images && exhibit.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {exhibit.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${activeImage === img ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Audio narrations */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase text-accent font-bold tracking-widest font-heading block">
              {exhibit.categoryId?.name}
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary uppercase leading-tight">
              {exhibit.title}
            </h1>
            <div className="w-20 h-1 bg-gold"></div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed font-light">
            {exhibit.description}
          </p>

          {/* Audio player */}
          {exhibit.audioUrl && (
            <AudioPlayer src={exhibit.audioUrl} title={exhibit.title} />
          )}

          {/* Video reference */}
          {exhibit.videoUrl && (
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-primary uppercase">Video Guide Documentation</h3>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-stone-200 shadow">
                <video src={exhibit.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historical and Timeline details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-stone-200/60">
        
        {/* Historical Text (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-lg text-primary uppercase tracking-wide">
            Historical Background & Significance
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed font-light whitespace-pre-line">
            {exhibit.historicalInfo}
          </p>
        </div>

        {/* Timeline (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-heading font-bold text-lg text-primary uppercase tracking-wide">
            Chronological Timeline
          </h3>

          <div className="relative border-l-2 border-gold/40 pl-6 ml-2 space-y-6">
            {exhibit.timeline && exhibit.timeline.length > 0 ? (
              exhibit.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-gold border-2 border-parchment flex items-center justify-center text-[8px] font-bold text-primary"></span>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gold font-mono block">{event.year}</span>
                    <h4 className="font-bold text-xs text-primary leading-tight">{event.title}</h4>
                    <p className="text-[10px] text-stone-500 leading-relaxed font-light">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400">Timeline data unavailable for this exhibit.</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Artifacts */}
      {related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-stone-200/60">
          <h3 className="font-heading font-bold text-lg text-primary uppercase tracking-wide">
            Related Artifacts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(related => (
              <Link 
                key={related._id} 
                to={`/exhibit/${related._id}`}
                className="group block space-y-2 bg-[#FCFAF5] border border-stone-200/50 p-3 rounded-lg hover:border-gold transition-colors"
              >
                <div className="h-28 rounded overflow-hidden bg-stone-200">
                  <img 
                    src={related.images?.[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=200'} 
                    alt={related.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h4 className="font-heading font-bold text-xs text-primary truncate group-hover:text-gold">
                  {related.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exhibit;
