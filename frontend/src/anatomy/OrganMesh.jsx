import React, { useRef, useMemo, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import {
  RealisticHeart,
  RealisticBrain,
  RealisticLungs,
  RealisticLiver,
  RealisticKidneys,
  RealisticStomach,
  RealisticPancreas,
  RealisticSpleen,
  RealisticBladder,
  RealisticIntestines,
} from './RealisticOrganMeshes';

// Configure DRACO loader path
useGLTF.setDecoderPath('/draco/');

// Dedicated GLB model definitions, normalized with Center at exact anatomical body positions
const GLB_ORGAN_CONFIGS = {
  heart: {
    path: '/models/heart.glb',
    scale: 0.055,
    pos: [-0.03, 0.38, 0.05],
    rot: [0.1, 0.15, -0.1],
    hitRadius: 0.09,
    glowColor: '#EF4444',
  },
  brain: {
    path: '/models/brain.glb',
    scale: 0.24,
    pos: [0, 0.74, 0.0],
    rot: [0, 0, 0],
    hitRadius: 0.11,
    glowColor: '#F59E0B',
  },
  lungs: {
    path: '/models/lungs.glb',
    scale: 0.012,
    pos: [0, 0.38, 0.01],
    rot: [0, 0, 0],
    hitRadius: 0.14,
    glowColor: '#38BDF8',
  },
  liver: {
    path: '/models/liver.glb',
    scale: 0.075,
    pos: [0.07, 0.24, 0.04],
    rot: [0, 0, 0],
    hitRadius: 0.11,
    glowColor: '#B45309',
  },
  kidneys: {
    path: '/models/kidneys.glb',
    scale: 0.055,
    pos: [0, 0.18, -0.02],
    rot: [0, 0, 0],
    hitRadius: 0.08,
    glowColor: '#9333EA',
  },
  stomach: {
    path: '/models/stomach.glb',
    scale: 0.0035,
    pos: [-0.06, 0.20, 0.05],
    rot: [0, 0, 0],
    hitRadius: 0.10,
    glowColor: '#EC4899',
  },
};

// Procedural organ definitions
const PROCEDURAL_CONFIGS = {
  pancreas: { pos: [0.01, 0.18, 0.03], scale: 0.34, hitRadius: 0.07 },
  spleen: { pos: [-0.11, 0.25, 0.03], scale: 0.30, hitRadius: 0.06 },
  'small-intestine': { pos: [0.0, 0.05, 0.05], scale: 0.38, hitRadius: 0.11, isLarge: false },
  'large-intestine': { pos: [0.0, 0.08, 0.04], scale: 0.40, hitRadius: 0.12, isLarge: true },
  intestines: { pos: [0.0, 0.06, 0.05], scale: 0.38, hitRadius: 0.12, isLarge: false },
  bladder: { pos: [0.0, -0.10, 0.05], scale: 0.30, hitRadius: 0.07 },
};

// Instant Fallback Procedural Renderer for any organ while GLB streams in
const ProceduralOrganFallback = ({ organId, isSelected, isHovered }) => {
  const cfg = GLB_ORGAN_CONFIGS[organId];
  if (!cfg) return null;

  let Component = null;
  let scale = 0.85;

  if (organId === 'heart') { Component = RealisticHeart; scale = 1.0; }
  else if (organId === 'brain') { Component = RealisticBrain; scale = 0.95; }
  else if (organId === 'lungs') { Component = RealisticLungs; scale = 1.0; }
  else if (organId === 'liver') { Component = RealisticLiver; scale = 1.0; }
  else if (organId === 'kidneys') { Component = RealisticKidneys; scale = 0.95; }
  else if (organId === 'stomach') { Component = RealisticStomach; scale = 1.0; }

  if (!Component) return null;

  return (
    <group position={cfg.pos} scale={[scale, scale, scale]} renderOrder={1}>
      <Component isSelected={isSelected} isHovered={isHovered} />
    </group>
  );
};

// Individual GLB Mesh with Center normalization, biological animation & radiant glow
const GLBOrganRenderer = ({ config, organId, isSelected, isHovered }) => {
  const meshGroupRef = useRef();
  const { scene } = useGLTF(config.path, '/draco/');

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true);
    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.renderOrder = 1;
        if (node.material) {
          node.material = node.material.clone();
          node.material.roughness = Math.min(0.38, node.material.roughness || 0.3);
          node.material.metalness = Math.max(0.08, node.material.metalness || 0.1);
          // Radiant anatomical glow so organs shine through translucent ribcage & body shell
          if (config.glowColor) {
            node.material.emissive = new THREE.Color(config.glowColor);
            node.material.emissiveIntensity = 0.28;
          }
        }
      }
    });
    return cloned;
  }, [scene, config.glowColor]);

  // Physiological pulse animation (cardiac beat & pulmonary respiration)
  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    let pulse = 1.0;
    if (organId === 'heart') {
      pulse = 1.0 + Math.sin(t * 4.2) * 0.035 + Math.sin(t * 8.4) * 0.015;
    } else if (organId === 'lungs') {
      pulse = 1.0 + Math.sin(t * 1.8) * 0.025;
    }

    const hoverBoost = isHovered ? 1.08 : (isSelected ? 1.04 : 1.0);
    const s = config.scale * hoverBoost * pulse;
    meshGroupRef.current.scale.set(s, s, s);
  });

  if (!clonedScene) return null;

  return (
    <group
      ref={meshGroupRef}
      position={config.pos}
      rotation={config.rot}
      scale={config.scale}
      renderOrder={1}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>

      {/* Glowing aura when selected or hovered */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.075 / config.scale, 16, 16]} />
          <meshBasicMaterial
            color={isSelected ? '#14B8A6' : '#38BDF8'}
            transparent
            opacity={isSelected ? 0.35 : 0.18}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Selected Indicator Halo Ring */}
      {isSelected && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08 / config.scale, 0.095 / config.scale, 32]} />
          <meshBasicMaterial
            color="#2DD4BF"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
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
  const [localHover, setLocalHover] = useState(false);

  if (!visible || !organ) return null;

  const organId = organ.organId;

  // Bones are handled by the full body skeleton model
  if (organId === 'bones') return null;

  const glbConfig = GLB_ORGAN_CONFIGS[organId];
  const procConfig = PROCEDURAL_CONFIGS[organId];

  const pos = glbConfig ? glbConfig.pos : (procConfig ? procConfig.pos : [organ.coords3D?.x || 0, organ.coords3D?.y || 0, organ.coords3D?.z || 0]);
  const hitRadius = glbConfig?.hitRadius || procConfig?.hitRadius || 0.08;
  const isHighlighted = isSelected || isHovered || localHover;

  const renderProceduralOnly = () => {
    if (!procConfig) return null;
    const s = procConfig.scale * (isHighlighted ? 1.08 : 1.0);

    let Component = null;
    if (organId === 'pancreas') Component = RealisticPancreas;
    else if (organId === 'spleen') Component = RealisticSpleen;
    else if (organId === 'bladder') Component = RealisticBladder;
    else if (organId.includes('intestine')) Component = RealisticIntestines;

    if (!Component) return null;

    return (
      <group position={procConfig.pos} scale={[s, s, s]} renderOrder={1}>
        <Component
          isSelected={isSelected}
          isHovered={isHovered || localHover}
          isLarge={procConfig.isLarge}
        />
      </group>
    );
  };

  return (
    <group renderOrder={1}>
      {/* Interactive Raycasting Hitbox */}
      <mesh
        position={pos}
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
        <sphereGeometry args={[hitRadius, 16, 16]} />
        <meshBasicMaterial
          transparent
          opacity={isHighlighted && !isSelected ? 0.15 : 0.0}
          color="#38BDF8"
          depthWrite={false}
        />
      </mesh>

      {/* Render Real Medical GLB Model with Instant Realistic Procedural Fallback */}
      {glbConfig && (
        <Suspense fallback={
          <ProceduralOrganFallback 
            organId={organId} 
            isSelected={isSelected} 
            isHovered={isHovered || localHover} 
          />
        }>
          <GLBOrganRenderer
            config={glbConfig}
            organId={organId}
            isSelected={isSelected}
            isHovered={isHovered || localHover}
          />
        </Suspense>
      )}

      {/* Render Procedural Organs (Pancreas, Spleen, Bladder, Intestines) */}
      {procConfig && renderProceduralOnly()}
    </group>
  );
};
