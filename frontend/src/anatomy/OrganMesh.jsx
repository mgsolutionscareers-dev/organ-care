import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { 
  RealisticHeart, 
  RealisticBrain, 
  RealisticLungs, 
  RealisticLiver, 
  RealisticStomach, 
  RealisticKidneys, 
  RealisticIntestines,
  RealisticBladder,
  RealisticPancreas,
  RealisticSpleen
} from './RealisticOrganMeshes';

useGLTF.setDecoderPath('/draco/');

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

// Preset in-body anatomical scaling factors
const IN_BODY_SCALES = {
  heart: 0.16,
  lungs: 0.22,
  liver: 0.20,
  kidneys: 0.18,
  stomach: 0.18,
  brain: 0.19,
  bones: 0.8
};

// Subcomponent that loads and renders the GLB inside the body at its anatomical position
const InBodyGLB = ({ modelPath, organId, isSelected, isHovered }) => {
  const gltf = useGLTF(modelPath, '/draco/');
  
  const cloned = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const scene = gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          if (isSelected) {
            child.material.emissive = new THREE.Color('#14B8A6');
            child.material.emissiveIntensity = 0.4;
          } else if (isHovered) {
            child.material.emissive = new THREE.Color('#38BDF8');
            child.material.emissiveIntensity = 0.25;
          }
        }
      }
    });
    return scene;
  }, [gltf, isSelected, isHovered]);

  const scale = IN_BODY_SCALES[organId] || 0.18;

  if (!cloned) return null;

  return (
    <group scale={[scale, scale, scale]}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
};

export const OrganMesh = ({ 
  organ, 
  isSelected, 
  isHovered, 
  onSelect, 
  onHover, 
  visible = true 
}) => {
  const meshRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  // Subtle physiological pulse animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isSelected) {
      const pulse = 1.08 + Math.sin(t * 4.0) * 0.03;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (localHover || isHovered) {
      meshRef.current.scale.set(1.06, 1.06, 1.06);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  if (!visible) return null;

  const hasGLB = !!GLB_MODELS[organ.organId];
  const glbPath = GLB_MODELS[organ.organId];

  return (
    <group
      ref={meshRef}
      position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(organ);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHover(true);
        if (onHover) onHover(organ);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setLocalHover(false);
        if (onHover) onHover(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* If GLB model is available, render real GLB, else render high-res realistic organ mesh */}
      {hasGLB ? (
        <InBodyGLB 
          modelPath={glbPath} 
          organId={organ.organId} 
          isSelected={isSelected} 
          isHovered={localHover || isHovered} 
        />
      ) : (
        <>
          {organ.organId === 'pancreas' && <RealisticPancreas isSelected={isSelected} isHovered={localHover || isHovered} />}
          {organ.organId === 'intestines' && <RealisticIntestines isSelected={isSelected} isHovered={localHover || isHovered} />}
          {organ.organId === 'bladder' && <RealisticBladder isSelected={isSelected} isHovered={localHover || isHovered} />}
          {organ.organId === 'spleen' && <RealisticSpleen isSelected={isSelected} isHovered={localHover || isHovered} />}
        </>
      )}

      {/* Floating Organ Label in 3D when hovered or selected */}
      {(isSelected || localHover || isHovered) && (
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color={isSelected ? '#14B8A6' : '#38BDF8'} />
        </mesh>
      )}
    </group>
  );
};
