import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import MuseumCard from '../components/cards/MuseumCard';
import GalleryCard from '../components/cards/GalleryCard';
import { MdMap, MdOutlineCollections, MdRefresh } from 'react-icons/md';

const API = '/api';

// Correct Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  const fetchMuseums = async (isRetry = false) => {
    setLoading(true);
    if (!isRetry) setLoadError(false);
    try {
      // The backend can be waking up from a free-tier cold start, which looks
      // like a failed request — retry once after a short wait before giving up.
      const { data } = await axios.get(`${API}/museums`, { timeout: 15000 });
      const fetchedMuseums = data.data || [];
      setMuseums(fetchedMuseums);
      setLoadError(false);
      if (fetchedMuseums.length > 0) {
        await selectMuseum(fetchedMuseums[0]);
      }
      setLoading(false);
    } catch {
      if (!isRetry) {
        setTimeout(() => fetchMuseums(true), 4000);
        return; // stay in loading state through the retry wait
      }
      setMuseums([]);
      setLoadError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  const selectMuseum = async (museum) => {
    setSelectedMuseum(museum);
    try {
      const { data } = await axios.get(`${API}/galleries`, { params: { museumId: museum._id } });
      setGalleries(data.data || []);
    } catch {
      setGalleries([]);
    }
  };

  const handleMuseumSelect = (museum) => {
    selectMuseum(museum);
  };

  // Mock coordinates for interactive Leaflet Map pins
  const galleryPins = [
    { name: "Stone Antiquities Gallery", lat: 6.9115, lng: 79.8652, desc: "Anuradhapura & Polonnaruwa carvings" },
    { name: "Kandyan Kingdom Gallery", lat: 6.9112, lng: 79.8656, desc: "Royal crown and golden throne" },
    { name: "Prehistoric Gallery", lat: 6.9110, lng: 79.8654, desc: "Early human settlements" },
    { name: "Bronzes and Art Gallery", lat: 6.9116, lng: 79.8655, desc: "Medieval metal art & statues" }
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        <p className="text-xs text-stone-400">Loading museums…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-3">
        <p className="text-sm text-stone-600 dark:text-stone-300 font-semibold">Couldn't reach the museum database.</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">The server may still be waking up — give it a moment and try again.</p>
        <button onClick={() => fetchMuseums()} className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline">
          <MdRefresh className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-primary dark:text-parchment uppercase">
            Museums & Galleries
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Browse through directories or inspect locations on the interactive map.
          </p>
        </div>
        
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-1.5 bg-primary text-parchment px-4 py-2 rounded-lg hover:bg-stone-800 transition-all font-bold text-xs uppercase"
        >
          <MdMap className="w-5 h-5 text-gold" />
          <span>{showMap ? "Show Galleries" : "View Museum Map"}</span>
        </button>
      </div>

      {/* Main Content Layout */}
      {showMap ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-heading font-bold text-lg text-primary dark:text-parchment uppercase">Interactive Museum Layout</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Colombo National Museum grounds and display floor guides</p>
          </div>
          
          <div className="h-[450px] w-full rounded-xl overflow-hidden border-2 border-gold shadow-md">
            <MapContainer center={[6.9113, 79.8654]} zoom={18} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {galleryPins.map((pin, i) => (
                <Marker key={i} position={[pin.lat, pin.lng]}>
                  <Popup>
                    <div className="text-center font-body">
                      <strong className="text-primary font-heading font-bold">{pin.name}</strong>
                      <p className="text-[10px] text-stone-500 m-0 mt-1">{pin.desc}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Museums Directory list */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-heading font-bold text-sm text-accent uppercase tracking-wider mb-2">Select Museum Complex</h3>
            {museums.map(museum => (
              <MuseumCard 
                key={museum._id} 
                museum={museum} 
                onClick={() => handleMuseumSelect(museum)}
              />
            ))}
          </div>

          {/* Galleries of Selected Museum */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <MdOutlineCollections className="text-gold w-6 h-6" />
              <h3 className="font-heading font-bold text-sm text-accent uppercase tracking-wider">
                Galleries inside {selectedMuseum?.name}
              </h3>
            </div>
            
            {galleries.length === 0 ? (
              <p className="text-xs text-stone-400 dark:text-stone-500">No galleries available in this museum complex.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleries.map(gallery => (
                  <GalleryCard 
                    key={gallery._id} 
                    gallery={gallery} 
                    onClick={() => navigate(`/gallery/${gallery._id}`)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Museums;
