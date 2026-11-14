import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  Bookmark, 
  Trash2, 
  Heart, 
  Stethoscope, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchSearchHistory, deleteHistoryItem, clearAllHistory } from '../services/historyService';
import { fetchFavoriteOrgans, toggleFavoriteOrgan, fetchFavoriteDoctors, toggleFavoriteDoctor } from '../services/favoritesService';

export const HistoryFavoritesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'history'; // 'history' | 'organs' | 'doctors'

  const [activeTab, setActiveTab] = useState(tabParam);
  const [history, setHistory] = useState([]);
  const [favoriteOrgans, setFavoriteOrgans] = useState([]);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadAll = async () => {
      try {
        const [hList, oList, dList] = await Promise.all([
          fetchSearchHistory(currentUser.uid),
          fetchFavoriteOrgans(currentUser.uid),
          fetchFavoriteDoctors(currentUser.uid)
        ]);
        setHistory(hList);
        setFavoriteOrgans(oList);
        setFavoriteDoctors(dList);
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [currentUser, navigate]);

  const handleDeleteHistory = async (id) => {
    await deleteHistoryItem(currentUser.uid, id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire search and exploration history?')) {
      await clearAllHistory(currentUser.uid);
      setHistory([]);
    }
  };

  const handleRemoveFavoriteOrgan = async (organ) => {
    await toggleFavoriteOrgan(currentUser.uid, organ);
    setFavoriteOrgans(prev => prev.filter(o => o.organId !== organ.organId));
  };

  const handleRemoveFavoriteDoctor = async (doctor) => {
    await toggleFavoriteDoctor(currentUser.uid, doctor);
    setFavoriteDoctors(prev => prev.filter(d => d.id !== doctor.id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs (Matches Screenshot) */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-3">
          <button
            onClick={() => { setActiveTab('history'); setSearchParams({ tab: 'history' }); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <History className="w-4 h-4" />
            Search History
          </button>

          <button
            onClick={() => { setActiveTab('organs'); setSearchParams({ tab: 'organs' }); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'organs'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorite Organs ({favoriteOrgans.length})
          </button>

          <button
            onClick={() => { setActiveTab('doctors'); setSearchParams({ tab: 'doctors' }); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'doctors'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Favorite Doctors ({favoriteDoctors.length})
          </button>
        </div>

        {/* ----------------- SPLIT LAYOUT: CONTENT & RIGHT SIDEBAR ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tab Data Lists */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100">
            
            {/* 1. SEARCH HISTORY TAB */}
            {activeTab === 'history' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-navy-900">Your Search & Exploration History</h2>
                    <p className="text-xs text-slate-400">Permanently saved under your authenticated account</p>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear History
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No search history recorded yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Try exploring organs in the 3D model or searching doctors.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {history.map((item) => (
                      <div key={item.id} className="py-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold shrink-0">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              Searched on {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.path && (
                            <Link
                              to={item.path}
                              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-600 text-xs font-bold transition-colors"
                            >
                              Explore
                            </Link>
                          )}
                          <button
                            onClick={() => handleDeleteHistory(item.id)}
                            className="p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete this history entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. FAVORITE ORGANS TAB */}
            {activeTab === 'organs' && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-6">Saved Favorite Organs</h2>

                {favoriteOrgans.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Heart className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No favorite organs bookmarked.</p>
                    <Link to="/anatomy" className="mt-3 inline-block px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs">
                      Explore Anatomy & Save Organs
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteOrgans.map((organ) => (
                      <div
                        key={organ.organId}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                            <Heart className="w-5 h-5 fill-rose-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-navy-900">{organ.name}</h4>
                            <p className="text-[11px] text-slate-500">{organ.system || 'Human Anatomy'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/organ/${organ.organId}`}
                            className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleRemoveFavoriteOrgan(organ)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. FAVORITE DOCTORS TAB */}
            {activeTab === 'doctors' && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-6">Saved Specialist Doctors</h2>

                {favoriteDoctors.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Stethoscope className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No doctors saved in your favorites.</p>
                    <Link to="/doctors" className="mt-3 inline-block px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs">
                      Browse Verified Doctors
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favoriteDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-navy-900 truncate">{doc.name}</h4>
                            <p className="text-xs text-brand-600 font-semibold">{doc.specialty}</p>
                            <p className="text-[11px] text-slate-400">{doc.hospitalAffiliation}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to="/doctors"
                            className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => handleRemoveFavoriteDoctor(doc)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Quick Actions & Brand Promo (Matches Screenshot!) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleClearHistory}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Entire History
                </button>

                <button
                  onClick={() => { setActiveTab('organs'); setSearchParams({ tab: 'organs' }); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Manage Favorites
                </button>
              </div>
            </div>

            {/* Promo Card: "Take care of your health with OrganCare" (Matches Reference!) */}
            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-navy-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <h4 className="text-lg font-extrabold leading-snug">
                  Take care of your health with OrganCare 🫀
                </h4>
                <p className="text-xs text-teal-100 leading-relaxed">
                  Continue exploring interactive anatomy models and nutrition advice crafted for optimal longevity.
                </p>
                <Link
                  to="/anatomy"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-navy-950 font-extrabold text-xs shadow-md transition-all hover:scale-105"
                >
                  Explore Again <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
