import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnatomyCanvas } from '../anatomy/AnatomyCanvas';
import { AnatomyControls } from '../anatomy/AnatomyControls';
import { OrganCardPreview } from '../anatomy/OrganCardPreview';
import { organsData } from '../data/organsData.js';
import { useAuth } from '../context/AuthContext';
import { recordHistoryEvent } from '../services/historyService';
import { RotateCcw, Sparkles, AlertCircle, Sliders, X, Layers, Compass } from 'lucide-react';

export const AnatomyPage = () => {
  const [searchParams] = useSearchParams();
  const organParam = searchParams.get('organ');
  
  const [organs, setOrgans] = useState(organsData);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [gender, setGender] = useState('male');
  const [activeSystem, setActiveSystem] = useState('all');
  const [layers, setLayers] = useState({ 
    bodyShell: true, 
    skeletal: true, 
    muscular: true,
    internalOrgans: true, 
    skinOpacity: 0.35 
  });
  const [isIsolated, setIsIsolated] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  const { currentUser } = useAuth();

  // Test WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGlAvailable(!!gl);
    } catch (e) {
      setWebGlAvailable(false);
    }
  }, []);

  // Sync organ from query parameter or default to heart
  useEffect(() => {
    if (organParam) {
      const found = organs.find(o => o.organId.toLowerCase() === organParam.toLowerCase());
      if (found) {
        setSelectedOrgan(found);
      }
    } else if (!selectedOrgan) {
      const heart = organs.find(o => o.organId === 'heart');
      if (heart) setSelectedOrgan(heart);
    }
  }, [organParam, organs]);

  const handleSelectOrgan = async (organ) => {
    setSelectedOrgan(organ);

    // Record into history for authenticated users
    if (currentUser && organ) {
      await recordHistoryEvent(currentUser.uid, {
        title: `3D Explored: ${organ.name}`,
        organId: organ.organId,
        type: '3d_select',
        path: `/organ/${organ.organId}`,
        details: `Selected ${organ.name} in 3D Anatomy Canvas`
      });
    }
  };

  const handleResetCamera = () => {
    setIsIsolated(false);
    setIsResetting(true);
  };

  const handleIsolateOrgan = (organ) => {
    setSelectedOrgan(organ);
    setIsIsolated(true);
  };

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] sm:h-[calc(100vh-5rem)] bg-gradient-to-b from-navy-950 via-[#07242C] to-navy-950 overflow-hidden flex flex-col select-none">
      
      {/* ----------------- MOBILE QUICK ORGAN SELECTOR BAR (lg:hidden) ----------------- */}
      {!isIsolated && (
        <div className="lg:hidden absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {organs.map((org) => {
            const isSelected = selectedOrgan?.organId === org.organId;
            return (
              <button
                key={org.organId}
                onClick={() => handleSelectOrgan(org)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-md shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#14B8A6] text-navy-950 shadow-teal-500/25 scale-105'
                    : 'bg-navy-900/90 backdrop-blur-md text-slate-300 border border-teal-500/20 hover:text-white'
                }`}
              >
                {org.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Top Floating Helper Banner (Only on desktop when not in isolated mode) */}
      {!isIsolated && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden lg:block">
          <div className="px-4 py-1.5 rounded-full bg-navy-900/80 backdrop-blur-md border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Click any organ mesh to focus, or select 'Isolate Organ' for 360° medical inspection
          </div>
        </div>
      )}

      {/* Main 3D Canvas Area */}
      <div className="relative w-full h-full">
        {webGlAvailable ? (
          <AnatomyCanvas
            organs={organs}
            selectedOrgan={selectedOrgan}
            hoveredOrgan={hoveredOrgan}
            onSelectOrgan={handleSelectOrgan}
            onHoverOrgan={setHoveredOrgan}
            gender={gender}
            layers={layers}
            activeSystem={activeSystem}
            isIsolated={isIsolated}
            onExitIsolation={() => setIsIsolated(false)}
            isResetting={isResetting}
            onResetComplete={() => setIsResetting(false)}
          />
        ) : (
          /* WebGL Fallback container */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white">
            <AlertCircle className="w-12 h-12 text-teal-400 mb-3" />
            <h3 className="text-xl font-bold">3D WebGL Acceleration Unavailable</h3>
            <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">
              Your browser or hardware acceleration is currently disabled. You can still explore high-definition anatomical systems via the organ directory.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {organs.map(o => (
                <button
                  key={o.organId}
                  onClick={() => setSelectedOrgan(o)}
                  className="px-4 py-2 rounded-xl bg-navy-800 border border-teal-500/20 text-xs font-bold text-teal-300 hover:bg-teal-500 hover:text-navy-950 transition-all cursor-pointer"
                >
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Left Overlay: Anatomy Controls Panel */}
        <div className="absolute top-6 left-6 z-20 hidden lg:block">
          <AnatomyControls
            organs={organs}
            selectedOrgan={selectedOrgan}
            onSelectOrgan={handleSelectOrgan}
            gender={gender}
            setGender={setGender}
            activeSystem={activeSystem}
            setActiveSystem={setActiveSystem}
            layers={layers}
            setLayers={setLayers}
            isIsolated={isIsolated}
            setIsIsolated={setIsIsolated}
            onResetCamera={handleResetCamera}
          />
        </div>

        {/* Mobile Trigger Button for Anatomy Controls (lg:hidden) */}
        {!isIsolated && (
          <button
            onClick={() => setMobileControlsOpen(true)}
            className="lg:hidden absolute bottom-16 sm:bottom-6 left-4 z-20 px-3.5 py-2.5 rounded-2xl bg-navy-950/90 text-teal-300 border border-teal-500/40 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-95"
            title="Anatomy Layers & Views"
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Layers & Views</span>
          </button>
        )}

        {/* Mobile Anatomy Controls Slide-Up Bottom Sheet */}
        {mobileControlsOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div 
              className="absolute inset-0" 
              onClick={() => setMobileControlsOpen(false)}
            />
            <div className="relative max-h-[85vh] overflow-y-auto bg-navy-950 border-t border-teal-500/40 rounded-t-3xl p-5 text-white shadow-2xl z-10 space-y-4 animate-in slide-in-from-bottom duration-200">
              
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-2 border-b border-teal-500/20">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-extrabold text-white">Anatomy Controls & Layers</h3>
                </div>
                <button
                  onClick={() => setMobileControlsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Anatomy Controls Component inside Sheet */}
              <AnatomyControls
                organs={organs}
                selectedOrgan={selectedOrgan}
                onSelectOrgan={(org) => {
                  handleSelectOrgan(org);
                  setMobileControlsOpen(false);
                }}
                gender={gender}
                setGender={setGender}
                activeSystem={activeSystem}
                setActiveSystem={setActiveSystem}
                layers={layers}
                setLayers={setLayers}
                isIsolated={isIsolated}
                setIsIsolated={setIsIsolated}
                onResetCamera={() => {
                  handleResetCamera();
                  setMobileControlsOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Right Overlay: Selected Organ Preview Card (Mobile bottom docked or desktop floating) */}
        {selectedOrgan && !isIsolated && (
          <div className="absolute top-6 right-6 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <OrganCardPreview
                organ={selectedOrgan}
                onClose={() => setSelectedOrgan(null)}
                onIsolate={handleIsolateOrgan}
                isIsolated={isIsolated}
              />
            </div>
          </div>
        )}

        {/* Floating Quick Camera Controls (Bottom Right) */}
        <div className="absolute bottom-16 sm:bottom-6 right-4 sm:right-6 z-20 flex flex-col gap-2 bg-navy-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-teal-500/30 text-white shadow-xl">
          <button
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="w-9 h-9 rounded-xl hover:bg-navy-800 flex items-center justify-center text-teal-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
