import React from 'react';

const BadgeCard = ({ badge }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#FCFAF5] border border-gold/30 rounded-xl text-center shadow-sm hover:shadow-md hover:border-gold transition-all duration-300">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-3xl border border-gold/50 mb-3 animate-pulse">
        {badge.icon || '🏆'}
      </div>
      
      {/* Title */}
      <h5 className="font-heading font-bold text-xs text-primary tracking-wider uppercase">
        {badge.title}
      </h5>

      {/* Earned Date */}
      <span className="text-[10px] text-stone-400 mt-1">
        Earned {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Today'}
      </span>
    </div>
  );
};

export default BadgeCard;
