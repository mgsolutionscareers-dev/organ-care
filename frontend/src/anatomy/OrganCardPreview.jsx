import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Activity, ShieldCheck } from 'lucide-react';

export const OrganCardPreview = ({ organ, onClose }) => {
  const navigate = useNavigate();

  if (!organ) return null;

  const organImages = {
    heart: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80",
    brain: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80",
    lungs: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80",
    liver: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80",
    kidneys: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=400&q=80",
  };

  const imageSrc = organImages[organ.organId] || "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="w-80 bg-navy-900/90 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-5 text-white shadow-glow transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Selected Organ
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">{organ.name}</h3>
        </div>
        <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Realistic anatomical rendering card container */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-gradient-to-b from-navy-950/80 to-navy-900/80 border border-teal-500/20 flex items-center justify-center group">
        <img 
          src={imageSrc} 
          alt={organ.name} 
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
        <div className="absolute bottom-2 left-3 right-3 text-xs text-teal-200/90 font-medium">
          {organ.tagline || organ.system}
        </div>
      </div>

      <p className="text-sm text-slate-300 line-clamp-3 mb-5 leading-relaxed">
        {organ.overview || `The ${organ.name.toLowerCase()} plays an indispensable role in maintaining systemic bodily homeostasis and health.`}
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => navigate(`/organ/${organ.organId}`)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/40"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/nutrition?organ=${organ.organId}`)}
          className="w-full py-2 px-4 rounded-xl bg-navy-800/80 hover:bg-navy-800 text-teal-300 hover:text-white border border-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Nutrition & Care Tips
        </button>
      </div>
    </div>
  );
};
