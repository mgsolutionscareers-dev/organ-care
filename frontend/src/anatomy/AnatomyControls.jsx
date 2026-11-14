import React, { useState } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  User, 
  Compass, 
  Activity,
  Maximize2
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
  isIsolated,
  setIsIsolated,
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
    <div className="w-68 sm:w-72 max-w-[280px] bg-navy-950/90 backdrop-blur-xl border border-teal-500/25 rounded-3xl p-4 text-white shadow-2xl flex flex-col gap-3.5 select-none">
      
      {/* 1. Body View Gender Toggle (Matches Design Reference) */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-teal-400 font-extrabold mb-1.5 block">
          Select Body View
        </label>
        <div className="grid grid-cols-2 p-1 bg-navy-900/90 rounded-2xl border border-teal-500/20">
          <button
            onClick={() => setGender('male')}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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

      {/* 2. Isolated Organ Toggle (If an organ is selected) */}
      {selectedOrgan && (
        <button
          onClick={() => setIsIsolated(!isIsolated)}
          className={`w-full py-2.5 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            isIsolated
              ? 'bg-amber-500 text-navy-950 border-amber-400 shadow-md'
              : 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border-teal-500/40'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          {isIsolated ? 'Exit Isolated View' : `Isolate ${selectedOrgan.name} (360°)`}
        </button>
      )}

      {/* 3. Collapsible Sections */}
      <div className="flex flex-col gap-2">
        
        {/* Organs Accordion */}
        <div className="border border-teal-500/20 rounded-2xl overflow-hidden bg-navy-900/50">
          <button
            onClick={() => toggleSection('organs')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:text-teal-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Organs ({organs.length})
            </span>
            {openSection === 'organs' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'organs' && (
            <div className="px-3 pb-3 max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
              {organs.map((organ) => {
                const isSelected = selectedOrgan?.organId === organ.organId;
                return (
                  <button
                    key={organ.organId}
                    onClick={() => onSelectOrgan(organ)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold' 
                        : 'text-slate-300 hover:bg-navy-800/80 hover:text-white font-medium'
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
        <div className="border border-teal-500/20 rounded-2xl overflow-hidden bg-navy-900/50">
          <button
            onClick={() => toggleSection('systems')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:text-teal-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-400" />
              Systems
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold' 
                        : 'text-slate-300 hover:bg-navy-800/80 hover:text-white font-medium'
                    }`}
                  >
                    <span>{sys.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Visual Layers Accordion */}
        <div className="border border-teal-500/20 rounded-2xl overflow-hidden bg-navy-900/50">
          <button
            onClick={() => toggleSection('layers')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:text-teal-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Layers
            </span>
            {openSection === 'layers' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'layers' && (
            <div className="px-3 pb-3 space-y-2.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer py-1 text-slate-300 hover:text-white">
                <span>Skin Transparency</span>
                <input
                  type="checkbox"
                  checked={layers.bodyShell}
                  onChange={(e) => setLayers({ ...layers, bodyShell: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500 w-4 h-4 accent-teal-500"
                />
              </label>

              {layers.bodyShell && (
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Opacity</span>
                    <span>{Math.round(layers.skinOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={layers.skinOpacity}
                    onChange={(e) => setLayers({ ...layers, skinOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                </div>
              )}

              <label className="flex items-center justify-between cursor-pointer py-1 text-slate-300 hover:text-white border-t border-slate-800 pt-2">
                <span>Skeletal System</span>
                <input
                  type="checkbox"
                  checked={layers.skeletal}
                  onChange={(e) => setLayers({ ...layers, skeletal: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500 w-4 h-4 accent-teal-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 text-slate-300 hover:text-white">
                <span>Internal Organs</span>
                <input
                  type="checkbox"
                  checked={layers.internalOrgans}
                  onChange={(e) => setLayers({ ...layers, internalOrgans: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-500 w-4 h-4 accent-teal-500"
                />
              </label>
            </div>
          )}
        </div>

      </div>

      {/* Reset Camera Button */}
      <button
        onClick={onResetCamera}
        className="w-full py-2.5 px-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset 3D View
      </button>

    </div>
  );
};
