import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  User, 
  LogOut, 
  LayoutDashboard, 
  History, 
  Bookmark, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Bot,
  Building2,
  Stethoscope,
  Apple,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenSearch }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Heart },
    { to: '/anatomy', label: 'Anatomy', icon: Compass },
    { to: '/nutrition', label: 'Nutrition', icon: Apple },
    { to: '/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white stroke-white" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900 group-hover:text-brand-600 transition-colors">
              Organ<span className="text-brand-500">Care</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-wider uppercase font-semibold text-slate-400 -mt-1">
              Human Anatomy & Health
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              {link.icon === Sparkles && <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse-subtle" />}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Search organs, doctors, nutrition (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Auth Buttons or Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-0.5 sm:p-1 rounded-full border border-slate-200 hover:border-brand-400 transition-all focus:outline-none cursor-pointer"
              >
                <img
                  src={userProfile?.photoURL || currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`}
                  alt="User Avatar"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover bg-slate-100"
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {userProfile?.fullName || currentUser.displayName || 'Member'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    My Dashboard
                  </Link>

                  <Link
                    to="/dashboard/history"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  >
                    <History className="w-4 h-4 text-slate-400" />
                    Search History
                  </Link>

                  <Link
                    to="/dashboard/favorites"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Saved Favorites
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Profile Settings
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-navy-900 hover:text-brand-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  My Health Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-xs sm:text-sm text-navy-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-xs sm:text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
