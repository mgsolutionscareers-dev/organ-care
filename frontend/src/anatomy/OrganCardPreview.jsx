import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, ShieldCheck, RotateCw, Maximize2, X } from 'lucide-react';
import { Organ3DViewer } from './Organ3DViewer';

export const OrganCardPreview = ({ organ, onClose, onIsolate, isIsolated }) => {
  const navigate = useNavigate();

  if (!organ) return null;

  return (
    <div className="w-84 bg-navy-950/95 backdrop-blur-xl border border-teal-500/35 rounded-3xl p-5 text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-300" />
            Selected Anatomical Organ
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-0.5">{organ.name}</h3>
        </div>
        
        <div className="flex items-center gap-1.5">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Realistic 3D Mini Interactive Preview */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-gradient-to-b from-navy-950 via-[#062128] to-navy-950 border border-teal-500/30">
        <Organ3DViewer organ={organ} />
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
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all ${
              isIsolated 
                ? 'bg-amber-500 hover:bg-amber-400 text-navy-950' 
                : 'bg-teal-500 hover:bg-teal-400 text-navy-950 shadow-teal-500/20'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {isIsolated ? 'Viewing Isolated 3D View' : 'Isolate Organ (360° Inspection)'}
          </button>
        )}

        <button
          onClick={() => navigate(`/organ/${organ.organId}`)}
          className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all"
        >
          View Full Medical Guide
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => navigate(`/nutrition?organ=${organ.organId}`)}
          className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-teal-300 hover:text-white border border-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-3 h-3 text-teal-400" />
          Recommended Nutrition
        </button>
      </div>

    </div>
  );
};
