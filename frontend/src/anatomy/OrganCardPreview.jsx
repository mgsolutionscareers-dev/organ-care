import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, ShieldCheck, RotateCw } from 'lucide-react';
import { Organ3DViewer } from './Organ3DViewer';

export const OrganCardPreview = ({ organ, onClose }) => {
  const navigate = useNavigate();

  if (!organ) return null;

  return (
    <div className="w-80 bg-navy-950/90 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-5 text-white shadow-glow transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Selected Anatomical Part
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">{organ.name}</h3>
        </div>
        <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Realistic 3D Anatomical Rotating Preview */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-b from-navy-950 via-[#062128] to-navy-950 border border-teal-500/30 flex items-center justify-center">
        <Organ3DViewer organ={organ} />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-navy-900/80 text-teal-300 text-[10px] font-bold flex items-center gap-1 pointer-events-none">
          <RotateCw className="w-3 h-3 animate-spin" />
          Interactive 3D Part
        </div>
        <div className="absolute bottom-2 left-3 right-3 text-[11px] text-teal-200/90 font-medium truncate pointer-events-none">
          {organ.tagline || organ.system}
        </div>
      </div>

      <p className="text-xs text-slate-300 line-clamp-3 mb-5 leading-relaxed">
        {organ.overview || `The ${organ.name.toLowerCase()} plays a vital role in human biological homeostasis and physiological function.`}
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => navigate(`/organ/${organ.organId}`)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/40"
        >
          View Full Anatomy Details
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/nutrition?organ=${organ.organId}`)}
          className="w-full py-2 px-4 rounded-xl bg-navy-800/80 hover:bg-navy-800 text-teal-300 hover:text-white border border-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Organ Nutrition Guidance
        </button>
      </div>
    </div>
  );
};
