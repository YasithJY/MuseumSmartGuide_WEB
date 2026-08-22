import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward, MdBookmarkBorder } from 'react-icons/md';

const ExhibitCard = ({ exhibit, onToggleFav, isFav }) => {
  return (
    <div className="premium-card relative group flex flex-col h-full bg-[#FCFAF5] dark:bg-stone-800">
      {/* Save Button */}
      {onToggleFav && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFav(exhibit._id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-stone-700/80 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 hover:text-gold shadow-md backdrop-blur-sm transition-all"
        >
          <MdBookmarkBorder className={`w-5 h-5 ${isFav ? 'text-gold fill-gold' : ''}`} />
        </button>
      )}

      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-stone-200">
        <img
          src={exhibit.images?.[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=400'}
          alt={exhibit.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {exhibit.categoryId && (
          <span className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-gold border border-gold/45 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
            {exhibit.categoryId.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[10px] text-accent tracking-widest font-bold font-heading uppercase">
            {exhibit.galleryId?.name || 'Artifact'}
          </span>
          <h4 className="font-heading font-bold text-base text-primary dark:text-parchment leading-snug group-hover:text-gold transition-colors">
            {exhibit.title}
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
            {exhibit.description}
          </p>
        </div>

        <Link
          to={`/exhibit/${exhibit._id}`}
          className="mt-6 inline-flex items-center text-xs font-semibold text-primary dark:text-stone-300 group-hover:text-gold transition-colors border-t border-stone-200/80 dark:border-stone-700/80 pt-3"
        >
          <span>Discover Artifact</span>
          <MdArrowForward className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ExhibitCard;
