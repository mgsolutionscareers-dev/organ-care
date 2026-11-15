import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HumanBodyModel } from './HumanBodyModel';
import { OrganMesh } from './OrganMesh';
import { GLBOrganModel } from './GLBOrganModel';
import { Sparkles, Info, X } from 'lucide-react';

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

// Smooth Camera Controller
const CameraRig = ({ 
  selectedOrgan, 
  isIsolated, 
  defaultCamPos = [0, 0.0, 3.4], 
  isResetting, 
  onResetComplete 
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    let targetCamPos = defaultCamPos;
    let targetLookAt = [0, -0.05, 0];

    if (isIsolated) {
      targetCamPos = [0, 0, 2.5];
      targetLookAt = [0, 0, 0];
    }

    const tVec = new THREE.Vector3(...targetCamPos);
    camera.position.lerp(tVec, 0.06);

    if (controlsRef.current) {
      const lVec = new THREE.Vector3(...targetLookAt);
      controlsRef.current.target.lerp(lVec, 0.06);
      controlsRef.current.update();
    }

    if (isResetting && camera.position.distanceTo(tVec) < 0.05) {
      if (onResetComplete) onResetComplete();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.0}
      maxDistance={5.0}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 6}
      autoRotate={isIsolated}
      autoRotateSpeed={1.2}
    />
  );
};

export const AnatomyCanvas = ({
  organs = [],
  selectedOrgan,
  hoveredOrgan,
  onSelectOrgan,
  onHoverOrgan,
  gender = 'male',
  layers = { bodyShell: true, skeletal: true, internalOrgans: true, skinOpacity: 0.35 },
  activeSystem = 'all',
  isIsolated = false,
  onExitIsolation,
  isResetting = false,
  onResetComplete
}) => {
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [hoveredLandmark, setHoveredLandmark] = useState(null);

  // Filter organs by selected system
  const filteredOrgans = organs.filter(o => {
    if (activeSystem === 'all') return true;
    return o.system.toLowerCase().includes(activeSystem.toLowerCase());
  });

  const isolatedGlb = selectedOrgan && GLB_MODELS[selectedOrgan.organId];
  const displayedLandmark = activeLandmark || hoveredLandmark;

  return (
    <div className="w-full h-full relative select-none">
      
      {/* Isolated Mode Top Header & Back Button */}
      {isIsolated && selectedOrgan && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30">
          <div className="px-5 py-2.5 rounded-2xl bg-navy-950/90 backdrop-blur-md border border-teal-500/40 shadow-2xl text-white flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-teal-400 tracking-wider block">
                Isolated 3D Medical Inspection
              </span>
              <h3 className="text-sm font-extrabold text-white leading-none">
                {selectedOrgan.name} ({selectedOrgan.latinName || selectedOrgan.system})
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveLandmark(null);
                setHoveredLandmark(null);
                if (onExitIsolation) onExitIsolation();
              }}
              className="ml-3 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              ← Back to Full Body
            </button>
          </div>
        </div>
      )}

      {/* Floating 2D Landmark HUD Card in Isolated Mode (Crisp & Never Overlapping) */}
      {isIsolated && displayedLandmark && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-sm w-full mx-auto px-4 pointer-events-auto">
          <div className="p-3.5 rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-teal-500/40 shadow-2xl text-left animate-in fade-in slide-in-from-bottom-2 text-white flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-teal-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Anatomical Landmark</span>
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                {displayedLandmark.name}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                {displayedLandmark.desc}
              </p>
            </div>
            <button
              onClick={() => { setActiveLandmark(null); setHoveredLandmark(null); }}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0.0, 3.4]} fov={42} />
        
        {/* Medical Studio Illumination */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[2, 4, 3]} intensity={1.4} castShadow />
        <directionalLight position={[-3, 1, -2]} intensity={0.7} color="#0D9488" />
        <pointLight position={[0, 1.5, 2]} intensity={0.7} color="#38BDF8" distance={6} />
        <pointLight position={[0, -0.8, 0.5]} intensity={0.6} color="#14B8A6" distance={3} />

        {isIsolated && selectedOrgan ? (
          /* ----------------- ISOLATED ORGAN 360 INSPECTION MODE ----------------- */
          <group position={[0, 0, 0]}>
            {isolatedGlb ? (
              <GLBOrganModel
                modelPath={isolatedGlb}
                organId={selectedOrgan.organId}
                isSelected={true}
                showLandmarks={true}
                activeLandmark={activeLandmark?.id}
                onSelectLandmark={setActiveLandmark}
                onHoverLandmark={setHoveredLandmark}
                scaleMultiplier={1.0}
              />
            ) : (
              <group scale={1.8}>
                <OrganMesh
                  organ={selectedOrgan}
                  isSelected={true}
                  isHovered={false}
                  onSelect={null}
                  onHover={null}
                />
              </group>
            )}
          </group>
        ) : (
          /* ----------------- FULL HUMAN BODY EXPLORER (NON-BLOCKING INSTANT RENDER) ----------------- */
          <group position={[0, 0, 0]}>
            <HumanBodyModel 
              gender={gender} 
              visible={true}
              showSkin={layers.bodyShell}
              showSkeletal={layers.skeletal}
              showMuscular={layers.muscular !== false}
              showInternalOrgans={layers.internalOrgans !== false}
              skinOpacity={layers.skinOpacity}
            />

            {/* Individual Interactive Organs positioned in body */}
            {layers.internalOrgans && filteredOrgans.map(organ => (
              <OrganMesh
                key={organ.organId}
                organ={organ}
                isSelected={selectedOrgan?.organId === organ.organId}
                isHovered={hoveredOrgan?.organId === organ.organId}
                onSelect={onSelectOrgan}
                onHover={onHoverOrgan}
              />
            ))}
          </group>
        )}

        <CameraRig
          selectedOrgan={selectedOrgan}
          isIsolated={isIsolated}
          isResetting={isResetting}
          onResetComplete={onResetComplete}
        />
      </Canvas>
    </div>
  );
};
