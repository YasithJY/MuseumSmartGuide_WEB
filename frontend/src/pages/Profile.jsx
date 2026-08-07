import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LangContext } from '../context/LangContext';
import BadgeCard from '../components/cards/BadgeCard';
import ExhibitCard from '../components/cards/ExhibitCard';
import { mockExhibits } from '../utils/mockData';
import { MdOutlineCardMembership, MdHistory } from 'react-icons/md';

const Profile = () => {
  const { user, token, guestMode, logout } = useContext(AuthContext);
  const { t } = useContext(LangContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (guestMode) {
      setLoading(false);
      return;
    }
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFavourites();
  }, [token, guestMode]);

  const fetchFavourites = () => {
    // Read favorites from local storage
    const favsIds = JSON.parse(localStorage.getItem('mockFavs') || '[]');
    const matchedExhibits = mockExhibits.filter(ex => favsIds.includes(ex._id));
    setFavourites(matchedExhibits);
    setLoading(false);
  };

  const handleToggleFav = (id) => {
    const favList = JSON.parse(localStorage.getItem('mockFavs') || '[]');
    const updated = favList.filter(item => item !== id);
    localStorage.setItem('mockFavs', JSON.stringify(updated));
    fetchFavourites();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (guestMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="text-5xl">👤</div>
        <h2 className="font-heading font-extrabold text-2xl text-primary uppercase">Visitor Guest Account</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          You are currently in guest mode. Register an account to bookmark your favourite exhibits, take historical quizzes, and earn printable accomplishment certificates.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-primary text-parchment font-bold px-6 py-2.5 rounded-lg hover:bg-stone-850 transition-colors uppercase tracking-wider text-xs">
            Register Account
          </Link>
          <button onClick={logout} className="border border-stone-300 font-bold px-6 py-2.5 rounded-lg hover:bg-stone-100 transition-colors uppercase tracking-wider text-xs">
            Exit Guest Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Profile Header Block */}
      <div className="bg-primary text-parchment rounded-2xl p-6 sm:p-8 border-b-4 border-gold shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-gold gold-text-glow">{user?.name}</h2>
            <p className="text-xs text-stone-300">{user?.email}</p>
            <div className="flex gap-2 pt-1.5 justify-center sm:justify-start">
              <span className="bg-stone-800 text-stone-200 border border-stone-700 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                Role: {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="flex gap-8 border-t sm:border-t-0 sm:border-l border-stone-600/70 pt-6 sm:pt-0 sm:pl-8 w-full sm:w-auto justify-around">
          <div className="text-center">
            <span className="block font-heading font-extrabold text-2xl text-gold">{user?.points || 0}</span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t('points')}</span>
          </div>
          <div className="text-center">
            <span className="block font-heading font-extrabold text-2xl text-gold">{user?.earnedBadges?.length || 0}</span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Badges</span>
          </div>
        </div>
      </div>

      {/* Badges Display */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <MdOutlineCardMembership className="text-gold w-6 h-6" />
          <h3 className="font-heading font-bold text-base text-primary uppercase">
            {t('earnedBadges')}
          </h3>
        </div>
        
        {user?.earnedBadges?.length === 0 ? (
          <p className="text-xs text-stone-400">Complete museum trivia quizzes to earn historical badges!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {user?.earnedBadges?.map((badge, idx) => (
              <BadgeCard key={idx} badge={badge} />
            ))}
          </div>
        )}
      </div>

      {/* Saved Favourites */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <MdHistory className="text-gold w-6 h-6" />
          <h3 className="font-heading font-bold text-base text-primary uppercase">
            {t('myFavourites')} ({favourites.length})
          </h3>
        </div>

        {favourites.length === 0 ? (
          <div className="text-center py-8 bg-white/40 border border-dashed border-stone-300 rounded-xl">
            <p className="text-xs text-stone-400">You haven't bookmarked any exhibits yet.</p>
            <Link to="/search" className="text-xs text-gold hover:underline mt-2 inline-block">Explore Exhibits</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favourites.map(exhibit => (
              <ExhibitCard 
                key={exhibit._id} 
                exhibit={exhibit}
                isFav={true}
                onToggleFav={handleToggleFav}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
