import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnatomyCanvas } from '../anatomy/AnatomyCanvas';
import { AnatomyControls } from '../anatomy/AnatomyControls';
import { OrganCardPreview } from '../anatomy/OrganCardPreview';
import { organsData } from '../../../backend/src/data/organsData.js';
import { useAuth } from '../context/AuthContext';
import { recordHistoryEvent } from '../services/historyService';
import { RotateCcw, ZoomIn, ZoomOut, Sparkles, AlertCircle } from 'lucide-react';

export const AnatomyPage = () => {
  const [searchParams] = useSearchParams();
  const organParam = searchParams.get('organ');
  
  const [organs, setOrgans] = useState(organsData);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [gender, setGender] = useState('male');
  const [activeSystem, setActiveSystem] = useState('all');
  const [layers, setLayers] = useState({ bodyShell: true, skeletal: true, glow: true });
  const [isResetting, setIsResetting] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);

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
    setSelectedOrgan(null);
    setIsResetting(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-gradient-to-b from-navy-950 via-[#07242C] to-navy-950 overflow-hidden flex flex-col">
      
      {/* Top Floating Helper Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-navy-900/80 backdrop-blur-md border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Click any internal organ or use the left controls to inspect anatomy
        </div>
      </div>

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
                  className="px-4 py-2 rounded-xl bg-navy-800 border border-teal-500/20 text-xs font-bold text-teal-300 hover:bg-teal-500 hover:text-navy-950 transition-all"
                >
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Left Overlay: Anatomy Controls Panel */}
        <div className="absolute top-6 left-6 z-20 hidden md:block">
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
            onResetCamera={handleResetCamera}
          />
        </div>

        {/* Right Overlay: Selected Organ Preview Card */}
        {selectedOrgan && (
          <div className="absolute top-6 right-6 z-20 hidden md:block">
            <OrganCardPreview
              organ={selectedOrgan}
              onClose={() => setSelectedOrgan(null)}
            />
          </div>
        )}

        {/* Mobile Drawer Bottom Sheet for Selected Organ */}
        {selectedOrgan && (
          <div className="md:hidden absolute bottom-4 left-4 right-4 z-20">
            <OrganCardPreview
              organ={selectedOrgan}
              onClose={() => setSelectedOrgan(null)}
            />
          </div>
        )}

        {/* Floating Quick Camera Controls (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 bg-navy-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-teal-500/30 text-white">
          <button
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="w-9 h-9 rounded-xl hover:bg-navy-800 flex items-center justify-center text-teal-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
