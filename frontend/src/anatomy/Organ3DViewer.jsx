import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { RotateCcw, Play, Pause, Tags, Sparkles, ZoomIn } from 'lucide-react';
import { GLBOrganModel, ORGAN_LANDMARKS } from './GLBOrganModel';
import { 
  RealisticHeart, 
  RealisticBrain, 
  RealisticLungs, 
  RealisticLiver, 
  RealisticStomach, 
  RealisticKidneys, 
  RealisticIntestines,
  RealisticPancreas,
  RealisticBladder,
  RealisticSpleen
} from './RealisticOrganMeshes';

// Mapping of organs with dedicated high-resolution medical GLB models
const GLB_MODELS = {
  heart: '/models/heart.glb',
  lungs: '/models/lungs.glb',
  liver: '/models/liver.glb',
  kidneys: '/models/kidneys.glb',
  stomach: '/models/stomach.glb',
  brain: '/models/brain.glb',
  bones: '/models/skeleton.glb'
};

const LoadingSpinner3D = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-navy-950/85 backdrop-blur-md text-white border border-teal-500/30">
      <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-teal-300">Loading Medical 3D Mesh...</span>
    </div>
  </Html>
);

export const Organ3DViewer = ({ organ, onLandmarkSelect }) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const controlsRef = useRef();

  if (!organ) return null;

  const organId = organ.organId;
  const hasGLB = !!GLB_MODELS[organId];
  const glbPath = GLB_MODELS[organId];
  const landmarks = ORGAN_LANDMARKS[organId] || [];

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setSelectedLandmark(null);
  };

  const handleLandmarkClick = (lm) => {
    setSelectedLandmark(lm.id === selectedLandmark?.id ? null : lm);
    if (onLandmarkSelect) onLandmarkSelect(lm);
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none bg-gradient-to-b from-slate-900/40 via-navy-950/20 to-transparent rounded-3xl overflow-hidden">
      
      {/* 3D Floating Control Buttons Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
            autoRotate 
              ? 'bg-brand-500/90 text-white border-brand-400 shadow-md' 
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
          }`}
          title={autoRotate ? "Pause 360° Rotation" : "Auto 360° Rotate"}
        >
          {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowLandmarks(!showLandmarks)}
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
            showLandmarks 
              ? 'bg-teal-600/90 text-white border-teal-400 shadow-md' 
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
          }`}
          title={showLandmarks ? "Hide Anatomical Landmark Pins" : "Show Anatomical Landmark Pins"}
        >
          <Tags className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 backdrop-blur-md transition-all"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Anatomical Landmark Quick Selector Pill Bar */}
      {showLandmarks && landmarks.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-teal-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-teal-200 shrink-0">
            Landmarks:
          </span>
          {landmarks.map((lm) => (
            <button
              key={lm.id}
              onClick={() => handleLandmarkClick(lm)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedLandmark?.id === lm.id
                  ? 'bg-brand-500 text-white shadow-brand-500/25 scale-105'
                  : 'bg-white/85 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {lm.name}
            </button>
          ))}
        </div>
      )}

      {/* Selected Landmark Details Card */}
      {selectedLandmark && (
        <div className="absolute top-4 left-4 z-20 max-w-xs p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-200 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 text-brand-700 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedLandmark.name}</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            {selectedLandmark.desc}
          </p>
        </div>
      )}

      {/* Three.js Canvas */}
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 1.8]} fov={45} />
        
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={1.4}
          minDistance={0.6}
          maxDistance={3.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />

        {/* Photorealistic Studio Lights */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1.6} castShadow />
        <directionalLight position={[-3, -2, -3]} intensity={0.8} color="#0D9488" />
        <pointLight position={[0, 1.5, 2]} intensity={1.0} color="#38BDF8" distance={5} />
        <pointLight position={[0, -1.5, 1]} intensity={0.6} color="#14B8A6" distance={4} />

        <Suspense fallback={<LoadingSpinner3D />}>
          {hasGLB ? (
            <GLBOrganModel
              modelPath={glbPath}
              organId={organId}
              showLandmarks={showLandmarks}
              activeLandmark={selectedLandmark?.id}
              onSelectLandmark={handleLandmarkClick}
              scaleMultiplier={1.4}
            />
          ) : (
            <group scale={1.8}>
              {organId === 'pancreas' && <RealisticPancreas isSelected={false} isHovered={false} />}
              {organId === 'intestines' && <RealisticIntestines isSelected={false} isHovered={false} />}
              {organId === 'bladder' && <RealisticBladder isSelected={false} isHovered={false} />}
              {organId === 'spleen' && <RealisticSpleen isSelected={false} isHovered={false} />}
            </group>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
