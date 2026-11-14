import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Bookmark, 
  Settings, 
  LogOut, 
  Search, 
  Heart, 
  Stethoscope, 
  ArrowRight, 
  Activity, 
  Clock, 
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchSearchHistory } from '../services/historyService';
import { fetchFavoriteOrgans, fetchFavoriteDoctors } from '../services/favoritesService';
import { organsData } from '../data/organsData.js';

export const DashboardPage = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [favoriteOrgans, setFavoriteOrgans] = useState([]);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [hist, favOrg, favDoc] = await Promise.all([
          fetchSearchHistory(currentUser.uid),
          fetchFavoriteOrgans(currentUser.uid),
          fetchFavoriteDoctors(currentUser.uid)
        ]);
        setHistory(hist);
        setFavoriteOrgans(favOrg);
        setFavoriteDoctors(favDoc);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Health Explorer';
  const displayEmail = currentUser?.email || 'user@organcare.org';
  const displayPhoto = userProfile?.photoURL || currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ----------------- DASHBOARD GRID (Matches Reference Screenshot) ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu (Matches Reference) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between space-y-6">
            <div>
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-navy-950 via-navy-900 to-[#0A2E35] text-white">
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-14 h-14 rounded-2xl object-cover bg-white/10 border border-teal-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold truncate">{displayName}</h3>
                  <p className="text-xs text-slate-300 truncate">{displayEmail}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold mt-1">
                    Free Health Account
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="mt-6 space-y-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-50 text-brand-600 font-bold text-xs sm:text-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-500" />
                  Dashboard
                </Link>

                <Link
                  to="/dashboard/history"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:text-navy-900 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <History className="w-4 h-4 text-slate-400" />
                  Search History
                </Link>

                <Link
                  to="/dashboard/favorites"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:text-navy-900 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  Saved Favorites
                </Link>

                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:text-navy-900 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Profile Settings
                </Link>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              Log Out
            </button>
          </div>

          {/* Right Main Content: Stats & Recent Activity */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Welcome Banner */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                My Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Welcome back, {displayName}! Track your exploration history and favorite medical resources.
              </p>
            </div>

            {/* 3 Metric Cards (Matches Reference: Searches, Favorites, Doctors) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Stat 1: Total Searches */}
              <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900">{history.length}</div>
                  <div className="text-xs font-semibold text-slate-400">Total Searches</div>
                </div>
              </div>

              {/* Stat 2: Favorite Organs */}
              <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900">{favoriteOrgans.length}</div>
                  <div className="text-xs font-semibold text-slate-400">Favorite Organs</div>
                </div>
              </div>

              {/* Stat 3: Favorite Doctors */}
              <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900">{favoriteDoctors.length}</div>
                  <div className="text-xs font-semibold text-slate-400">Saved Doctors</div>
                </div>
              </div>

            </div>

            {/* Recent Activity Card (Matches Reference) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-navy-900">Recent Activity</h3>
                  <p className="text-xs text-slate-400">Your recent searches and 3D organ exploration history</p>
                </div>
                <Link
                  to="/dashboard/history"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs">No exploration history recorded yet.</p>
                  <Link
                    to="/anatomy"
                    className="mt-3 inline-block px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
                  >
                    Start Exploring 3D Body
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.slice(0, 5).map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between group">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-brand-50 text-brand-600 flex items-center justify-center font-bold shrink-0 transition-colors">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {item.path && (
                        <Link
                          to={item.path}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors shrink-0"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/anatomy"
                className="p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 font-extrabold shadow-md flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-base">Interactive 3D Explorer</h4>
                  <p className="text-xs text-navy-900/80 font-medium mt-1">Rotate & zoom internal organs</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/ai-assistant"
                className="p-6 rounded-3xl bg-navy-900 text-white font-extrabold shadow-md flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-base">Ask Health Assistant</h4>
                  <p className="text-xs text-slate-300 font-medium mt-1">Instant medical educational AI</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

