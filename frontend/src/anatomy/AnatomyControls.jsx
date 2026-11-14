import React, { useState } from 'react';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Eye, 
  EyeOff, 
  User, 
  Compass, 
  Activity,
  Heart,
  Brain,
  Wind
} from 'lucide-react';

export const AnatomyControls = ({
  organs = [],
  selectedOrgan,
  onSelectOrgan,
  gender,
  setGender,
  activeSystem,
  setActiveSystem,
  layers,
  setLayers,
  onResetCamera
}) => {
  const [openSection, setOpenSection] = useState('organs'); // 'organs' | 'systems' | 'layers'

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const systems = [
    { key: 'all', label: 'All Systems' },
    { key: 'cardiovascular', label: 'Cardiovascular' },
    { key: 'nervous', label: 'Nervous System' },
    { key: 'respiratory', label: 'Respiratory' },
    { key: 'digestive', label: 'Digestive' },
    { key: 'urinary', label: 'Urinary & Renal' },
    { key: 'lymphatic', label: 'Lymphatic / Immune' }
  ];

  return (
    <div className="w-72 bg-navy-950/85 backdrop-blur-xl border border-teal-500/25 rounded-2xl p-4 text-white shadow-2xl flex flex-col gap-4">
      {/* 1. Body View Mode Toggle */}
      <div>
        <label className="text-xs uppercase tracking-wider text-teal-400 font-semibold mb-2 block">
          Select Body View
        </label>
        <div className="grid grid-cols-2 p-1 bg-navy-900/90 rounded-xl border border-teal-500/20">
          <button
            onClick={() => setGender('male')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              gender === 'male'
                ? 'bg-brand-500 text-navy-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Male
          </button>
          <button
            onClick={() => setGender('female')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              gender === 'female'
                ? 'bg-brand-500 text-navy-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Female
          </button>
        </div>
      </div>

      {/* 2. Accordions */}
      <div className="flex flex-col gap-2">
        {/* Organs Accordion */}
        <div className="border border-teal-500/20 rounded-xl overflow-hidden bg-navy-900/50">
          <button
            onClick={() => toggleSection('organs')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-teal-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Organs ({organs.length})
            </span>
            {openSection === 'organs' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'organs' && (
            <div className="px-3 pb-3 max-h-52 overflow-y-auto space-y-1 scrollbar-thin">
              {organs.map((organ) => {
                const isSelected = selectedOrgan?.organId === organ.organId;
                return (
                  <button
                    key={organ.organId}
                    onClick={() => onSelectOrgan(organ)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' 
                        : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
                    }`}
                  >
                    <span>{organ.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{organ.layer}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Systems Accordion */}
        <div className="border border-teal-500/20 rounded-xl overflow-hidden bg-navy-900/50">
          <button
            onClick={() => toggleSection('systems')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-teal-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-400" />
              Anatomical Systems
            </span>
            {openSection === 'systems' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'systems' && (
            <div className="px-3 pb-3 space-y-1">
              {systems.map((sys) => {
                const isActive = activeSystem === sys.key;
                return (
                  <button
                    key={sys.key}
                    onClick={() => setActiveSystem(sys.key)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' 
                        : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
                    }`}
                  >
                    <span>{sys.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Layers Accordion */}
        <div className="border border-teal-500/20 rounded-xl overflow-hidden bg-navy-900/50">
          <button
            onClick={() => toggleSection('layers')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-teal-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Visual Layers
            </span>
            {openSection === 'layers' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'layers' && (
            <div className="px-3 pb-3 space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer py-1 text-slate-300 hover:text-white">
                <span>Body Translucent Shell</span>
                <input
                  type="checkbox"
                  checked={layers.bodyShell}
                  onChange={(e) => setLayers({ ...layers, bodyShell: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1 text-slate-300 hover:text-white">
                <span>Skeletal Silhouette</span>
                <input
                  type="checkbox"
                  checked={layers.skeletal}
                  onChange={(e) => setLayers({ ...layers, skeletal: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Reset Camera Button */}
      <button
        onClick={onResetCamera}
        className="mt-1 w-full py-2 px-3 rounded-xl bg-navy-800/80 hover:bg-navy-700/80 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset 3D View
      </button>
    </div>
  );
};
