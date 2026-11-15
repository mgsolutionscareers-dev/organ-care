import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Maximize2, X, Building2 } from 'lucide-react';

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

  if (!organ) return null;

  const organImg = ORGAN_IMAGES[organ.organId] || ORGAN_IMAGES.heart;
  const specialtyKey = organ.recommendedSpecialist?.specialtyKey || 'all';

  return (
    <div className="w-72 sm:w-80 max-w-[320px] bg-navy-950/95 backdrop-blur-xl border border-teal-500/35 rounded-3xl p-5 text-white shadow-2xl transition-all duration-300 animate-in fade-in select-none">
      
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
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-navy-800 transition-colors -mr-1"
            title="Dismiss preview"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Visual Preview Box (Matches Screenshot Reference) */}
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

      {/* Physiological Overview */}
      <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        {organ.overview || `The ${organ.name.toLowerCase()} plays an indispensable role in maintaining systemic homeostasis.`}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {onIsolate && (
          <button
            onClick={() => onIsolate(organ)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all ${
              isIsolated 
                ? 'bg-amber-500 hover:bg-amber-400 text-navy-950' 
                : 'bg-brand-500 hover:bg-brand-400 text-navy-950 shadow-brand-500/20'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {isIsolated ? 'Viewing Isolated 3D View' : 'Isolate 3D Organ (360°)'}
          </button>
        )}

        {/* Direct Hospital Locator Link for this Organ */}
        <button
          onClick={() => navigate(`/hospitals?organ=${organ.organId}&specialty=${specialtyKey}`)}
          className="w-full py-2.5 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-white border border-teal-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <Building2 className="w-3.5 h-3.5 text-teal-400" />
          Find Hospitals Near Me
        </button>

        <button
          onClick={() => navigate(`/organ/${organ.organId}`)}
          className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => navigate(`/nutrition?organ=${organ.organId}`)}
          className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-teal-300 hover:text-white border border-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-3 h-3 text-teal-400" />
          Nutrition Guidance
        </button>
      </div>

    </div>
  );
};
