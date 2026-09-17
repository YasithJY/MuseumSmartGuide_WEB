import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LangContext } from '../context/LangContext';
import { AuthContext } from '../context/AuthContext';
import ExhibitCard from '../components/cards/ExhibitCard';
import { MdSearch, MdQrCodeScanner, MdOutlineEventNote } from 'react-icons/md';
import heroImage from '../assets/Hero.jpeg';

const API = '/api';

const Home = () => {
  const { t } = useContext(LangContext);
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredExhibits, setFeaturedExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await axios.get(`${API}/exhibits`);
        const all = data.data || [];
        // Sort newest first, show top 3
        const sorted = [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeaturedExhibits(sorted.slice(0, 3));
      } catch {
        setFeaturedExhibits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Premium Hero Banner */}
      <section className="relative min-h-[calc(100vh-66px)] flex items-center justify-center text-center px-4 bg-primary text-parchment overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 z-0 opacity-90 bg-cover bg-top" style={{ backgroundImage: `url(${heroImage})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="text-xs sm:text-sm uppercase tracking-widest font-heading font-bold text-gold gold-text-glow">
            National Museum of Sri Lanka
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-parchment leading-tight tracking-wider uppercase">
            {t('welcome')}
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-stone-300 font-light leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search & Scan */}
          <div className="pt-6 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ancient artifacts, dynasties..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-gold/40 text-parchment placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-gold backdrop-blur-sm text-sm"
              />
              <MdSearch className="absolute left-3.5 top-3 w-5 h-5 text-gold" />
            </form>

            <button
              onClick={() => navigate('/scan')}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-gold text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              <MdQrCodeScanner className="w-5 h-5" />
              <span>Scan Exhibit</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Exhibits — live from MongoDB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase text-accent font-bold tracking-widest font-heading">
            Recently Added
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-primary dark:text-parchment tracking-wide uppercase">
            {t('featuredExhibits')}
          </h2>
          <div className="w-24 h-0.5 bg-gold mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : featuredExhibits.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-5xl">🗿</p>
            <p className="font-heading font-bold text-primary dark:text-parchment text-lg uppercase tracking-wide">No Exhibits Yet</p>
            <p className="text-sm text-stone-400 dark:text-stone-500 max-w-sm mx-auto">
              Exhibits added from the Admin Dashboard will appear here automatically.
            </p>
            {user?.role === 'admin' && (
              <Link to="/dashboard"
                className="inline-flex items-center gap-2 bg-gold text-primary font-bold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors text-xs uppercase tracking-wider mt-2">
                Go to Dashboard →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredExhibits.map(exhibit => (
              <ExhibitCard key={exhibit._id} exhibit={exhibit} />
            ))}
          </div>
        )}
      </section>

      {/* Museum News & Events */}
      <section className="bg-primary/5 dark:bg-stone-800/50 py-12 border-y border-stone-200/50 dark:border-stone-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-xl text-primary dark:text-parchment tracking-wider uppercase flex items-center gap-2">
              <MdOutlineEventNote className="text-gold w-6 h-6" />
              <span>Museum News &amp; Events</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200/40 dark:border-stone-700/40 flex items-start gap-4">
                <div className="text-center p-2 bg-gold/15 rounded-lg border border-gold/40 text-primary">
                  <span className="block font-bold text-base font-heading">15</span>
                  <span className="text-[10px] uppercase font-semibold">Aug</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-parchment">Special Exhibition: Stone Carvings of Anuradhapura</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Join us in the Central Gallery for a guided walkthrough of our new excavation acquisitions.</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200/40 dark:border-stone-700/40 flex items-start gap-4">
                <div className="text-center p-2 bg-gold/15 rounded-lg border border-gold/40 text-primary">
                  <span className="block font-bold text-base font-heading">28</span>
                  <span className="text-[10px] uppercase font-semibold">Aug</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary dark:text-parchment">Heritage Night: Colombo Museum 150 Anniversary</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Light projections, traditional Kandyan dancing and digital smart guide demonstrations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Callout */}
          <div className="bg-primary text-parchment rounded-2xl p-8 flex flex-col justify-between border-b-4 border-gold shadow-lg"
            style={{ backgroundImage: "radial-gradient(circle at top right, rgba(201, 162, 39, 0.15), transparent)" }}>
            <div className="space-y-4">
              <span className="text-xs uppercase text-gold font-bold tracking-widest font-heading">Interactive Learning</span>
              <h3 className="font-heading font-extrabold text-2xl uppercase tracking-wide">Test Your History Knowledge</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Answer challenging trivia questions about ancient Sri Lankan kingdoms, earn points, and unlock achievements and badges.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs text-stone-400 font-mono">Available: 2 Quizzes</span>
              <Link to="/quiz" className="bg-gold text-primary font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors text-xs uppercase tracking-wider">
                Start Playing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Callout */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-4 pb-12">
        <h3 className="font-heading font-bold text-xl text-primary dark:text-parchment uppercase">Ready to Explore?</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
          Access the list of all galleries in our physical complex and locate exhibits on the map.
        </p>
        <div className="pt-2">
          <Link to="/museums" className="inline-flex items-center gap-1 bg-primary text-parchment font-bold px-6 py-3 rounded-lg hover:bg-stone-850 transition-colors text-xs uppercase tracking-widest">
            <span>Browse Galleries</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
