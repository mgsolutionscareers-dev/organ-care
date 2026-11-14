import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { HumanBodyModel } from './HumanBodyModel';
import { OrganMesh } from './OrganMesh';
import { GLBOrganModel } from './GLBOrganModel';

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
  defaultCamPos = [0, 0.35, 2.7], 
  isResetting, 
  onResetComplete 
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    let targetCamPos = defaultCamPos;
    let targetLookAt = [0, 0.15, 0];

    if (isIsolated) {
      targetCamPos = [0, 0, 1.8];
      targetLookAt = [0, 0, 0];
    } else if (selectedOrgan && selectedOrgan.cameraFocus) {
      targetCamPos = selectedOrgan.cameraFocus.position;
      targetLookAt = selectedOrgan.cameraFocus.target;
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
      minDistance={0.6}
      maxDistance={4.5}
      maxPolarAngle={Math.PI / 1.6}
      minPolarAngle={Math.PI / 6}
      autoRotate={isIsolated}
      autoRotateSpeed={1.2}
    />
  );
};

const IsolatedLoadingIndicator = () => (
  <Html center>
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-navy-950/90 backdrop-blur-md text-white border border-teal-500/30 shadow-2xl">
      <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-teal-300">Loading High-Resolution 3D Model...</span>
    </div>
  </Html>
);

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
  // Filter organs by selected system
  const filteredOrgans = organs.filter(o => {
    if (activeSystem === 'all') return true;
    return o.system.toLowerCase().includes(activeSystem.toLowerCase());
  });

  const isolatedGlb = selectedOrgan && GLB_MODELS[selectedOrgan.organId];

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
              onClick={onExitIsolation}
              className="ml-3 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              ← Back to Full Body
            </button>
          </div>
        </div>
      )}

      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0.35, 2.7]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} castShadow />
        <directionalLight position={[-3, -2, -3]} intensity={0.7} color="#0D9488" />
        <pointLight position={[0, 2, 2]} intensity={0.9} color="#38BDF8" distance={6} />
        <pointLight position={[0, -1, 1.5]} intensity={0.5} color="#14B8A6" distance={4} />

        {isIsolated && selectedOrgan ? (
          /* ----------------- ISOLATED ORGAN 360 INSPECTION MODE ----------------- */
          <Suspense fallback={<IsolatedLoadingIndicator />}>
            <group position={[0, 0, 0]}>
              {isolatedGlb ? (
                <GLBOrganModel
                  modelPath={isolatedGlb}
                  organId={selectedOrgan.organId}
                  isSelected={true}
                  showLandmarks={true}
                  scaleMultiplier={1.3}
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
          </Suspense>
        ) : (
          /* ----------------- FULL HUMAN BODY EXPLORER (INSTANT RENDER) ----------------- */
          <group position={[0, 0, 0]}>
            <HumanBodyModel 
              gender={gender} 
              visible={true}
              showSkin={layers.bodyShell}
              showSkeletal={layers.skeletal}
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
