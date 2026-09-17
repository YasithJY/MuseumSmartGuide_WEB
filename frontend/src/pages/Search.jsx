import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ExhibitCard from '../components/cards/ExhibitCard';
import { MdSearch, MdFilterList } from 'react-icons/md';

const API = '/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(initialQuery);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`);
        setCategories(data.data || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    executeSearch();
  }, [searchParams, selectedCategory, selectedPeriod]);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      const q = searchParams.get('q');
      if (q) params.search = q;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedPeriod) params.period = selectedPeriod;

      const { data } = await axios.get(`${API}/exhibits`, { params });
      setExhibits(data.data || []);
    } catch {
      setExhibits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: search });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-primary dark:text-parchment uppercase">
          Search Artifact Collections
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Query our digitised database of historical items, ancient tools, and royal regalia.
        </p>
      </div>

      {/* Forms & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Filters */}
        <div className="bg-white/70 dark:bg-stone-800/70 p-6 rounded-xl border border-stone-200/50 dark:border-stone-700/50 space-y-6">
          <div className="flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-700 pb-3">
            <MdFilterList className="text-gold w-5 h-5" />
            <h3 className="font-heading font-bold text-sm text-primary dark:text-parchment uppercase">Filter Collection</h3>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Historical Period */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block">Historical Era</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="">All Eras</option>
              <option value="Anuradhapura">Anuradhapura Period</option>
              <option value="Polonnaruwa">Polonnaruwa Period</option>
              <option value="Kandy">Kandyan Period</option>
              <option value="Balangoda">Prehistoric Era</option>
            </select>
          </div>
        </div>

        {/* Results grid */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, titles, or inscriptions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 dark:text-parchment focus:outline-none focus:ring-2 focus:ring-gold shadow-sm text-sm dark:placeholder-stone-500"
            />
            <MdSearch className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
          </form>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
            </div>
          ) : exhibits.length === 0 ? (
            <div className="text-center py-12 bg-white/40 dark:bg-stone-800/40 border border-dashed border-stone-300 dark:border-stone-600 rounded-xl">
              <p className="text-sm text-stone-500 dark:text-stone-400 font-semibold">No exhibits matched your queries.</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Try tweaking filters or simplifying your query keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibits.map(exhibit => (
                <ExhibitCard key={exhibit._id} exhibit={exhibit} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Search;
