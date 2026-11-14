import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, CheckCircle2, ArrowLeft, Camera, Key } from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { currentUser, userProfile, updateCurrentUserProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(currentUser?.uid || 'user');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    await updateCurrentUserProfile({
      fullName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
          <h1 className="text-2xl font-extrabold text-navy-900 mb-1">
            Profile Settings
          </h1>
          <p className="text-xs text-slate-400 mb-8">
            Manage your personal profile details and privacy preferences.
          </p>

          {savedSuccess && (
            <div className="mb-6 p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-2xl bg-slate-100 object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={randomizeAvatar}
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-brand-500 text-white shadow-md hover:bg-brand-600"
                  title="Generate new avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Profile Picture</h4>
                <p className="text-xs text-slate-400 mt-0.5">Click the camera icon to randomize your visual avatar.</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Email Address (Verified)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email || ''}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  User ID (Firebase UID)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.uid}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                Change Password
              </Link>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20"
              >
                Save Changes
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
