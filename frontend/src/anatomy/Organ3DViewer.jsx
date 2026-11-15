import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { RotateCcw, Play, Pause, Tags, Sparkles, X } from 'lucide-react';
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

// Instant procedural fallback component
const ProceduralViewerFallback = ({ organId }) => {
  let Component = null;
  if (organId === 'heart') Component = RealisticHeart;
  else if (organId === 'brain') Component = RealisticBrain;
  else if (organId === 'lungs') Component = RealisticLungs;
  else if (organId === 'liver') Component = RealisticLiver;
  else if (organId === 'kidneys') Component = RealisticKidneys;
  else if (organId === 'stomach') Component = RealisticStomach;
  else if (organId === 'pancreas') Component = RealisticPancreas;
  else if (organId === 'spleen') Component = RealisticSpleen;
  else if (organId === 'bladder') Component = RealisticBladder;
  else if (organId?.includes('intestine')) Component = RealisticIntestines;

  if (!Component) return null;

  return (
    <group scale={1.8}>
      <Component isSelected={false} isHovered={false} />
    </group>
  );
};

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
    const next = lm?.id === selectedLandmark?.id ? null : lm;
    setSelectedLandmark(next);
    if (onLandmarkSelect) onLandmarkSelect(next);
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none bg-gradient-to-b from-slate-900/40 via-navy-950/20 to-transparent rounded-3xl overflow-hidden">
      
      {/* 3D Floating Control Buttons Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
            autoRotate 
              ? 'bg-[#14B8A6] text-white border-teal-400 shadow-md' 
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
          }`}
          title={autoRotate ? "Pause 360° Rotation" : "Auto 360° Rotate"}
        >
          {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowLandmarks(!showLandmarks)}
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
            showLandmarks 
              ? 'bg-[#123E48] text-white border-teal-500/50 shadow-md' 
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
          }`}
          title={showLandmarks ? "Hide Anatomical Landmark Pins" : "Show Anatomical Landmark Pins"}
        >
          <Tags className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 backdrop-blur-md transition-all cursor-pointer"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Landmark Details Floating Card */}
      {selectedLandmark && (
        <div className="absolute top-4 left-4 z-20 max-w-xs p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-teal-200 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{selectedLandmark.name}</span>
            </div>
            <button
              onClick={() => setSelectedLandmark(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            {selectedLandmark.desc}
          </p>
        </div>
      )}

      {/* Anatomical Landmark Quick Selector Pill Bar (Clean & Compact) */}
      {showLandmarks && landmarks.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-teal-900 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-teal-200 shrink-0">
            Landmarks:
          </span>
          {landmarks.map((lm) => (
            <button
              key={lm.id}
              onClick={() => handleLandmarkClick(lm)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                selectedLandmark?.id === lm.id
                  ? 'bg-[#14B8A6] text-white shadow-teal-500/25 scale-105'
                  : 'bg-white/85 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {lm.name}
            </button>
          ))}
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

        <Suspense fallback={<ProceduralViewerFallback organId={organId} />}>
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
            <ProceduralViewerFallback organId={organId} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
