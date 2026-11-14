import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HumanBodyModel = ({ 
  gender = 'male', 
  visible = true, 
  showSkeletal = true 
}) => {
  const pedestalRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003;
    }
  });

  if (!visible) return null;

  // Custom translucent anatomical body material
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: '#0A333C',
    emissive: '#042F2E',
    emissiveIntensity: 0.25,
    roughness: 0.35,
    metalness: 0.1,
    transmission: 0.75, // Glass-like transparency
    thickness: 0.8,
    transparent: true,
    opacity: 0.38,
    wireframe: false,
    depthWrite: false,
  });

  // Skeletal silhouette material
  const skeletonMaterial = new THREE.MeshStandardMaterial({
    color: '#38BDF8',
    emissive: '#0284C7',
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.35,
    wireframe: true,
    depthWrite: false,
  });

  const isFemale = gender === 'female';
  const shoulderWidth = isFemale ? 0.38 : 0.46;
  const hipWidth = isFemale ? 0.34 : 0.29;
  const chestDepth = isFemale ? 0.26 : 0.22;

  return (
    <group position={[0, 0, 0]}>
      {/* ----------------- ANATOMICAL SILHOUETTE ----------------- */}
      <group position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 1.45, 0.04]} material={bodyMaterial}>
          <sphereGeometry args={[0.18, 32, 24]} />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, 1.18, 0.03]} material={bodyMaterial}>
          <cylinderGeometry args={[0.08, 0.09, 0.18, 20]} />
        </mesh>

        {/* Thorax / Upper Torso */}
        <mesh position={[0, 0.65, 0.03]} material={bodyMaterial}>
          <cylinderGeometry args={[shoulderWidth, hipWidth, 0.75, 24]} />
        </mesh>

        {/* Ribcage Outline (Skeletal Layer) */}
        {showSkeletal && (
          <mesh position={[0, 0.58, 0.05]} material={skeletonMaterial}>
            <sphereGeometry args={[0.32, 16, 12]} />
          </mesh>
        )}

        {/* Abdomen & Pelvis */}
        <mesh position={[0, -0.05, 0.02]} material={bodyMaterial}>
          <cylinderGeometry args={[hipWidth * 0.9, hipWidth, 0.5, 24]} />
        </mesh>

        {/* Left Arm & Forearm */}
        <mesh position={[-shoulderWidth - 0.08, 0.6, 0.02]} rotation={[0, 0, 0.18]} material={bodyMaterial}>
          <capsuleGeometry args={[0.065, 0.55, 12, 16]} />
        </mesh>
        <mesh position={[-shoulderWidth - 0.24, 0.05, 0.02]} rotation={[0, 0, 0.15]} material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.52, 12, 16]} />
        </mesh>

        {/* Right Arm & Forearm */}
        <mesh position={[shoulderWidth + 0.08, 0.6, 0.02]} rotation={[0, 0, -0.18]} material={bodyMaterial}>
          <capsuleGeometry args={[0.065, 0.55, 12, 16]} />
        </mesh>
        <mesh position={[shoulderWidth + 0.24, 0.05, 0.02]} rotation={[0, 0, -0.15]} material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.52, 12, 16]} />
        </mesh>

        {/* Left Thigh & Leg */}
        <mesh position={[-0.16, -0.65, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.085, 0.65, 12, 16]} />
        </mesh>
        <mesh position={[-0.16, -1.35, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.07, 0.65, 12, 16]} />
        </mesh>

        {/* Right Thigh & Leg */}
        <mesh position={[0.16, -0.65, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.085, 0.65, 12, 16]} />
        </mesh>
        <mesh position={[0.16, -1.35, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.07, 0.65, 12, 16]} />
        </mesh>
      </group>

      {/* ----------------- HOLOGRAPHIC TARGET PEDESTAL ----------------- */}
      <group position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={pedestalRef}>
        {/* Glowing Outer Ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.85, 0.9, 64]} />
          <meshBasicMaterial color="#14B8A6" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner Ring */}
        <mesh>
          <ringGeometry args={[0.6, 0.64, 48]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* Central Subtle Base */}
        <mesh>
          <circleGeometry args={[0.92, 48]} />
          <meshBasicMaterial color="#0F2D33" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        {/* Grid lines */}
        <gridHelper args={[2, 10, '#14B8A6', '#123E48']} rotation={[Math.PI / 2, 0, 0]} />
      </group>
    </group>
  );
};
