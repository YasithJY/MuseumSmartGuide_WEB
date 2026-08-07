import React from 'react';
import { MdLocationOn, MdAccessTime, MdChevronRight } from 'react-icons/md';

const MuseumCard = ({ museum, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="premium-card flex flex-col md:flex-row cursor-pointer bg-[#FCFAF5]"
    >
      {/* Image */}
      <div className="w-full md:w-1/3 h-48 md:h-auto bg-stone-200">
        <img 
          src={museum.coverImage || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=400'} 
          alt={museum.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-lg text-primary hover:text-gold transition-colors">
            {museum.name}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
            {museum.description}
          </p>

          <div className="flex flex-col gap-2 pt-2 border-t border-stone-200/50">
            <div className="flex items-center text-xs text-stone-600 gap-1.5">
              <MdLocationOn className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="truncate">{museum.location?.address}</span>
            </div>
            <div className="flex items-center text-xs text-stone-600 gap-1.5">
              <MdAccessTime className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Weekdays: {museum.openingHours?.weekdays}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
          <span>Explore Galleries ({museum.galleriesCount || 0})</span>
          <MdChevronRight className="w-4 h-4 text-gold" />
        </div>
      </div>
    </div>
  );
};

export default MuseumCard;
