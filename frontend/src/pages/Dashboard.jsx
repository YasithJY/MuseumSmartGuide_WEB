import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  MdOutlineDashboard,
  MdOutlinePhotoSizeSelectActual,
  MdOutlinePersonAdd,
  MdOutlineCollections,
  MdOutlineQuiz,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdCheckCircle,
  MdError,
  MdQrCode2,
  MdLogout,
  MdRefresh,
  MdBarChart,
  MdPeople,
  MdTrendingUp,
} from 'react-icons/md';

const API = '/api';

// ─── Helper: axios with auth header ───────────────────────────────────────────
const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold animate-fade-in
      ${type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
      {type === 'success' ? <MdCheckCircle size={20} /> : <MdError size={20} />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><MdClose size={16} /></button>
    </div>
  );
};

// ─── Modal Component ──────────────────────────────────────────────────────────
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-primary rounded-t-2xl">
        <h2 className="font-heading font-bold text-white text-lg uppercase tracking-wide">{title}</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
          <MdClose size={22} />
        </button>
      </div>
      <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
    </div>
  </div>
);

// ─── Field Component ──────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full text-sm p-2.5 rounded-lg border border-stone-200 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-gold bg-stone-50 dark:bg-stone-700 dark:text-parchment";
const textareaCls = `${inputCls} resize-none`;
const descriptionCls = "w-full text-base p-3.5 rounded-xl border-2 border-stone-200 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-gold bg-stone-50 dark:bg-stone-700 dark:text-parchment resize-none leading-relaxed font-normal";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-heading font-bold text-primary dark:text-parchment">{value}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('exhibits');
  const [exhibits, setExhibits] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Quiz states
  const blankQuestion = { text: '', type: 'multiple-choice', imageUrl: '', options: ['', '', '', ''], correctAnswer: '', points: 10 };
  const blankQuiz = { title: '', description: '', difficulty: 'easy', pointsReward: 50, coverImage: '', questionsData: [{ ...blankQuestion }] };
  const [quizForm, setQuizForm] = useState(blankQuiz);
  const [quizFormLoading, setQuizFormLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editQuizLoading, setEditQuizLoading] = useState(false);

  // Modal states
  const [showExhibitModal, setShowExhibitModal] = useState(false);
  const [editingExhibit, setEditingExhibit] = useState(null);

  // Exhibit form
  const blankExhibit = {
    title: '', description: '', historicalInfo: '',
    audioUrl: '', videoUrl: '',
    images: [],
    categoryId: '', galleryId: '', museumId: '',
    timeline: [{ year: '', title: '', description: '' }],
    translations: {
      si: { title: '', description: '', historicalInfo: '' },
      ta: { title: '', description: '', historicalInfo: '' }
    }
  };
  const [exhibitForm, setExhibitForm] = useState(blankExhibit);
  const [formLoading, setFormLoading] = useState(false);

  // Admin creation form
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [adminLoading, setAdminLoading] = useState(false);

  // Gallery creation form
  const blankGallery = {
    name: '', description: '', coverImage: '', museumId: '',
    location: { address: '', floor: '', roomNumber: '' }
  };
  const [galleryForm, setGalleryForm] = useState(blankGallery);
  const [galleryFormLoading, setGalleryFormLoading] = useState(false);

  // Gallery edit modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editGalleryForm, setEditGalleryForm] = useState(blankGallery);
  const [editGalleryLoading, setEditGalleryLoading] = useState(false);

  // Image upload state (shared)
  const [uploadingImage, setUploadingImage] = useState(false);

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (user && user.role !== 'admin') { navigate('/'); }
  }, [token, user, navigate]);

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [exRes, galRes, musRes, quizRes] = await Promise.all([
        axios.get(`${API}/exhibits`),
        axios.get(`${API}/galleries`),
        axios.get(`${API}/museums`),
        axios.get(`${API}/quizzes`),
      ]);
      setExhibits(exRes.data.data || []);
      setGalleries(galRes.data.data || []);
      setMuseums(musRes.data.data || []);
      setQuizzes(quizRes.data.data || []);

      // Derive unique categories from exhibits
      const cats = [];
      const seen = new Set();
      (exRes.data.data || []).forEach(e => {
        const c = e.categoryId;
        if (c && !seen.has(c._id)) { seen.add(c._id); cats.push(c); }
      });
      setCategories(cats);
    } catch (err) {
      showToast('Failed to load data. Is the backend running?', 'error');
    }
    setLoading(false);
  }, [token, showToast]);

  // Also fetch categories separately
  const fetchCategories = useCallback(async () => {
    try {
      // Try /categories route; if not, fallback already done above
      const { data } = await axios.get(`${API}/categories`);
      if (data.data) setCategories(data.data);
    } catch { /* ignore if route doesn't exist */ }
  }, []);

  // ── Fetch User Analytics ────────────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    setAnalyticsLoading(true);
    try {
      const { data } = await axios.get(`${API}/analytics/user-analytics`, authHeaders(token));
      if (data.success) setAnalyticsData(data.data);
    } catch (err) {
      showToast('Failed to load analytics data.', 'error');
    }
    setAnalyticsLoading(false);
  }, [token, showToast]);

  useEffect(() => {
    fetchAll();
    fetchCategories();
  }, [fetchAll, fetchCategories]);

  // ── QR Download ────────────────────────────────────────────────────────────
  const downloadQR = async (exhibit) => {
    const qrUrl = exhibit.qrCodeUrl;
    if (!qrUrl) { showToast('No QR code for this exhibit yet.', 'error'); return; }
    const fullUrl = qrUrl;
    try {
      const resp = await fetch(fullUrl);
      const blob = await resp.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `QR-${exhibit.title.replace(/\s+/g, '_')}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast(`QR for "${exhibit.title}" downloaded!`);
    } catch {
      showToast('QR download failed.', 'error');
    }
  };

  // ── Exhibit CRUD ───────────────────────────────────────────────────────────
  const openCreateExhibit = () => {
    setEditingExhibit(null);
    setExhibitForm(blankExhibit);
    setShowExhibitModal(true);
  };

  const openEditExhibit = (exhibit) => {
    setEditingExhibit(exhibit);
    setExhibitForm({
      title: exhibit.title || '',
      description: exhibit.description || '',
      historicalInfo: exhibit.historicalInfo || '',
      audioUrl: exhibit.audioUrl || '',
      videoUrl: exhibit.videoUrl || '',
      images: exhibit.images || [],
      categoryId: exhibit.categoryId?._id || exhibit.categoryId || '',
      galleryId: exhibit.galleryId?._id || exhibit.galleryId || '',
      museumId: exhibit.museumId?._id || exhibit.museumId || '',
      timeline: exhibit.timeline?.length ? exhibit.timeline : [{ year: '', title: '', description: '' }],
      translations: exhibit.translations || {
        si: { title: '', description: '', historicalInfo: '' },
        ta: { title: '', description: '', historicalInfo: '' }
      }
    });
    setShowExhibitModal(true);
  };

  const handleExhibitSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingExhibit) {
        await axios.put(`${API}/exhibits/${editingExhibit._id}`, exhibitForm, authHeaders(token));
        showToast('Exhibit updated successfully!');
      } else {
        await axios.post(`${API}/exhibits`, exhibitForm, authHeaders(token));
        showToast('Exhibit created! QR code generated automatically.');
      }
      setShowExhibitModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save exhibit.', 'error');
    }
    setFormLoading(false);
  };

  const handleDeleteExhibit = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/exhibits/${id}`, authHeaders(token));
      showToast(`"${title}" deleted.`);
      fetchAll();
    } catch {
      showToast('Failed to delete exhibit.', 'error');
    }
  };

  // Timeline helpers
  const addTimelineRow = () =>
    setExhibitForm(f => ({ ...f, timeline: [...f.timeline, { year: '', title: '', description: '' }] }));

  const updateTimeline = (idx, field, val) =>
    setExhibitForm(f => ({
      ...f,
      timeline: f.timeline.map((t, i) => i === idx ? { ...t, [field]: val } : t)
    }));

  const removeTimelineRow = (idx) =>
    setExhibitForm(f => ({ ...f, timeline: f.timeline.filter((_, i) => i !== idx) }));

  // Translation helpers
  const updateTranslation = (lang, field, val) =>
    setExhibitForm(f => ({
      ...f,
      translations: { ...f.translations, [lang]: { ...f.translations[lang], [field]: val } }
    }));

  // ── Admin Creation ─────────────────────────────────────────────────────────
  const { register: registerUser } = useContext(AuthContext);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    const result = await registerUser(adminForm.name, adminForm.email, adminForm.password, adminForm.role);
    if (result.success) {
      showToast(`Account for "${adminForm.name}" created successfully!`);
      setAdminForm({ name: '', email: '', password: '', role: 'admin' });
    } else {
      showToast(result.message || 'Failed to create account.', 'error');
    }
    setAdminLoading(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (!user) return null;

  // ── Image Upload Helper ───────────────────────────────────────────────────
  const uploadImage = async (file, onSuccess) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post(`${API}/media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (data.success) {
        const fullUrl = data.url;
        onSuccess(fullUrl);
        showToast('Image uploaded successfully!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Image upload failed.', 'error');
    }
    setUploadingImage(false);
  };

  // ── Gallery CRUD ──────────────────────────────────────────────────────────
  const openEditGallery = (gallery) => {
    setEditingGallery(gallery);
    setEditGalleryForm({
      name: gallery.name || '',
      description: gallery.description || '',
      coverImage: gallery.coverImage || '',
      museumId: gallery.museumId?._id || gallery.museumId || '',
      location: {
        address: gallery.location?.address || '',
        floor: gallery.location?.floor || '',
        roomNumber: gallery.location?.roomNumber || ''
      }
    });
    setShowGalleryModal(true);
  };

  const handleEditGallerySubmit = async (e) => {
    e.preventDefault();
    setEditGalleryLoading(true);
    try {
      await axios.put(`${API}/galleries/${editingGallery._id}`, editGalleryForm, authHeaders(token));
      showToast(`Gallery "${editGalleryForm.name}" updated!`);
      setShowGalleryModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update gallery.', 'error');
    }
    setEditGalleryLoading(false);
  };

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    setGalleryFormLoading(true);
    try {
      const museumId = galleryForm.museumId || museums[0]?._id;
      if (!museumId) { showToast('No museum found. Run the seeder first.', 'error'); setGalleryFormLoading(false); return; }
      await axios.post(`${API}/galleries`, { ...galleryForm, museumId }, authHeaders(token));
      showToast(`Gallery "${galleryForm.name}" created!`);
      setGalleryForm(blankGallery);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create gallery.', 'error');
    }
    setGalleryFormLoading(false);
  };

  const handleDeleteGallery = async (id, name) => {
    if (!window.confirm(`Delete gallery "${name}"?\n\nWarning: exhibits inside this gallery will lose their gallery link.`)) return;
    try {
      await axios.delete(`${API}/galleries/${id}`, authHeaders(token));
      showToast(`Gallery "${name}" deleted.`);
      fetchAll();
    } catch {
      showToast('Failed to delete gallery.', 'error');
    }
  };

  // ── Quiz CRUD ───────────────────────────────────────────────────────────────
  const openCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm(blankQuiz);
    setShowQuizModal(true);
  };

  const openEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title || '',
      description: quiz.description || '',
      difficulty: quiz.difficulty || 'easy',
      pointsReward: quiz.pointsReward || 50,
      coverImage: quiz.coverImage || '',
      questionsData: quiz.questions?.length
        ? quiz.questions.map(q => ({
            text: q.text || '',
            type: q.type || 'multiple-choice',
            imageUrl: q.imageUrl || '',
            options: q.options?.length ? [...q.options] : ['', '', '', ''],
            correctAnswer: q.correctAnswer || '',
            points: q.points || 10
          }))
        : [{ ...blankQuestion }]
    });
    setShowQuizModal(true);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (editingQuiz) {
      setEditQuizLoading(true);
      try {
        await axios.put(`${API}/quizzes/${editingQuiz._id}`, quizForm, authHeaders(token));
        showToast(`Quiz "${quizForm.title}" updated!`);
        setShowQuizModal(false);
        fetchAll();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to update quiz.', 'error');
      }
      setEditQuizLoading(false);
    } else {
      setQuizFormLoading(true);
      try {
        await axios.post(`${API}/quizzes`, quizForm, authHeaders(token));
        showToast(`Quiz "${quizForm.title}" created!`);
        setQuizForm(blankQuiz);
        setShowQuizModal(false);
        fetchAll();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to create quiz.', 'error');
      }
      setQuizFormLoading(false);
    }
  };

  const handleDeleteQuiz = async (id, title) => {
    if (!window.confirm(`Delete quiz "${title}" and all its questions?`)) return;
    try {
      await axios.delete(`${API}/quizzes/${id}`, authHeaders(token));
      showToast(`Quiz "${title}" deleted.`);
      fetchAll();
    } catch {
      showToast('Failed to delete quiz.', 'error');
    }
  };

  // Question helpers
  const addQuestion = () => setQuizForm(f => ({ ...f, questionsData: [...f.questionsData, { ...blankQuestion }] }));
  const removeQuestion = (idx) => setQuizForm(f => ({ ...f, questionsData: f.questionsData.filter((_, i) => i !== idx) }));
  const updateQuestion = (idx, field, value) => setQuizForm(f => {
    const qs = [...f.questionsData];
    qs[idx] = { ...qs[idx], [field]: value };
    return { ...f, questionsData: qs };
  });
  const updateOption = (qIdx, optIdx, value) => setQuizForm(f => {
    const qs = [...f.questionsData];
    const opts = [...qs[qIdx].options];
    opts[optIdx] = value;
    qs[qIdx] = { ...qs[qIdx], options: opts };
    return { ...f, questionsData: qs };
  });

  const tabs = [
    { id: 'exhibits', label: 'Exhibits', icon: <MdOutlinePhotoSizeSelectActual size={18} /> },
    { id: 'galleries', label: 'Galleries', icon: <MdOutlineCollections size={18} /> },
    { id: 'quizzes', label: 'Quizzes', icon: <MdOutlineQuiz size={18} /> },
    { id: 'overview', label: 'Overview', icon: <MdOutlineDashboard size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <MdBarChart size={18} />, onActivate: fetchAnalytics },
    { id: 'admins', label: 'Admin Accounts', icon: <MdOutlinePersonAdd size={18} /> },
  ];

  // Chart color palette
  const CHART_COLORS = ['#4E342E', '#D4A34B', '#6D4C41', '#8D6E63', '#A1887F', '#BCAAA4', '#795548', '#3E2723', '#FFAB91', '#FF8A65'];


  return (
    <div className="min-h-screen bg-parchment dark:bg-dark-surface bg-paper-texture dark:bg-none transition-colors duration-300">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div className="bg-primary dark:bg-stone-950 text-parchment px-6 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-xl uppercase tracking-widest">
              🏛️ Admin Control Panel
            </h1>
            <p className="text-xs text-parchment/60 mt-0.5">Museum 150 Smart Guide — Backend Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gold">{user.name}</p>
              <p className="text-[10px] text-parchment/50 uppercase tracking-wider">{user.role}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-parchment text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-white/20"
            >
              <MdLogout size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm p-1.5 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); tab.onActivate?.(); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-primary text-parchment shadow-md'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-primary dark:hover:text-parchment'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════ TAB: OVERVIEW ═══════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="🏛️" label="Museums" value={museums.length} color="bg-primary" />
              <StatCard icon="🖼️" label="Galleries" value={galleries.length} color="bg-accent" />
              <StatCard icon="🗿" label="Exhibits" value={exhibits.length} color="bg-gold" />
              <StatCard icon="📱" label="QR Codes Ready" value={exhibits.filter(e => e.qrCodeUrl).length} color="bg-green-700" />
            </div>

            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-lg uppercase mb-4">Recent Exhibits</h2>
              <div className="space-y-3">
                {exhibits.slice(0, 5).map(e => (
                  <div key={e._id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-100 dark:border-stone-600">
                    <div>
                      <p className="font-semibold text-sm text-primary dark:text-parchment">{e.title}</p>
                      <p className="text-xs text-stone-400">{e.galleryId?.name || 'No gallery'} · {e.categoryId?.name || 'No category'}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.qrCodeUrl ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                      {e.qrCodeUrl ? '✓ QR Ready' : 'No QR'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ TAB: EXHIBITS ═══════════ */}
        {activeTab === 'exhibits' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">
                Exhibit Management
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchAll}
                  className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <MdRefresh size={16} /> Refresh
                </button>
                <button
                  onClick={openCreateExhibit}
                  className="flex items-center gap-2 bg-gold text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md"
                >
                  <MdAdd size={18} /> Add Exhibit
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
              </div>
            ) : exhibits.length === 0 ? (
              <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-16 text-center">
                <p className="text-4xl mb-3">🗿</p>
                <p className="font-heading font-bold text-primary dark:text-parchment text-lg">No Exhibits Found</p>
                <p className="text-xs text-stone-400 mt-1">Run the seeder or create an exhibit above.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-primary text-parchment">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Exhibit</th>
                        <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell">Gallery</th>
                        <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Category</th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider">QR</th>
                        <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                      {exhibits.map((exhibit, idx) => (
                        <tr key={exhibit._id} className={`hover:bg-amber-50/40 dark:hover:bg-stone-700/40 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-stone-800' : 'bg-stone-50/40 dark:bg-stone-800/60'}`}>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-primary dark:text-parchment text-sm">{exhibit.title}</p>
                            <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{exhibit.description}</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">{exhibit.galleryId?.name || '—'}</span>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="inline-block bg-gold/10 text-gold text-xs font-bold px-2.5 py-1 rounded-full">
                              {exhibit.categoryId?.name || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {exhibit.qrCodeUrl ? (
                              <button
                                onClick={() => downloadQR(exhibit)}
                                title="Download QR Code"
                                className="inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                              >
                                <MdQrCode2 size={14} /> Download
                              </button>
                            ) : (
                              <span className="text-xs text-stone-300 font-medium">None</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditExhibit(exhibit)}
                                title="Edit"
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              >
                                <MdEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteExhibit(exhibit._id, exhibit.title)}
                                title="Delete"
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                <MdDelete size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-700">
                  <p className="text-xs text-stone-400">{exhibits.length} exhibit{exhibits.length !== 1 ? 's' : ''} total</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TAB: GALLERIES ═══════════ */}
        {activeTab === 'galleries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Gallery Management</h2>
              <button onClick={fetchAll}
                className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                <MdRefresh size={16} /> Refresh
              </button>
            </div>

            {/* Existing Galleries */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between">
                <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">Current Galleries</h3>
                <span className="text-xs text-stone-400">{galleries.length} total</span>
              </div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
                </div>
              ) : galleries.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-2xl mb-2">🖼️</p>
                  <p className="text-sm font-semibold text-stone-400">No galleries yet. Create one below.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-stone-700">
                  {galleries.map(g => (
                    <div key={g._id} className="flex items-center gap-4 px-5 py-4 hover:bg-amber-50/30 dark:hover:bg-stone-700/40 transition-colors">
                      {/* Cover image */}
                      {g.coverImage ? (
                        <img src={g.coverImage} alt={g.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-stone-200 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 text-2xl border border-stone-200">🖼️</div>
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary dark:text-parchment text-sm">{g.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{g.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-stone-400">{g.museumId?.name || 'No museum'}</span>
                          <span className="text-[10px] font-bold bg-gold/10 text-gold px-2 py-0.5 rounded-full">{g.exhibitsCount || 0} exhibits</span>
                          {g.location?.address && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              📍 {g.location.address}
                            </span>
                          )}
                          {g.location?.floor && (
                            <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                              Floor {g.location.floor}{g.location.roomNumber ? ` · Room ${g.location.roomNumber}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEditGallery(g)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit gallery"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(g._id, g.name)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Delete gallery"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create New Gallery Form */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2">
                <MdAdd size={20} className="text-gold" />
                <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">Add New Gallery</h3>
              </div>

              <form onSubmit={handleCreateGallery} className="space-y-4">
                <Field label="Gallery Name *">
                  <input type="text" required placeholder="e.g. Natural History Gallery"
                    value={galleryForm.name}
                    onChange={e => setGalleryForm(f => ({ ...f, name: e.target.value }))}
                    className={inputCls} />
                </Field>
                <Field label="Description *">
                  <textarea required rows={3} placeholder="Describe what this gallery exhibits..."
                    value={galleryForm.description}
                    onChange={e => setGalleryForm(f => ({ ...f, description: e.target.value }))}
                    className={textareaCls} />
                </Field>

                {/* Image upload for create form */}
                <Field label="Cover Image">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 hover:border-gold rounded-xl py-3 cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => e.target.files[0] && uploadImage(e.target.files[0], url => setGalleryForm(f => ({ ...f, coverImage: url })))} />
                        {uploadingImage
                          ? <><div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" /><span className="text-xs text-stone-400">Uploading...</span></>
                          : <><span className="text-lg">📁</span><span className="text-xs font-semibold text-stone-500">Click to upload image</span></>
                        }
                      </label>
                      {galleryForm.coverImage && (
                        <img src={galleryForm.coverImage} alt="preview"
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400">Or paste an image URL:</p>
                    <input type="text" placeholder="https://images.unsplash.com/..."
                      value={galleryForm.coverImage}
                      onChange={e => setGalleryForm(f => ({ ...f, coverImage: e.target.value }))}
                      className={inputCls} />
                  </div>
                </Field>

                <Field label="Museum">
                  <select value={galleryForm.museumId}
                    onChange={e => setGalleryForm(f => ({ ...f, museumId: e.target.value }))}
                    className={inputCls}>
                    <option value="">Auto-select (uses first museum)</option>
                    {museums.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </Field>

                <button type="submit" disabled={galleryFormLoading || uploadingImage}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors uppercase tracking-wider text-xs shadow-md disabled:opacity-60">
                  {galleryFormLoading
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating...</>
                    : <><MdAdd size={18} /> Create Gallery</>
                  }
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════ TAB: QUIZZES ═══════════ */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Quiz Management</h2>
              <button onClick={openCreateQuiz}
                className="flex items-center gap-2 bg-gold text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md uppercase tracking-wider">
                <MdAdd size={16} /> New Quiz
              </button>
            </div>

            {/* Quiz list */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between">
                <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">All Quizzes</h3>
                <span className="text-xs text-stone-400">{quizzes.length} total</span>
              </div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
                </div>
              ) : quizzes.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <p className="text-3xl">🧠</p>
                  <p className="text-sm font-semibold text-stone-400">No quizzes yet. Create one above.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-stone-700">
                  {quizzes.map(q => (
                    <div key={q._id} className="flex items-center gap-4 px-5 py-4 hover:bg-amber-50/30 dark:hover:bg-stone-700/40 transition-colors">
                      {/* Cover image */}
                      {q.coverImage ? (
                        <img src={q.coverImage} alt={q.title}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-stone-200 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center text-2xl flex-shrink-0 border border-stone-200">🧠</div>
                      )}
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary dark:text-parchment text-sm">{q.title}</p>
                        <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{q.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize
                            ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700'
                              : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-600'}`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] font-bold bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                            {q.questions?.length || 0} questions
                          </span>
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                            {q.pointsReward} pts
                          </span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => openEditQuiz(q)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit quiz">
                          <MdEdit size={18} />
                        </button>
                        <button onClick={() => handleDeleteQuiz(q._id, q.title)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete quiz">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ TAB: ANALYTICS ═══════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">User Analytics</h2>
              <button onClick={fetchAnalytics}
                className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                <MdRefresh size={16} /> Refresh
              </button>
            </div>

            {analyticsLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
              </div>
            ) : !analyticsData ? (
              <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-16 text-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="font-heading font-bold text-primary dark:text-parchment text-lg">Analytics Not Loaded</p>
                <p className="text-xs text-stone-400 mt-1">Click the Analytics tab or Refresh to load data.</p>
              </div>
            ) : (
              <>
                {/* ── Stat Cards Row ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={<MdPeople size={22} />} label="Total Users" value={analyticsData.totalUsers} color="bg-primary" />
                  <StatCard icon="👤" label="Visitors" value={analyticsData.totalVisitors} color="bg-accent" />
                  <StatCard icon="🛡️" label="Admins" value={analyticsData.totalAdmins} color="bg-gold" />
                  <StatCard icon={<MdQrCode2 size={22} />} label="Total QR Scans" value={analyticsData.totalScans} color="bg-green-700" />
                </div>

                {/* ── User Registration Trend (Area Chart) ── */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MdTrendingUp size={20} className="text-gold" />
                    <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">User Registration Trend (12 Months)</h3>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.registrationChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4A34B" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#D4A34B" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#d6d3d1' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#d6d3d1' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px', fontWeight: 600 }}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.label || label}
                        />
                        <Area type="monotone" dataKey="users" stroke="#D4A34B" strokeWidth={2.5} fill="url(#regGradient)" name="Registrations" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ── QR Scans Per Exhibit (Bar Chart) ── */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MdQrCode2 size={20} className="text-primary dark:text-parchment" />
                    <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">QR Scans Per Exhibit</h3>
                  </div>
                  {analyticsData.qrScans.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-2xl mb-2">📱</p>
                      <p className="text-sm font-semibold text-stone-400">No scan data yet. Scans are recorded when users visit exhibit pages.</p>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.qrScans.slice(0, 10)}
                          margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
                          barSize={36}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                          <XAxis
                            dataKey="exhibitTitle"
                            tick={{ fontSize: 10, fill: '#78716c' }}
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                            axisLine={{ stroke: '#d6d3d1' }}
                          />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#d6d3d1' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px', fontWeight: 600 }}
                          />
                          <Bar dataKey="scanCount" name="Scans" radius={[6, 6, 0, 0]}>
                            {analyticsData.qrScans.slice(0, 10).map((_, idx) => (
                              <Cell key={`bar-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* ── Daily Scan Trend (Line Chart) ── */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MdTrendingUp size={20} className="text-green-700" />
                    <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">Daily Scan Activity (30 Days)</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.scanChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10, fill: '#78716c' }}
                          interval={4}
                          axisLine={{ stroke: '#d6d3d1' }}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#d6d3d1' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px', fontWeight: 600 }}
                        />
                        <Line type="monotone" dataKey="scans" stroke="#4E342E" strokeWidth={2.5} dot={{ fill: '#D4A34B', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#D4A34B', stroke: '#4E342E', strokeWidth: 2 }} name="Scans" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ── Two-column: Top Scanned + User Role Pie ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Scanned Exhibits Table */}
                  <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                      <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">Top Scanned Exhibits</h3>
                    </div>
                    <div className="divide-y divide-stone-100 dark:divide-stone-700">
                      {analyticsData.qrScans.slice(0, 8).map((item, idx) => (
                        <div key={item.exhibitId} className="flex items-center gap-3 px-5 py-3 hover:bg-amber-50/30 dark:hover:bg-stone-700/40 transition-colors">
                          <span className="w-6 h-6 rounded-full bg-primary text-parchment flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          {item.image ? (
                            <img src={item.image} alt={item.exhibitTitle} className="w-10 h-10 rounded-lg object-cover border border-stone-200 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-lg flex-shrink-0">🗿</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-primary dark:text-parchment truncate">{item.exhibitTitle}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.hasQR ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                {item.hasQR ? '✓ QR Active' : 'No QR'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-heading font-bold text-primary dark:text-parchment">{item.scanCount}</p>
                            <p className="text-[10px] text-stone-400 font-semibold uppercase">scans</p>
                          </div>
                        </div>
                      ))}
                      {analyticsData.qrScans.length === 0 && (
                        <div className="p-8 text-center">
                          <p className="text-sm text-stone-400">No scan data available yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Role Distribution Pie */}
                  <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
                    <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide mb-4">User Role Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Visitors', value: analyticsData.totalVisitors },
                              { name: 'Admins', value: analyticsData.totalAdmins }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#4E342E" />
                            <Cell fill="#D4A34B" />
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px', fontWeight: 600 }} />
                          <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-100 dark:border-stone-600 text-center">
                        <p className="text-2xl font-heading font-bold text-primary dark:text-parchment">{analyticsData.totalVisitors}</p>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Visitors</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                        <p className="text-2xl font-heading font-bold text-gold">{analyticsData.totalAdmins}</p>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Admins</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Recent Registrations ── */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between">
                    <h3 className="font-heading font-bold text-primary dark:text-parchment text-sm uppercase tracking-wide">Recent Registrations</h3>
                    <span className="text-xs text-stone-400">Last 10 users</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-primary text-parchment">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Role</th>
                          <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                        {analyticsData.recentUsers.map((u, idx) => (
                          <tr key={u._id} className={`hover:bg-amber-50/40 dark:hover:bg-stone-700/40 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-stone-800' : 'bg-stone-50/40 dark:bg-stone-800/60'}`}>
                            <td className="px-5 py-3">
                              <p className="font-semibold text-primary dark:text-parchment text-sm">{u.name}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-xs text-stone-600 dark:text-stone-400">{u.email}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary text-parchment' : 'bg-stone-100 text-stone-600'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs text-stone-500">{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════ TAB: ADMIN ACCOUNTS ═══════════ */}
        {activeTab === 'admins' && (
          <div className="max-w-xl space-y-6">
            <h2 className="font-heading font-bold text-primary dark:text-parchment text-xl uppercase">Create Account</h2>

            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6 space-y-5">
              <p className="text-xs text-stone-500 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl">
                ⚡ Use this form to create new <strong>Admin</strong> or <strong>Visitor</strong> accounts directly in the database.
              </p>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <Field label="Full Name">
                  <input
                    type="text"
                    required
                    placeholder="Dr. Nimal Perera"
                    value={adminForm.name}
                    onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    required
                    placeholder="curator@museum150.gov.lk"
                    value={adminForm.email}
                    onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
                <Field label="Password">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={adminForm.password}
                    onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
                <Field label="Role">
                  <select
                    value={adminForm.role}
                    onChange={e => setAdminForm(f => ({ ...f, role: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="admin">Admin (Curator)</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </Field>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-parchment font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors uppercase tracking-wider text-xs shadow-md disabled:opacity-60"
                >
                  <MdOutlinePersonAdd size={18} />
                  {adminLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>

            {/* Default credentials reminder */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3">
              <h3 className="font-heading font-bold text-primary text-sm uppercase">Seeded Accounts</h3>
              <div className="space-y-2">
                {[
                  { label: 'Admin', email: 'admin@museum150.gov.lk', password: 'admin123', role: 'Admin' },
                  { label: 'Visitor', email: 'visitor@museum150.lk', password: 'visitor123', role: 'Visitor' },
                ].map(acc => (
                  <div key={acc.email} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.role === 'Admin' ? 'bg-primary text-parchment' : 'bg-stone-200 text-stone-600'}`}>
                      {acc.role}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-700">{acc.email}</p>
                      <p className="text-[10px] text-stone-400">Password: {acc.password}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════ EXHIBIT MODAL ═══════════ */}
      {showExhibitModal && (
        <Modal
          title={editingExhibit ? 'Edit Exhibit' : 'Create New Exhibit'}
          onClose={() => setShowExhibitModal(false)}
        >
          <form onSubmit={handleExhibitSubmit} className="space-y-5">

            {/* Basic Info */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Basic Information</p>
              <Field label="Title *">
                <input type="text" required placeholder="Ancient Gold Crown" value={exhibitForm.title}
                  onChange={e => setExhibitForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Description *">
                <textarea
                  required
                  rows={10}
                  placeholder="Enter exhibit description here. Spaces and line breaks will be preserved exactly as typed..."
                  value={exhibitForm.description}
                  onChange={e => setExhibitForm(f => ({ ...f, description: e.target.value }))}
                  className={descriptionCls}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </Field>
            </div>

            {/* Classification */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Classification</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Museum *">
                  <select required value={exhibitForm.museumId}
                    onChange={e => setExhibitForm(f => ({ ...f, museumId: e.target.value }))} className={inputCls}>
                    <option value="">Select Museum</option>
                    {museums.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </Field>
                <Field label="Gallery *">
                  <select required value={exhibitForm.galleryId}
                    onChange={e => setExhibitForm(f => ({ ...f, galleryId: e.target.value }))} className={inputCls}>
                    <option value="">Select Gallery</option>
                    {galleries.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                </Field>
              </div>
            </div>


            {/* Media */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Images</p>

              {/* Image upload + preview */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  {/* Upload button */}
                  <label className={`flex-1 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl py-4 cursor-pointer transition-colors
                    ${uploadingImage ? 'border-gold/40 opacity-60 pointer-events-none' : 'border-stone-200 hover:border-gold'}`}>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        if (e.target.files[0]) {
                          uploadImage(e.target.files[0], url => {
                            setExhibitForm(f => ({ ...f, images: [url, ...f.images.filter(i => i && i !== url)] }));
                          });
                        }
                      }} />
                    {uploadingImage
                      ? <><div className="w-5 h-5 border-2 border-gold/40 border-t-gold rounded-full animate-spin" /><span className="text-xs text-stone-400">Uploading image...</span></>
                      : <><span className="text-2xl">🖼️</span><span className="text-xs font-semibold text-stone-500">Click to upload image</span><span className="text-[10px] text-stone-400">JPG, PNG, GIF up to 50MB</span></>
                    }
                  </label>

                  {/* Image previews */}
                  {exhibitForm.images?.filter(i => i).length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {exhibitForm.images.filter(i => i).slice(0, 3).map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`preview-${idx}`}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-stone-200 shadow-sm" />
                          <button type="button"
                            onClick={() => setExhibitForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL paste input */}
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Or paste image URL and press Enter..."
                    className={inputCls}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        const url = e.target.value.trim();
                        setExhibitForm(f => ({ ...f, images: [url, ...f.images.filter(i => i && i !== url)] }));
                        e.target.value = '';
                      }
                    }} />
                  <span className="text-[10px] text-stone-400 whitespace-nowrap">Press Enter to add</span>
                </div>
              </div>

              {/* Audio & Video */}
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1 pt-1">Audio & Video (Optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Audio URL">
                  <input type="url" placeholder="https://..." value={exhibitForm.audioUrl}
                    onChange={e => setExhibitForm(f => ({ ...f, audioUrl: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Video URL">
                  <input type="url" placeholder="https://..." value={exhibitForm.videoUrl}
                    onChange={e => setExhibitForm(f => ({ ...f, videoUrl: e.target.value }))} className={inputCls} />
                </Field>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Timeline Events</p>
                <button type="button" onClick={addTimelineRow}
                  className="flex items-center gap-1 text-[10px] font-bold text-gold hover:text-amber-600 transition-colors">
                  <MdAdd size={14} /> Add Row
                </button>
              </div>
              {exhibitForm.timeline.map((t, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-2">
                    <input type="text" placeholder="Year" value={t.year}
                      onChange={e => updateTimeline(idx, 'year', e.target.value)} className={inputCls} />
                  </div>
                  <div className="col-span-4">
                    <input type="text" placeholder="Event Title" value={t.title}
                      onChange={e => updateTimeline(idx, 'title', e.target.value)} className={inputCls} />
                  </div>
                  <div className="col-span-5">
                    <input type="text" placeholder="Brief description" value={t.description}
                      onChange={e => updateTimeline(idx, 'description', e.target.value)} className={inputCls} />
                  </div>
                  <div className="col-span-1 flex justify-center pt-2">
                    {exhibitForm.timeline.length > 1 && (
                      <button type="button" onClick={() => removeTimelineRow(idx)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <MdClose size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Translations */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">
                Translations (Sinhala &amp; Tamil)
              </p>
              {[{ lang: 'si', label: '🇱🇰 Sinhala' }, { lang: 'ta', label: '🌺 Tamil' }].map(({ lang, label }) => (
                <div key={lang} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-2">
                  <p className="text-xs font-bold text-stone-600">{label}</p>
                  <input type="text" placeholder={`Title in ${label}`}
                    value={exhibitForm.translations[lang]?.title || ''}
                    onChange={e => updateTranslation(lang, 'title', e.target.value)} className={inputCls} />
                  <textarea rows={2} placeholder={`Description in ${label}`}
                    value={exhibitForm.translations[lang]?.description || ''}
                    onChange={e => updateTranslation(lang, 'description', e.target.value)} className={textareaCls} />
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
              <button type="button" onClick={() => setShowExhibitModal(false)}
                className="flex-1 border border-stone-200 text-stone-600 font-bold py-3 rounded-xl hover:bg-stone-50 transition-colors text-xs uppercase">
                Cancel
              </button>
              <button type="submit" disabled={formLoading}
                className="flex-1 bg-primary text-parchment font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors text-xs uppercase shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {formLoading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                  : editingExhibit ? '✓ Update Exhibit' : '✓ Create Exhibit + Generate QR'
                }
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ═══════════ GALLERY EDIT MODAL ═══════════ */}
      {showGalleryModal && editingGallery && (
        <Modal title={`Edit Gallery: ${editingGallery.name}`} onClose={() => setShowGalleryModal(false)}>
          <form onSubmit={handleEditGallerySubmit} className="space-y-5">

            {/* Name & Description */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Basic Info</p>
              <Field label="Gallery Name *">
                <input type="text" required placeholder="Gallery name"
                  value={editGalleryForm.name}
                  onChange={e => setEditGalleryForm(f => ({ ...f, name: e.target.value }))}
                  className={inputCls} />
              </Field>
              <Field label="Description *">
                <textarea required rows={3} placeholder="Gallery description..."
                  value={editGalleryForm.description}
                  onChange={e => setEditGalleryForm(f => ({ ...f, description: e.target.value }))}
                  className={textareaCls} />
              </Field>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Cover Image</p>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                  {editGalleryForm.coverImage ? (
                    <img src={editGalleryForm.coverImage} alt="preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-stone-200 shadow-sm" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center text-3xl">🖼️</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  {/* Upload button */}
                  <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 hover:border-gold rounded-xl py-3 cursor-pointer transition-colors w-full ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files[0] && uploadImage(e.target.files[0], url => setEditGalleryForm(f => ({ ...f, coverImage: url })))} />
                    {uploadingImage
                      ? <><div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" /><span className="text-xs text-stone-400">Uploading to server...</span></>
                      : <><span className="text-base">📁</span><span className="text-xs font-semibold text-stone-500">Upload new image</span></>
                    }
                  </label>
                  {/* URL fallback */}
                  <input type="text" placeholder="Or paste image URL..."
                    value={editGalleryForm.coverImage}
                    onChange={e => setEditGalleryForm(f => ({ ...f, coverImage: e.target.value }))}
                    className={inputCls} />
                  <p className="text-[10px] text-stone-400">Uploaded images are stored on the server and served at localhost:5001/uploads/</p>
                </div>
              </div>
            </div>

            {/* Museum */}
            <Field label="Museum">
              <select value={editGalleryForm.museumId}
                onChange={e => setEditGalleryForm(f => ({ ...f, museumId: e.target.value }))}
                className={inputCls}>
                {museums.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </Field>

            {/* Submit */}
            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
              <button type="button" onClick={() => setShowGalleryModal(false)}
                className="flex-1 border border-stone-200 text-stone-600 font-bold py-3 rounded-xl hover:bg-stone-50 transition-colors text-xs uppercase">
                Cancel
              </button>
              <button type="submit" disabled={editGalleryLoading || uploadingImage}
                className="flex-1 bg-primary text-parchment font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors text-xs uppercase shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {editGalleryLoading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                  : '✓ Save Changes'
                }
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ═══════════ QUIZ CREATE / EDIT MODAL ═══════════ */}
      {showQuizModal && (
        <Modal
          title={editingQuiz ? `Edit Quiz: ${editingQuiz.title}` : 'Create New Quiz'}
          onClose={() => setShowQuizModal(false)}
        >
          <form onSubmit={handleQuizSubmit} className="space-y-6">

            {/* ── Quiz Meta ── */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Quiz Info</p>
              <Field label="Quiz Title *">
                <input required type="text" placeholder="e.g. Engineering Heritage Quiz"
                  value={quizForm.title}
                  onChange={e => setQuizForm(f => ({ ...f, title: e.target.value }))}
                  className={inputCls} />
              </Field>
              <Field label="Description *">
                <textarea required rows={2} placeholder="What is this quiz about?"
                  value={quizForm.description}
                  onChange={e => setQuizForm(f => ({ ...f, description: e.target.value }))}
                  className={textareaCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Difficulty">
                  <select value={quizForm.difficulty}
                    onChange={e => setQuizForm(f => ({ ...f, difficulty: e.target.value }))}
                    className={inputCls}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </Field>
                <Field label="Points Reward">
                  <input type="number" min={0} value={quizForm.pointsReward}
                    onChange={e => setQuizForm(f => ({ ...f, pointsReward: parseInt(e.target.value) || 0 }))}
                    className={inputCls} />
                </Field>
              </div>
            </div>

            {/* ── Cover Image ── */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1">Cover Image</p>
              <div className="flex items-start gap-3">
                {quizForm.coverImage ? (
                  <img src={quizForm.coverImage} alt="cover"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-stone-200 shadow-sm flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center text-3xl flex-shrink-0">🧠</div>
                )}
                <div className="flex-1 space-y-2">
                  <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 hover:border-gold rounded-xl py-3 cursor-pointer transition-colors w-full ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files[0] && uploadImage(e.target.files[0], url => setQuizForm(f => ({ ...f, coverImage: url })))} />
                    {uploadingImage
                      ? <><div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" /><span className="text-xs text-stone-400">Uploading...</span></>
                      : <><span className="text-base">📁</span><span className="text-xs font-semibold text-stone-500">Upload cover image</span></>
                    }
                  </label>
                  <input type="text" placeholder="Or paste image URL..."
                    value={quizForm.coverImage}
                    onChange={e => setQuizForm(f => ({ ...f, coverImage: e.target.value }))}
                    className={inputCls} />
                </div>
              </div>
            </div>

            {/* ── Questions ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Questions ({quizForm.questionsData.length})</p>
                <button type="button" onClick={addQuestion}
                  className="flex items-center gap-1 text-[10px] font-bold text-gold hover:text-amber-600 transition-colors">
                  <MdAdd size={14} /> Add Question
                </button>
              </div>

              {quizForm.questionsData.map((q, idx) => (
                <div key={idx} className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase">Q{idx + 1}</span>
                    {quizForm.questionsData.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(idx)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <MdClose size={16} />
                      </button>
                    )}
                  </div>

                  {/* Question type */}
                  <Field label="Question Type">
                    <select value={q.type}
                      onChange={e => updateQuestion(idx, 'type', e.target.value)}
                      className={inputCls}>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True / False</option>
                      <option value="image-based">Image Based</option>
                    </select>
                  </Field>

                  {/* Question text */}
                  <Field label="Question Text *">
                    <input required type="text" placeholder="Enter the question..."
                      value={q.text}
                      onChange={e => updateQuestion(idx, 'text', e.target.value)}
                      className={inputCls} />
                  </Field>

                  {/* Image upload for image-based questions */}
                  {q.type === 'image-based' && (
                    <Field label="Question Image">
                      <div className="space-y-2">
                        {q.imageUrl && (
                          <img src={q.imageUrl} alt="question" className="w-full h-32 object-cover rounded-lg border border-stone-200" />
                        )}
                        <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 hover:border-gold rounded-xl py-2.5 cursor-pointer transition-colors w-full ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => e.target.files[0] && uploadImage(e.target.files[0], url => updateQuestion(idx, 'imageUrl', url))} />
                          {uploadingImage
                            ? <><div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" /><span className="text-xs text-stone-400">Uploading...</span></>
                            : <><span>🖼️</span><span className="text-xs font-semibold text-stone-500">Upload question image</span></>
                          }
                        </label>
                        <input type="text" placeholder="Or paste image URL..."
                          value={q.imageUrl}
                          onChange={e => updateQuestion(idx, 'imageUrl', e.target.value)}
                          className={inputCls} />
                      </div>
                    </Field>
                  )}

                  {/* Options */}
                  {q.type === 'multiple-choice' && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Options</p>
                      {(q.options.length > 0 ? q.options : ['', '', '', '']).map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-400 w-5 text-center">{String.fromCharCode(65 + oIdx)}.</span>
                          <input type="text" placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            value={opt}
                            onChange={e => updateOption(idx, oIdx, e.target.value)}
                            className={`${inputCls} flex-1`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'true-false' && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Options</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['True', 'False'].map((opt, oIdx) => (
                          <div key={oIdx} className={`px-4 py-2 rounded-lg border text-xs font-bold text-center cursor-pointer transition-colors
                            ${q.correctAnswer === opt ? 'bg-green-100 border-green-400 text-green-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}
                            onClick={() => updateQuestion(idx, 'correctAnswer', opt)}>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-stone-400">Click the correct answer above.</p>
                    </div>
                  )}

                  {/* Correct answer & points */}
                  <div className="grid grid-cols-2 gap-3">
                    {q.type !== 'true-false' && (
                      <Field label="Correct Answer *">
                        <input required type="text"
                          placeholder={q.type === 'multiple-choice' ? 'e.g. Option A text' : 'Correct answer text'}
                          value={q.correctAnswer}
                          onChange={e => updateQuestion(idx, 'correctAnswer', e.target.value)}
                          className={inputCls} />
                      </Field>
                    )}
                    <Field label="Points">
                      <input type="number" min={1} value={q.points}
                        onChange={e => updateQuestion(idx, 'points', parseInt(e.target.value) || 10)}
                        className={inputCls} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex gap-3 sticky bottom-0 bg-white py-2">
              <button type="button" onClick={() => setShowQuizModal(false)}
                className="flex-1 border border-stone-200 text-stone-600 font-bold py-3 rounded-xl hover:bg-stone-50 transition-colors text-xs uppercase">
                Cancel
              </button>
              <button type="submit" disabled={quizFormLoading || editQuizLoading || uploadingImage}
                className="flex-1 bg-primary text-parchment font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors text-xs uppercase shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {(quizFormLoading || editQuizLoading)
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                  : editingQuiz ? '✓ Update Quiz' : '✓ Create Quiz'
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>

  );
};

export default Dashboard;

