import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ExhibitCard from '../components/cards/ExhibitCard';
import { MdArrowBack } from 'react-icons/md';

const API = '/api';

const Gallery = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const [galleryRes, exhibitsRes] = await Promise.all([
          axios.get(`${API}/galleries/${id}`),
          axios.get(`${API}/exhibits`, { params: { galleryId: id } })
        ]);
        setGallery(galleryRes.data.data || null);
        setExhibits(exhibitsRes.data.data || []);
      } catch {
        setGallery(null);
        setExhibits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <p className="text-sm text-stone-500 dark:text-stone-400 font-semibold">Gallery not found</p>
        <Link to="/museums" className="text-gold hover:underline">Back to Museums</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Cover Banner */}
      <section className="relative h-60 md:h-80 flex items-end bg-primary border-b-4 border-gold">
        <img 
          src={gallery.coverImage || 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1200'} 
          alt={gallery.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-2 w-full">
          <Link to="/museums" className="inline-flex items-center gap-1 text-xs text-gold hover:text-yellow-600 transition-colors uppercase font-bold mb-2">
            <MdArrowBack className="w-4 h-4" />
            <span>Back to Galleries</span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-stone-300 tracking-widest block">
            National Museum
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-parchment uppercase tracking-wide">
            {gallery.name}
          </h1>
        </div>
      </section>

      {/* Description & Exhibit List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Gallery Info */}
        <div className="lg:col-span-1 space-y-4 bg-white/70 dark:bg-stone-800/70 p-6 rounded-xl border border-stone-200/50 dark:border-stone-700/50 shadow-sm self-start">
          <h3 className="font-heading font-bold text-sm text-primary dark:text-parchment uppercase">About Gallery</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-light">
            {gallery.description}
          </p>
          <div className="border-t border-stone-200/50 dark:border-stone-700/50 pt-4 text-xs font-mono text-stone-500 dark:text-stone-400 flex justify-between">
            <span>Total Artifacts:</span>
            <span className="font-bold text-primary dark:text-parchment">{exhibits.length}</span>
          </div>
        </div>

        {/* Right Column: Exhibit Cards Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-heading font-bold text-sm text-accent uppercase tracking-wider">
            Display Exhibits ({exhibits.length})
          </h3>
          
          {exhibits.length === 0 ? (
            <p className="text-xs text-stone-400 dark:text-stone-500">No exhibits currently logged inside this gallery.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {exhibits.map(exhibit => (
                <ExhibitCard key={exhibit._id} exhibit={exhibit} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
