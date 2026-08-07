import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  mockMuseums, 
  mockGalleries, 
  mockExhibits, 
  mockCategories,
  mockQuizzes
} from '../utils/mockData';
import { 
  MdOutlineDashboard, 
  MdOutlineDomain, 
  MdOutlineCollections, 
  MdOutlinePhotoSizeSelectActual,
  MdOutlineAddCircle,
  MdDeleteOutline
} from 'react-icons/md';

const Dashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // States initialized from local storage or mockData defaults
  const [museums, setMuseums] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [exhibits, setExhibits] = useState([]);
  const [categories, setCategories] = useState([]);

  // Forms states
  const [museumForm, setMuseumForm] = useState({ name: '', description: '', coverImage: '' });
  const [galleryForm, setGalleryForm] = useState({ name: '', description: '', coverImage: '', museumId: '' });
  const [exhibitForm, setExhibitForm] = useState({
    title: '', description: '', historicalInfo: '',
    images: [''], audioUrl: '', videoUrl: '',
    categoryId: '', galleryId: '', museumId: '',
    timeline: [{ year: '', title: '', description: '' }]
  });

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    initializeLocalCollections();
  }, [token, activeTab]);

  const initializeLocalCollections = () => {
    setLoading(true);
    
    // Fetch or initialize local storage arrays
    const localMuseums = JSON.parse(localStorage.getItem('adminMuseums')) || mockMuseums;
    const localGalleries = JSON.parse(localStorage.getItem('adminGalleries')) || mockGalleries;
    const localExhibits = JSON.parse(localStorage.getItem('adminExhibits')) || mockExhibits;
    
    setMuseums(localMuseums);
    setGalleries(localGalleries);
    setExhibits(localExhibits);
    setCategories(mockCategories);

    // Compute statistics summary
    const totalMuseums = localMuseums.length;
    const totalGalleries = localGalleries.length;
    const totalExhibits = localExhibits.length;
    const totalVisitors = 328; // Static mock visitor count
    const totalQuizzes = mockQuizzes.length;

    // Visitor traffic charts data
    const visitorTraffic = [
      { day: 'Mon', visitors: 120 },
      { day: 'Tue', visitors: 150 },
      { day: 'Wed', visitors: 180 },
      { day: 'Thu', visitors: 220 },
      { day: 'Fri', visitors: 270 },
      { day: 'Sat', visitors: 430 },
      { day: 'Sun', visitors: 390 }
    ];

    setStats({
      stats: { totalMuseums, totalGalleries, totalExhibits, totalVisitors, totalQuizzes },
      visitorTraffic,
      popularExhibits: [
        { exhibit: localExhibits[0], visits: 182 },
        { exhibit: localExhibits[1], visits: 124 }
      ]
    });
    setLoading(false);
  };

  // CRUD modifications on local states
  const handleCreateMuseum = (e) => {
    e.preventDefault();
    const newMuseum = {
      _id: 'mus-' + Date.now(),
      ...museumForm,
      galleriesCount: 0
    };
    const updated = [...museums, newMuseum];
    setMuseums(updated);
    localStorage.setItem('adminMuseums', JSON.stringify(updated));
    alert("Museum created successfully inside local mockup database!");
    setMuseumForm({ name: '', description: '', coverImage: '' });
    initializeLocalCollections();
  };

  const handleDeleteMuseum = (id) => {
    if (!window.confirm("Delete museum?")) return;
    const updated = museums.filter(m => m._id !== id);
    setMuseums(updated);
    localStorage.setItem('adminMuseums', JSON.stringify(updated));
    initializeLocalCollections();
  };

  const handleCreateGallery = (e) => {
    e.preventDefault();
    const newGallery = {
      _id: 'gal-' + Date.now(),
      ...galleryForm,
      exhibitsCount: 0
    };
    const updated = [...galleries, newGallery];
    setGalleries(updated);
    localStorage.setItem('adminGalleries', JSON.stringify(updated));
    alert("Gallery room created successfully!");
    setGalleryForm({ name: '', description: '', coverImage: '', museumId: '' });
    initializeLocalCollections();
  };

  const handleDeleteGallery = (id) => {
    if (!window.confirm("Delete gallery room?")) return;
    const updated = galleries.filter(g => g._id !== id);
    setGalleries(updated);
    localStorage.setItem('adminGalleries', JSON.stringify(updated));
    initializeLocalCollections();
  };

  const handleCreateExhibit = (e) => {
    e.preventDefault();
    const newExhibit = {
      _id: 'ex-' + Date.now(),
      ...exhibitForm,
      categoryId: mockCategories.find(c => c._id === exhibitForm.categoryId) || mockCategories[0],
      galleryId: galleries.find(g => g._id === exhibitForm.galleryId) || galleries[0],
      museumId: museums.find(m => m._id === exhibitForm.museumId) || museums[0],
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173/exhibit/ex-${Date.now()}`
    };
    const updated = [...exhibits, newExhibit];
    setExhibits(updated);
    localStorage.setItem('adminExhibits', JSON.stringify(updated));
    alert("Exhibit created! Standard high-res QR code loaded.");
    
    // Increment exhibitsCount on selected gallery
    const updatedGalleries = galleries.map(g => g._id === exhibitForm.galleryId ? { ...g, exhibitsCount: g.exhibitsCount + 1 } : g);
    setGalleries(updatedGalleries);
    localStorage.setItem('adminGalleries', JSON.stringify(updatedGalleries));

    setExhibitForm({
      title: '', description: '', historicalInfo: '',
      images: [''], audioUrl: '', videoUrl: '',
      categoryId: '', galleryId: '', museumId: '',
      timeline: [{ year: '', title: '', description: '' }]
    });
    initializeLocalCollections();
  };

  const handleDeleteExhibit = (id) => {
    if (!window.confirm("Delete exhibit?")) return;
    const updated = exhibits.filter(ex => ex._id !== id);
    setExhibits(updated);
    localStorage.setItem('adminExhibits', JSON.stringify(updated));
    initializeLocalCollections();
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-5 gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-primary uppercase">
            Curator Control Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">Manage database objects, view visitor trends, and download QR guides.</p>
        </div>

        <div className="flex gap-2 bg-stone-100 p-1.5 rounded-lg border border-stone-200 text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${activeTab === 'overview' ? 'bg-primary text-parchment' : 'text-stone-600 hover:bg-stone-200'}`}
          >
            <MdOutlineDashboard />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('museums')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${activeTab === 'museums' ? 'bg-primary text-parchment' : 'text-stone-600 hover:bg-stone-200'}`}
          >
            <MdOutlineDomain />
            <span>Museums</span>
          </button>
          <button 
            onClick={() => setActiveTab('galleries')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${activeTab === 'galleries' ? 'bg-primary text-parchment' : 'text-stone-600 hover:bg-stone-200'}`}
          >
            <MdOutlineCollections />
            <span>Galleries</span>
          </button>
          <button 
            onClick={() => setActiveTab('exhibits')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${activeTab === 'exhibits' ? 'bg-primary text-parchment' : 'text-stone-600 hover:bg-stone-200'}`}
          >
            <MdOutlinePhotoSizeSelectActual />
            <span>Exhibits</span>
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="p-5 bg-white border border-stone-250 shadow-sm rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Museum Complex</span>
              <span className="text-2xl font-bold font-heading text-primary">{stats.stats.totalMuseums}</span>
            </div>
            <div className="p-5 bg-white border border-stone-250 shadow-sm rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Galleries</span>
              <span className="text-2xl font-bold font-heading text-primary">{stats.stats.totalGalleries}</span>
            </div>
            <div className="p-5 bg-white border border-stone-250 shadow-sm rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Exhibits Logged</span>
              <span className="text-2xl font-bold font-heading text-primary">{stats.stats.totalExhibits}</span>
            </div>
            <div className="p-5 bg-white border border-stone-250 shadow-sm rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Registered Visitors</span>
              <span className="text-2xl font-bold font-heading text-primary">{stats.stats.totalVisitors}</span>
            </div>
            <div className="p-5 bg-white border border-stone-250 shadow-sm rounded-xl col-span-2 md:col-span-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Trivia Quizzes</span>
              <span className="text-2xl font-bold font-heading text-primary">{stats.stats.totalQuizzes}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-sm text-primary uppercase">Visitor Traffic Trend (7 Days)</h3>
              
              <div className="h-60 flex items-end justify-between gap-4 pt-6">
                {stats.visitorTraffic?.map((day, idx) => {
                  const percent = Math.round((day.visitors / 450) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gold/15 hover:bg-gold/30 rounded-t border-t border-gold transition-all" style={{ height: `${percent}%` }}></div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">{day.day}</span>
                      <span className="text-[9px] font-mono text-stone-500 font-semibold">{day.visitors}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-sm text-primary uppercase">Most Visited Exhibits</h3>
              <div className="space-y-3">
                {stats.popularExhibits?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                    <span className="text-xs font-semibold text-primary truncate max-w-[185px]">{item.exhibit?.title}</span>
                    <span className="text-[10px] font-mono bg-gold/20 px-2 py-0.5 rounded text-gold font-bold">{item.visits} scans</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MUSEUMS TAB */}
      {activeTab === 'museums' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-primary uppercase flex items-center gap-1">
              <MdOutlineAddCircle className="text-gold" />
              <span>Add Museum Complex</span>
            </h3>
            
            <form onSubmit={handleCreateMuseum} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Museum Name</label>
                <input 
                  type="text" required value={museumForm.name} 
                  onChange={e => setMuseumForm({...museumForm, name: e.target.value})}
                  placeholder="e.g. National Museum, Kandy" 
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Cover Image URL</label>
                <input 
                  type="text" value={museumForm.coverImage} 
                  onChange={e => setMuseumForm({...museumForm, coverImage: e.target.value})}
                  placeholder="https://..." 
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Description</label>
                <textarea 
                  required rows={3} value={museumForm.description} 
                  onChange={e => setMuseumForm({...museumForm, description: e.target.value})}
                  placeholder="Detailed summary..." 
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-parchment py-2 rounded text-xs font-semibold uppercase tracking-wider">
                Save Museum
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-primary uppercase">Current Complexes</h3>
            <div className="space-y-3">
              {museums.map(m => (
                <div key={m._id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-150">
                  <div>
                    <h5 className="font-bold text-xs text-primary">{m.name}</h5>
                    <p className="text-[10px] text-stone-400 truncate max-w-[350px]">{m.description}</p>
                  </div>
                  <button onClick={() => handleDeleteMuseum(m._id)} className="text-red-500 hover:text-red-700 p-2">
                    <MdDeleteOutline className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GALLERIES TAB */}
      {activeTab === 'galleries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-primary uppercase flex items-center gap-1">
              <MdOutlineAddCircle className="text-gold" />
              <span>Add Gallery Room</span>
            </h3>
            
            <form onSubmit={handleCreateGallery} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Museum Parent</label>
                <select 
                  required value={galleryForm.museumId} 
                  onChange={e => setGalleryForm({...galleryForm, museumId: e.target.value})}
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none"
                >
                  <option value="">Select Museum</option>
                  {museums.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Gallery Name</label>
                <input 
                  type="text" required value={galleryForm.name} 
                  onChange={e => setGalleryForm({...galleryForm, name: e.target.value})}
                  placeholder="e.g. Polonnaruwa Room" 
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Cover Image URL</label>
                <input 
                  type="text" value={galleryForm.coverImage} 
                  onChange={e => setGalleryForm({...galleryForm, coverImage: e.target.value})}
                  placeholder="https://..." 
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Description</label>
                <textarea 
                  required rows={3} value={galleryForm.description} 
                  onChange={e => setGalleryForm({...galleryForm, description: e.target.value})}
                  placeholder="Summary of artifacts displayed..." 
                  className="w-full text-xs p-2.5 rounded border border-stone-250 bg-stone-50 focus:outline-none resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-parchment py-2 rounded text-xs font-semibold uppercase tracking-wider">
                Save Gallery
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-primary uppercase">Current Galleries</h3>
            <div className="space-y-3">
              {galleries.map(g => (
                <div key={g._id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-150">
                  <div>
                    <h5 className="font-bold text-xs text-primary">{g.name}</h5>
                    <span className="text-[9px] uppercase font-bold text-gold tracking-wide block">{g.museumId?.name || 'Colombo Museum'}</span>
                  </div>
                  <button onClick={() => handleDeleteGallery(g._id)} className="text-red-500 hover:text-red-700 p-2">
                    <MdDeleteOutline className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXHIBITS TAB */}
      {activeTab === 'exhibits' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-primary uppercase flex items-center gap-1">
              <MdOutlineAddCircle className="text-gold" />
              <span>Add Exhibit Artifact</span>
            </h3>
            
            <form onSubmit={handleCreateExhibit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Museum</label>
                  <select 
                    required value={exhibitForm.museumId} 
                    onChange={e => setExhibitForm({...exhibitForm, museumId: e.target.value})}
                    className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50"
                  >
                    <option value="">Select</option>
                    {museums.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Gallery Room</label>
                  <select 
                    required value={exhibitForm.galleryId} 
                    onChange={e => setExhibitForm({...exhibitForm, galleryId: e.target.value})}
                    className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50"
                  >
                    <option value="">Select</option>
                    {galleries.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Artifact Title</label>
                <input 
                  type="text" required value={exhibitForm.title} 
                  onChange={e => setExhibitForm({...exhibitForm, title: e.target.value})}
                  placeholder="e.g. Toluvila Buddha" 
                  className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Short Description</label>
                <textarea 
                  required rows={2} value={exhibitForm.description} 
                  onChange={e => setExhibitForm({...exhibitForm, description: e.target.value})}
                  placeholder="Introduction..." 
                  className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase">Historical Significance</label>
                <textarea 
                  required rows={3} value={exhibitForm.historicalInfo} 
                  onChange={e => setExhibitForm({...exhibitForm, historicalInfo: e.target.value})}
                  placeholder="Detailed findings..." 
                  className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Audio Link</label>
                  <input 
                    type="text" value={exhibitForm.audioUrl} 
                    onChange={e => setExhibitForm({...exhibitForm, audioUrl: e.target.value})}
                    placeholder="https://..." 
                    className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Category</label>
                  <select 
                    value={exhibitForm.categoryId} 
                    onChange={e => setExhibitForm({...exhibitForm, categoryId: e.target.value})}
                    className="w-full text-xs p-2 rounded border border-stone-250 bg-stone-50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary text-parchment py-2.5 rounded text-xs font-semibold uppercase tracking-wider">
                Publish Artifact
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-primary uppercase">Published Artifacts</h3>
            
            <div className="space-y-3">
              {exhibits.map(ex => (
                <div key={ex._id} className="flex justify-between items-center p-3.5 bg-stone-50 rounded-lg border border-stone-150">
                  <div>
                    <h5 className="font-bold text-xs text-primary">{ex.title}</h5>
                    <span className="text-[9px] font-bold text-accent uppercase">{ex.galleryId?.name || 'Stone Gallery'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {ex.qrCodeUrl && (
                      <a 
                        href={ex.qrCodeUrl} 
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] bg-stone-200 text-stone-700 border border-stone-300 font-bold px-2 py-1 rounded hover:bg-stone-300"
                      >
                        Get QR Link
                      </a>
                    )}
                    <button onClick={() => handleDeleteExhibit(ex._id)} className="text-red-500 hover:text-red-700 p-2">
                      <MdDeleteOutline className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
