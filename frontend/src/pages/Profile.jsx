import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LangContext } from '../context/LangContext';
import {
  MdOutlineCardMembership, MdBookmark, MdHistory, MdEdit,
  MdCheck, MdClose, MdStar, MdTrendingUp, MdVisibility,
  MdMuseum, MdQuiz, MdLogout, MdUpload, MdLockOutline, MdArrowForward
} from 'react-icons/md';

const API = 'http://localhost:5001/api';

// ── Rank system based on points — one consistent gold accent, tiers told apart
// by label and a 5-segment progress ladder rather than by color-coding. ────────
const RANKS = [
  { label: 'Heritage Explorer', threshold: 0 },
  { label: 'Bronze Historian', threshold: 100 },
  { label: 'Silver Scholar', threshold: 200 },
  { label: 'Golden Antiquarian', threshold: 500 },
  { label: 'Master Historian', threshold: 1000 },
];

const getLevel = (points) => {
  const tierIndex = RANKS.reduce((acc, rank, i) => (points >= rank.threshold ? i : acc), 0);
  const current = RANKS[tierIndex];
  const next = RANKS[tierIndex + 1] || null;
  const progress = next ? Math.round(((points - current.threshold) / (next.threshold - current.threshold)) * 100) : 100;
  return { label: current.label, nextLabel: next?.label ?? null, nextThreshold: next?.threshold ?? null, progress };
};

// ── Stat row — plain metrics with hairline dividers, no icon-bubble grid ──────
const StatRow = ({ items }) => (
  <div className="flex divide-x divide-white/10 border-y border-white/10">
    {items.map(({ icon, label, value, sub }, i) => (
      <div key={i} className="flex-1 min-w-0 px-4 sm:px-7 py-5">
        <div className="flex items-baseline gap-2">
          <span className="font-heading font-bold text-3xl text-parchment leading-none tabular-nums">{value}</span>
          <span className="text-gold/70 flex-shrink-0">{icon}</span>
        </div>
        <div className="text-[11px] text-stone-400 tracking-[0.15em] uppercase mt-1.5 truncate">{label}{sub ? ` · ${sub}` : ''}</div>
      </div>
    ))}
  </div>
);

// ── Badge display ─────────────────────────────────────────────────────────────
const BadgeItem = ({ badge }) => (
  <div className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
    <span className="text-4xl">{badge.icon}</span>
    <p className="text-sm font-bold text-primary dark:text-parchment text-center leading-tight">{badge.title}</p>
    <p className="text-xs text-stone-400 font-mono">
      {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
    </p>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
const Profile = () => {
  const { user, token, guestMode, logout, setUser } = useContext(AuthContext);
  const { t } = useContext(LangContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState('badges');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ── Fetch fresh profile from backend ────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API}/auth/profile`, authHeaders);
      if (data.success) {
        setProfileData(data.user);
        setEditName(data.user.name);
        setEditImage(data.user.profileImage || '');
      }
    } catch { /* keep existing user context */ }
  }, [token]);

  // ── Fetch saved exhibits ─────────────────────────────────────────────────────
  const fetchFavourites = useCallback(async () => {
    const favIds = JSON.parse(localStorage.getItem('mockFavs') || '[]');
    if (!favIds.length) { setFavourites([]); return; }
    try {
      const results = await Promise.allSettled(favIds.map(id => axios.get(`${API}/exhibits/${id}`)));
      setFavourites(results.filter(r => r.status === 'fulfilled').map(r => r.value.data.data).filter(Boolean));
    } catch { setFavourites([]); }
  }, []);

  // ── Fetch exhibits visited ────────────────────────────────────────────────────
  const fetchVisitHistory = useCallback(async () => {
    const ids = JSON.parse(localStorage.getItem('visitHistory') || '[]');
    if (!ids.length) { setVisitHistory([]); return; }
    try {
      const results = await Promise.allSettled(ids.slice(0, 6).map(id => axios.get(`${API}/exhibits/${id}`)));
      setVisitHistory(results.filter(r => r.status === 'fulfilled').map(r => r.value.data.data).filter(Boolean));
    } catch { setVisitHistory([]); }
  }, []);

  // ── Fetch quizzes list ────────────────────────────────────────────────────────
  const fetchQuizzes = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/quizzes`);
      setRecentQuizzes(data.data?.slice(0, 4) || []);
    } catch { setRecentQuizzes([]); }
  }, []);

  useEffect(() => {
    if (guestMode) { setLoading(false); return; }
    if (!token) { navigate('/login'); return; }
    Promise.all([fetchProfile(), fetchFavourites(), fetchVisitHistory(), fetchQuizzes()])
      .finally(() => setLoading(false));
  }, [token, guestMode]);

  // ── Profile update ────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/auth/profile`, { name: editName, profileImage: editImage }, authHeaders);
      if (data.success) {
        setProfileData(data.user);
        if (setUser) setUser(data.user);
        setSaveMsg('Profile updated!');
        setEditMode(false);
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch { setSaveMsg('Failed to save.'); }
    setSaving(false);
  };

  // ── Upload avatar ─────────────────────────────────────────────────────────────
  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImg(true);
    try {
      const { data } = await axios.post(`${API}/media/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      const url = data.url || data.data?.url || '';
      if (url) setEditImage(`http://localhost:5001${url}`);
    } catch { /* ignore */ }
    setUploadingImg(false);
  };

  const removeFav = (id) => {
    const updated = JSON.parse(localStorage.getItem('mockFavs') || '[]').filter(i => i !== id);
    localStorage.setItem('mockFavs', JSON.stringify(updated));
    setFavourites(f => f.filter(e => e._id !== id));
  };

  // ── States ────────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-gold" />
    </div>
  );

  if (guestMode) return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center space-y-8">
      <div className="text-7xl">🏛️</div>
      <h2 className="font-heading font-extrabold text-3xl text-primary dark:text-parchment uppercase">You're Browsing as Guest</h2>
      <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
        Create a free account to unlock your personal heritage journey — track exhibit visits, earn historical badges, take quizzes and build your museum profile.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to="/register" className="bg-primary text-parchment font-bold px-8 py-3.5 rounded-xl hover:bg-stone-800 transition-colors text-sm uppercase tracking-wider">
          Create Account
        </Link>
        <Link to="/login" className="border-2 border-stone-300 dark:border-stone-600 font-bold px-8 py-3.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm uppercase tracking-wider text-stone-600 dark:text-stone-300">
          Sign In
        </Link>
      </div>
    </div>
  );

  const displayUser = profileData || user;
  const points = displayUser?.points || 0;
  const badges = displayUser?.earnedBadges || [];
  const level = getLevel(points);
  const initials = displayUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  const tabs = [
    { id: 'badges', label: 'Badges', icon: MdOutlineCardMembership },
    { id: 'saved', label: `Saved (${favourites.length})`, icon: MdBookmark },
    { id: 'history', label: 'Visit History', icon: MdHistory },
    { id: 'quizzes', label: 'Quizzes', icon: MdQuiz },
  ];

  return (
    <div className="min-h-screen bg-parchment dark:bg-dark-surface">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="relative bg-primary border-b-4 border-gold overflow-hidden"
        style={{ backgroundImage: "radial-gradient(circle at top right, rgba(201,162,39,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(201,162,39,0.08), transparent 50%)" }}>
        {/* Subtle heritage motif so the hero isn't a flat gradient */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #C9A227 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

        <button onClick={logout} title="Logout"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-red-400 transition-colors">
          <MdLogout size={15} /> <span className="hidden sm:inline">Logout</span>
        </button>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 space-y-8">

          {/* Profile card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {editMode ? (
                <label className="cursor-pointer group block">
                  <div className="w-24 h-24 rounded-2xl p-[3px] bg-gradient-to-br from-gold/80 via-gold/30 to-gold/10 shadow-xl">
                    <div className="relative w-full h-full rounded-[13px] overflow-hidden bg-gradient-to-b from-stone-600 to-stone-800">
                    {editImage
                      ? <img src={editImage} alt="avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gold font-heading tracking-wide">{initials}</div>
                    }
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploadingImg
                        ? <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <MdUpload className="text-white w-7 h-7" />
                      }
                    </div>
                  </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && handleAvatarUpload(e.target.files[0])} />
                </label>
              ) : (
                <div className="w-24 h-24 rounded-2xl p-[3px] bg-gradient-to-br from-gold/80 via-gold/30 to-gold/10 shadow-xl">
                  <div className="w-full h-full rounded-[13px] overflow-hidden bg-gradient-to-b from-stone-600 to-stone-800">
                    {displayUser?.profileImage
                      ? <img src={displayUser.profileImage} alt="avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gold font-heading tracking-wide">{initials}</div>
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
              {editMode ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="text-primary font-heading font-bold text-2xl rounded-lg px-4 py-2 border border-gold/50 bg-white/90 focus:outline-none focus:ring-2 focus:ring-gold w-full sm:w-auto"
                    placeholder="Your name" />
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex items-center gap-1.5 bg-gold text-primary font-bold px-5 py-2 rounded-lg text-sm hover:bg-amber-500 transition-colors disabled:opacity-50">
                      <MdCheck size={16} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditMode(false)}
                      className="flex items-center gap-1.5 bg-white/10 text-parchment font-bold px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors">
                      <MdClose size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-parchment truncate">{displayUser?.name}</h1>
                  <button onClick={() => setEditMode(true)}
                    className="text-stone-400 hover:text-gold transition-colors flex-shrink-0" title="Edit profile">
                    <MdEdit size={18} />
                  </button>
                </div>
              )}

              {editMode && (
                <div className="space-y-1.5 max-w-sm mx-auto sm:mx-0">
                  <label className="text-xs text-stone-400 font-bold uppercase tracking-wide block">Profile Image URL</label>
                  <input value={editImage} onChange={e => setEditImage(e.target.value)}
                    className="w-full text-sm rounded-lg px-4 py-2 border border-gold/30 bg-white/90 text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Paste image URL or upload above" />
                </div>
              )}

              <p className="text-sm text-stone-400">{displayUser?.email}</p>

              {/* Rank — reuses the site's own gold-underline heading motif instead of a game-HUD widget */}
              <div className="pt-2 max-w-[16rem] mx-auto sm:mx-0">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{level.label}</span>
                <div className="w-9 h-[2px] bg-gold mt-2 mx-auto sm:mx-0" />
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-px bg-white/15 relative">
                    <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${level.progress}%` }} />
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono whitespace-nowrap">
                    {level.nextLabel ? `${level.nextThreshold - points} to ${level.nextLabel}` : 'highest rank'}
                  </p>
                </div>
              </div>

              {saveMsg && <p className="text-sm text-green-400 font-semibold">{saveMsg}</p>}
            </div>
          </div>

          {/* Stats row */}
          <StatRow items={[
            { icon: <MdStar size={15} />, label: 'Total Points', value: points },
            { icon: <MdOutlineCardMembership size={15} />, label: 'Badges', value: badges.length },
            { icon: <MdBookmark size={15} />, label: 'Saved', value: favourites.length },
            { icon: <MdVisibility size={15} />, label: 'Viewed', value: visitHistory.length, sub: 'session' },
          ]} />
        </div>
      </div>

      {/* ── Tab nav ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors border-b-3 -mb-px
                  ${activeTab === tab.id
                    ? 'border-gold text-primary dark:text-gold'
                    : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                  }`}>
                <Icon size={17} />{tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <MdOutlineCardMembership className="text-gold w-6 h-6" />
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Earned Badges</h2>
            </div>
            {badges.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-7 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-700 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <MdOutlineCardMembership size={28} />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <p className="font-heading font-bold text-primary dark:text-parchment text-base">No badges yet</p>
                  <p className="text-sm text-stone-400 leading-relaxed">Complete quizzes and explore exhibits to earn your first heritage badge.</p>
                </div>
                <Link to="/quiz"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-gold text-primary font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-amber-500 transition-colors">
                  <MdQuiz size={16} /> Take a Quiz
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                  {badges.map((badge, i) => <BadgeItem key={i} badge={badge} />)}
                </div>

                {/* Locked badges preview */}
                <div className="mt-8 space-y-4">
                  <p className="text-sm text-stone-400 font-bold uppercase tracking-widest">Badges to unlock</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: '🎓', title: 'Colombo Scholar', hint: 'Get a perfect quiz score' },
                      { icon: '👑', title: 'Golden Antiquarian', hint: 'Earn 500 total points' },
                      { icon: '🔭', title: 'Heritage Navigator', hint: 'View 10 exhibits' },
                      { icon: '📜', title: 'Trilingual Learner', hint: 'Read content in 3 languages' },
                    ].filter(b => !badges.some(eb => eb.title === b.title)).map((b, i) => (
                      <div key={i} className="relative flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl select-none">
                        <span className="text-2xl grayscale opacity-40 flex-shrink-0">{b.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-500 truncate">{b.title}</p>
                          <p className="text-xs text-stone-400 truncate">{b.hint}</p>
                        </div>
                        <MdLockOutline className="absolute top-2.5 right-2.5 text-stone-300 dark:text-stone-600" size={13} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* SAVED EXHIBITS */}
        {activeTab === 'saved' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MdBookmark className="text-gold w-6 h-6" />
                <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Saved Exhibits</h2>
              </div>
            </div>
            {favourites.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-7 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-700 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <MdBookmark size={26} />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <p className="font-heading font-bold text-primary dark:text-parchment text-base">Nothing saved yet</p>
                  <p className="text-sm text-stone-400 leading-relaxed">Bookmark exhibits from the detail page to see them here.</p>
                </div>
                <Link to="/museums"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-parchment font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-stone-800 transition-colors">
                  <MdMuseum size={16} /> Browse Galleries
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favourites.map(exhibit => (
                  <div key={exhibit._id} className="relative group bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden bg-stone-100">
                      <img
                        src={exhibit.images?.[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=400'}
                        alt={exhibit.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <button onClick={() => removeFav(exhibit._id)}
                      className="absolute top-3 right-3 bg-white/90 text-red-400 hover:text-red-600 p-2 rounded-full shadow-sm hover:bg-white transition-colors">
                      <MdClose size={16} />
                    </button>
                    <div className="p-5 space-y-2">
                      <p className="text-xs text-accent font-bold uppercase tracking-widest">{exhibit.galleryId?.name || 'Gallery'}</p>
                      <h3 className="font-heading font-bold text-primary dark:text-parchment text-base leading-snug">{exhibit.title}</h3>
                      <p className="text-sm text-stone-400 line-clamp-2">{exhibit.description}</p>
                      <Link to={`/exhibit/${exhibit._id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline mt-2">
                        View Exhibit <MdArrowForward size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISIT HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <MdHistory className="text-gold w-6 h-6" />
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Visit History</h2>
            </div>
            {visitHistory.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-7 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-700 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <MdHistory size={26} />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <p className="font-heading font-bold text-primary dark:text-parchment text-base">No visits recorded</p>
                  <p className="text-sm text-stone-400 leading-relaxed">Start exploring exhibits — your journey will be tracked here.</p>
                </div>
                <Link to="/"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-parchment font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-stone-800 transition-colors">
                  Start Exploring <MdArrowForward size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {visitHistory.map((exhibit, i) => (
                  <Link key={exhibit._id} to={`/exhibit/${exhibit._id}`}
                    className="flex items-center gap-5 p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-gold hover:shadow-lg transition-all">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-gold">{i + 1}</span>
                    </div>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <img src={exhibit.images?.[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=100'}
                        alt={exhibit.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-accent font-bold uppercase tracking-widest">{exhibit.galleryId?.name}</p>
                      <p className="font-heading font-bold text-primary dark:text-parchment text-base truncate">{exhibit.title}</p>
                      <p className="text-sm text-stone-400 line-clamp-1">{exhibit.description}</p>
                    </div>
                    <MdArrowForward className="text-stone-300 flex-shrink-0" size={18} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MdQuiz className="text-gold w-6 h-6" />
                <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Quizzes</h2>
              </div>
              {/* Points progress panel */}
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-5 py-2.5">
                <MdTrendingUp className="text-amber-500 w-5 h-5" />
                <span className="text-sm font-bold text-amber-700">{points} points earned</span>
              </div>
            </div>

            {recentQuizzes.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-7 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-700 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <MdQuiz size={26} />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <p className="font-heading font-bold text-primary dark:text-parchment text-base">No quizzes available</p>
                  <p className="text-sm text-stone-400 leading-relaxed">Check back later when quizzes are added by the museum curators.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {recentQuizzes.map(quiz => (
                  <Link key={quiz._id} to="/quiz"
                    className="flex gap-5 items-start p-6 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-gold hover:shadow-lg transition-all group">
                    {quiz.coverImage
                      ? <img src={quiz.coverImage} alt={quiz.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-stone-100" />
                      : <div className="w-20 h-20 rounded-xl bg-amber-50 flex items-center justify-center text-4xl flex-shrink-0">🧠</div>
                    }
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="font-heading font-bold text-primary dark:text-parchment text-base group-hover:text-gold transition-colors">{quiz.title}</p>
                      <p className="text-sm text-stone-400 line-clamp-2">{quiz.description}</p>
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize
                          ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700'
                            : quiz.difficulty === 'medium' ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-600'}`}>
                          {quiz.difficulty}
                        </span>
                        <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                          {quiz.pointsReward} pts
                        </span>
                        <span className="text-xs text-stone-400">
                          {quiz.questions?.length || 0} questions
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

