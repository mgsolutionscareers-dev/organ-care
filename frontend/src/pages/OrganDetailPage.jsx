import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck, 
  Activity, 
  AlertTriangle, 
  Apple, 
  Stethoscope, 
  Building2, 
  Share2, 
  ShieldAlert, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { organsData } from '../../../backend/src/data/organsData.js';
import { useAuth } from '../context/AuthContext';
import { recordHistoryEvent } from '../services/historyService';
import { toggleFavoriteOrgan, fetchFavoriteOrgans } from '../services/favoritesService';

export const OrganDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [organ, setOrgan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, functions, diseases, nutrition, lifestyle, specialist
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Look up organ from dataset or API
    const found = organsData.find(o => o.organId.toLowerCase() === id.toLowerCase());
    if (found) {
      setOrgan(found);
      // Record view in history for authenticated users
      if (currentUser) {
        recordHistoryEvent(currentUser.uid, {
          title: `Viewed ${found.name}`,
          organId: found.organId,
          type: 'organ_view',
          path: `/organ/${found.organId}`,
          details: `Explored organ health guide for ${found.name}`
        });

        // Check favorite status
        fetchFavoriteOrgans(currentUser.uid).then(favs => {
          setIsFavorite(favs.some(f => f.organId === found.organId));
        });
      }
    }
  }, [id, currentUser]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const newState = await toggleFavoriteOrgan(currentUser.uid, organ);
    setIsFavorite(newState);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!organ) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Organ Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested organ does not exist in our anatomical database.</p>
        <Link to="/anatomy" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm">
          Return to 3D Anatomy Explorer
        </Link>
      </div>
    );
  }

  const organImages = {
    heart: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    brain: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    lungs: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
    liver: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    kidneys: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
  };

  const mainImage = organImages[organ.organId] || "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80";

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'functions', label: 'Functions' },
    { key: 'diseases', label: 'Diseases' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'lifestyle', label: 'Lifestyle' },
    { key: 'specialist', label: 'Specialist' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/anatomy" className="hover:text-brand-600 transition-colors">Anatomy</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">{organ.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLink ? 'Link Copied!' : 'Share'}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              {isFavorite ? <BookmarkCheck className="w-4 h-4 fill-rose-500" /> : <Bookmark className="w-4 h-4" />}
              {isFavorite ? 'Saved to Favorites' : 'Save Organ'}
            </button>
          </div>
        </div>

        {/* ----------------- MAIN TOP CARD ----------------- */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Anatomical Graphic / 3D Model Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full aspect-square max-w-sm rounded-3xl overflow-hidden bg-gradient-to-b from-navy-950 via-[#0B2C33] to-navy-950 p-4 border border-teal-500/30 shadow-xl flex items-center justify-center relative group">
                <img
                  src={mainImage}
                  alt={organ.name}
                  className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                
                {/* 3D Interactive trigger badge */}
                <Link
                  to={`/anatomy?organ=${organ.organId}`}
                  className="absolute bottom-4 left-4 right-4 py-2.5 px-4 rounded-xl bg-brand-500/90 hover:bg-brand-400 text-navy-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg backdrop-blur-md transition-all"
                >
                  <Activity className="w-4 h-4" />
                  View in 3D Anatomy Model
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  System: {organ.system}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Cavity: {organ.layer}
                </span>
              </div>
            </div>

            {/* Right Column: Title, Tabs & Dynamic Details */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  {organ.latinName && `Latin: ${organ.latinName}`}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">
                  {organ.name}
                </h1>
                <p className="text-base text-slate-500 font-medium mt-1">
                  {organ.tagline}
                </p>
              </div>

              {/* Navigation Tabs (Overview, Functions, Diseases, Nutrition, Lifestyle, Specialist) */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-navy-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-500 hover:text-navy-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {organ.overview}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5 mb-1.5">
                        <Activity className="w-4 h-4 text-brand-600" />
                        Primary Role
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {organ.functions[0]}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5 mb-1.5">
                        <Stethoscope className="w-4 h-4 text-sky-600" />
                        Dedicated Specialist
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Consult a <strong>{organ.recommendedSpecialist.title}</strong> for comprehensive diagnostic assessment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Functions */}
              {activeTab === 'functions' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                    Physiological & Metabolic Functions
                  </h3>
                  <div className="space-y-2.5">
                    {organ.functions.map((fn, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {fn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Diseases & Warning Signs */}
              {activeTab === 'diseases' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3">
                      Common Conditions & Pathology
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {organ.commonDiseases.map((dis, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <h4 className="text-xs font-bold text-slate-800">{dis.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dis.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Recognizing Clinical Warning Signs
                    </h3>
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                      {organ.warningSigns.map((w, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-rose-950 font-medium">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Nutrition Recommendations */}
              {activeTab === 'nutrition' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Foods That Support {organ.name} Health
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950 font-medium">
                      {organ.nutritionTips.supportive.map((food, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500">✓</span>
                          <span>{food}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Foods & Habits to Limit
                    </h4>
                    <div className="space-y-1.5 text-xs text-amber-950 font-medium">
                      {organ.nutritionTips.toLimit.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">✕</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/nutrition?organ=${organ.organId}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    View Comprehensive {organ.name} Nutrition Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Tab 5: Lifestyle */}
              {activeTab === 'lifestyle' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                    Evidence-Informed Habits for Longevity
                  </h3>
                  <div className="space-y-2.5">
                    {organ.lifestyleRecommendations.map((habit, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {habit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Specialist & Medical Care */}
              {activeTab === 'specialist' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{organ.recommendedSpecialist.title}</h4>
                        <p className="text-xs text-slate-400">Specialization: {organ.recommendedSpecialist.specialtyKey}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                      {organ.recommendedSpecialist.description}
                    </p>

                    <div className="mt-3 text-xs text-slate-500">
                      <strong>Standard Qualifications:</strong> {organ.recommendedSpecialist.qualifications}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- ACTION CTA BUTTONS ----------------- */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <Link
                  to={`/doctors?specialty=${organ.recommendedSpecialist.specialtyKey}`}
                  className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/20 transition-all"
                >
                  <Stethoscope className="w-4 h-4" />
                  Find a {organ.recommendedSpecialist.title} Near You
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={`/hospitals?specialty=${organ.recommendedSpecialist.specialtyKey}`}
                  className="px-6 py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  Find Nearby Hospitals
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Emergency Alert Note */}
        {organ.emergencyGuidance && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900 font-medium">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-950 block mb-0.5">Clinical Red Flag Warning</span>
              {organ.emergencyGuidance}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
