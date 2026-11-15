import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Maximize2, X, Building2, ChevronDown, ChevronUp } from 'lucide-react';

// Organ-specific medical imagery & illustrations matching the design reference
const ORGAN_IMAGES = {
  heart: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80",
  brain: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
  lungs: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&q=80",
  liver: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
  kidneys: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
  stomach: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
  pancreas: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
  spleen: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
  intestines: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
  bladder: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
  bones: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80",
};

export const OrganCardPreview = ({ organ, onClose, onIsolate, isIsolated }) => {
  const navigate = useNavigate();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  if (!organ) return null;

  const organImg = ORGAN_IMAGES[organ.organId] || ORGAN_IMAGES.heart;
  const specialtyKey = organ.recommendedSpecialist?.specialtyKey || 'all';

  return (
    <>
      {/* ----------------- MOBILE DOCKED BOTTOM BAR / DRAWER (sm:hidden) ----------------- */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-30 pointer-events-auto select-none">
        
        {/* Collapsed Compact State */}
        {!mobileExpanded ? (
          <div className="p-2.5 rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-teal-500/40 shadow-2xl flex items-center justify-between gap-2 animate-in fade-in slide-in-from-bottom-2">
            <div 
              onClick={() => setMobileExpanded(true)}
              className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
            >
              <img
                src={organImg}
                alt={organ.name}
                className="w-10 h-10 rounded-xl object-cover border border-teal-500/30 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-teal-400 block truncate">
                  {organ.system} System
                </span>
                <h4 className="text-sm font-extrabold text-white leading-tight truncate">
                  {organ.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onIsolate && (
                <button
                  onClick={() => onIsolate(organ)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#14B8A6] text-navy-950 font-extrabold text-[11px] shadow-sm cursor-pointer"
                >
                  360° View
                </button>
              )}
              <button
                onClick={() => setMobileExpanded(true)}
                className="p-1.5 rounded-xl bg-navy-900 border border-teal-500/30 text-teal-300"
                title="Expand organ details"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Mobile Expanded Full Card */
          <div className="max-h-[75vh] overflow-y-auto p-4 rounded-3xl bg-navy-950/95 backdrop-blur-2xl border border-teal-500/40 shadow-2xl text-white animate-in slide-in-from-bottom-4 duration-200">
            
            {/* Drawer Drag Bar / Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold text-teal-400">
                  {organ.system} System
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMobileExpanded(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  title="Minimize"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white leading-tight mb-2">
              {organ.name}
            </h3>

            {/* Thumbnail */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5 border border-teal-500/25">
              <img
                src={organImg}
                alt={organ.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-navy-950/80 backdrop-blur-md text-[9px] font-bold text-teal-300 border border-teal-500/30">
                {organ.layer}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2 mb-3 leading-relaxed">
              {organ.overview || `Essential anatomical organ maintaining physiological homeostasis.`}
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {onIsolate && (
                <button
                  onClick={() => { setMobileExpanded(false); onIsolate(organ); }}
                  className="col-span-2 py-2 px-3 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-navy-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  {isIsolated ? 'Viewing Isolated 3D View' : 'Isolate 3D Organ (360°)'}
                </button>
              )}

              <button
                onClick={() => navigate(`/hospitals?organ=${organ.organId}&specialty=${specialtyKey}`)}
                className="py-2 px-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[11px] font-bold flex items-center justify-center gap-1"
              >
                <Building2 className="w-3 h-3 text-teal-400 shrink-0" />
                Find Hospitals
              </button>

              <button
                onClick={() => navigate(`/organ/${organ.organId}`)}
                className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1 border border-white/20"
              >
                Full Details
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- DESKTOP FLOATING CARD (hidden on mobile, sm:block) ----------------- */}
      <div className="hidden sm:block w-72 sm:w-80 max-w-[320px] bg-navy-950/95 backdrop-blur-xl border border-teal-500/35 rounded-3xl p-5 text-white shadow-2xl transition-all duration-300 animate-in fade-in select-none">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-300" />
              {organ.system} System
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 leading-tight">{organ.name}</h3>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-navy-800 transition-colors -mr-1 cursor-pointer"
              title="Dismiss preview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Visual Preview Box */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 bg-gradient-to-b from-navy-900 via-[#07242C] to-navy-950 border border-teal-500/25 group">
          <img
            src={organImg}
            alt={organ.name}
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>

          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-navy-950/80 backdrop-blur-md text-[10px] font-bold text-teal-300 border border-teal-500/30 flex items-center gap-1">
            <Activity className="w-3 h-3 text-brand-400" />
            {organ.layer}
          </div>

          <div className="absolute bottom-2 left-3 right-3 text-[11px] text-teal-200 font-semibold truncate">
            {organ.tagline || `Vital organ of the human body`}
          </div>
        </div>

        {/* Overview */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {organ.overview || `The ${organ.name.toLowerCase()} plays an indispensable role in maintaining systemic homeostasis.`}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {onIsolate && (
            <button
              onClick={() => onIsolate(organ)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isIsolated 
                  ? 'bg-amber-500 hover:bg-amber-400 text-navy-950' 
                  : 'bg-[#14B8A6] hover:bg-[#0D9488] text-navy-950 shadow-teal-500/20'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              {isIsolated ? 'Viewing Isolated 3D View' : 'Isolate 3D Organ (360°)'}
            </button>
          )}

          <button
            onClick={() => navigate(`/hospitals?organ=${organ.organId}&specialty=${specialtyKey}`)}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-white border border-teal-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            Find Hospitals Near Me
          </button>

          <button
            onClick={() => navigate(`/organ/${organ.organId}`)}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all cursor-pointer"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate(`/nutrition?organ=${organ.organId}`)}
            className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-teal-300 hover:text-white border border-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            Nutrition Guidance
          </button>
        </div>

      </div>
    </>
  );
};
