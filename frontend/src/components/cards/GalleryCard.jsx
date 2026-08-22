import React from 'react';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';

const GalleryCard = ({ gallery, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="premium-card relative group cursor-pointer bg-[#FCFAF5] dark:bg-stone-800 min-h-[300px] flex flex-col justify-between"
    >
      <div>
        {/* Cover Image */}
        <div className="h-40 overflow-hidden bg-stone-200">
          <img 
            src={gallery.coverImage || 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=400'} 
            alt={gallery.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          <h4 className="font-heading font-bold text-base text-primary dark:text-parchment leading-tight group-hover:text-gold transition-colors">
            {gallery.name}
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
            {gallery.description}
          </p>
        </div>
      </div>

      <div className="p-5 border-t border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between text-xs font-semibold text-primary dark:text-stone-300">
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
          <MdOutlineCollectionsBookmark className="w-4 h-4 text-gold" />
          <span>{gallery.exhibitsCount || 0} Exhibits Available</span>
        </div>
        <span className="text-gold group-hover:underline">Explore &rarr;</span>
      </div>
    </div>
  );
};

export default GalleryCard;
