import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HumanBodyModel } from './HumanBodyModel';
import { OrganMesh } from './OrganMesh';

// Camera controller that smoothly lerps to focused organ or resets to default
const CameraRig = ({ selectedOrgan, defaultCamPos = [0, 0.4, 2.8], isResetting, onResetComplete }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    let targetCamPos = defaultCamPos;
    let targetLookAt = [0, 0.2, 0];

    if (selectedOrgan && selectedOrgan.cameraFocus) {
      targetCamPos = selectedOrgan.cameraFocus.position;
      targetLookAt = selectedOrgan.cameraFocus.target;
    }

    const tVec = new THREE.Vector3(...targetCamPos);
    camera.position.lerp(tVec, 0.05);

    if (controlsRef.current) {
      const lVec = new THREE.Vector3(...targetLookAt);
      controlsRef.current.target.lerp(lVec, 0.05);
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
      minDistance={0.8}
      maxDistance={4.5}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 6}
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
  layers = { bodyShell: true, skeletal: true, glow: true },
  activeSystem = 'all',
  isResetting = false,
  onResetComplete
}) => {
  // Filter organs by selected system if specified
  const filteredOrgans = organs.filter(o => {
    if (activeSystem === 'all') return true;
    return o.system.toLowerCase().includes(activeSystem.toLowerCase());
  });

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0.4, 2.8]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
        <directionalLight position={[-3, -2, -3]} intensity={0.5} color="#0D9488" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#38BDF8" distance={6} />
        <pointLight position={[0, -1, 1.5]} intensity={0.4} color="#14B8A6" distance={4} />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {/* Human body silhouette and glowing target platform */}
            <HumanBodyModel 
              gender={gender} 
              visible={layers.bodyShell}
              showSkeletal={layers.skeletal}
            />

            {/* Individual Interactive Organs */}
            {filteredOrgans.map(organ => (
              <OrganMesh
                key={organ.organId}
                organ={organ}
                isSelected={selectedOrgan?.organId === organ.organId}
                isHovered={hoveredOrgan?.organId === organ.organId}
                onSelect={onSelectOrgan}
                onHover={onHoverOrgan}
                visible={true}
              />
            ))}
          </group>

          <CameraRig 
            selectedOrgan={selectedOrgan} 
            isResetting={isResetting}
            onResetComplete={onResetComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
