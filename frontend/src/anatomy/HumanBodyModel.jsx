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

  // Translucent glowing biological body contour
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: '#083344',
    emissive: '#042F2E',
    emissiveIntensity: 0.25,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.85,
    thickness: 1.2,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });

  // Skeletal silhouette
  const boneMaterial = new THREE.MeshStandardMaterial({
    color: '#38BDF8',
    emissive: '#0284C7',
    emissiveIntensity: 0.35,
    roughness: 0.4,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });

  // Vascular tree (aorta & vena cava running along the spinal column)
  const arteryMaterial = new THREE.MeshStandardMaterial({
    color: '#EF4444',
    emissive: '#DC2626',
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.65,
  });

  const veinMaterial = new THREE.MeshStandardMaterial({
    color: '#3B82F6',
    emissive: '#2563EB',
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.65,
  });

  const isFemale = gender === 'female';
  const shoulderWidth = isFemale ? 0.38 : 0.46;
  const hipWidth = isFemale ? 0.34 : 0.29;

  return (
    <group position={[0, 0, 0]}>
      {/* ----------------- ANATOMICAL SILHOUETTE ----------------- */}
      <group position={[0, 0, 0]}>
        {/* Head Cranium */}
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

        {/* Abdomen & Pelvis */}
        <mesh position={[0, -0.05, 0.02]} material={bodyMaterial}>
          <cylinderGeometry args={[hipWidth * 0.9, hipWidth, 0.5, 24]} />
        </mesh>

        {/* Arms */}
        <mesh position={[-shoulderWidth - 0.08, 0.6, 0.02]} rotation={[0, 0, 0.18]} material={bodyMaterial}>
          <capsuleGeometry args={[0.065, 0.55, 12, 16]} />
        </mesh>
        <mesh position={[-shoulderWidth - 0.24, 0.05, 0.02]} rotation={[0, 0, 0.15]} material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.52, 12, 16]} />
        </mesh>
        <mesh position={[shoulderWidth + 0.08, 0.6, 0.02]} rotation={[0, 0, -0.18]} material={bodyMaterial}>
          <capsuleGeometry args={[0.065, 0.55, 12, 16]} />
        </mesh>
        <mesh position={[shoulderWidth + 0.24, 0.05, 0.02]} rotation={[0, 0, -0.15]} material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.52, 12, 16]} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.16, -0.65, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.085, 0.65, 12, 16]} />
        </mesh>
        <mesh position={[-0.16, -1.35, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.07, 0.65, 12, 16]} />
        </mesh>
        <mesh position={[0.16, -0.65, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.085, 0.65, 12, 16]} />
        </mesh>
        <mesh position={[0.16, -1.35, 0.02]} material={bodyMaterial}>
          <capsuleGeometry args={[0.07, 0.65, 12, 16]} />
        </mesh>
      </group>

      {/* ----------------- SKELETAL RIB CAGE & SPINE ----------------- */}
      {showSkeletal && (
        <group position={[0, 0, 0]}>
          {/* Vertebral Spinal Column */}
          <mesh position={[0, 0.5, -0.06]}>
            <cylinderGeometry args={[0.02, 0.025, 1.1, 12]} />
            <primitive object={boneMaterial} attach="material" />
          </mesh>

          {/* Clavicles */}
          <mesh position={[-0.16, 1.02, 0.04]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <primitive object={boneMaterial} attach="material" />
          </mesh>
          <mesh position={[0.16, 1.02, 0.04]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <primitive object={boneMaterial} attach="material" />
          </mesh>

          {/* Sternum (Chest bone) */}
          <mesh position={[0, 0.68, 0.16]}>
            <boxGeometry args={[0.045, 0.22, 0.015]} />
            <primitive object={boneMaterial} attach="material" />
          </mesh>

          {/* Rib Arches (10 Anatomical Rib Pairs) */}
          {[-0.08, -0.02, 0.04, 0.1, 0.16, 0.22].map((yOffset, i) => (
            <mesh key={i} position={[0, 0.65 + yOffset, 0.04]} rotation={[0.15, 0, 0]}>
              <torusGeometry args={[0.26 - i * 0.015, 0.009, 8, 24, Math.PI * 1.7]} />
              <primitive object={boneMaterial} attach="material" />
            </mesh>
          ))}

          {/* Pelvis Girdle */}
          <mesh position={[0, -0.22, 0]}>
            <torusGeometry args={[0.22, 0.035, 10, 24]} />
            <primitive object={boneMaterial} attach="material" />
          </mesh>
        </group>
      )}

      {/* ----------------- GREAT VASCULAR PATHWAYS ----------------- */}
      <group position={[0, 0, -0.02]}>
        {/* Abdominal Aorta Trunk (Red) */}
        <mesh position={[-0.015, 0.1, 0]}>
          <cylinderGeometry args={[0.014, 0.012, 0.8, 12]} />
          <primitive object={arteryMaterial} attach="material" />
        </mesh>
        {/* Inferior Vena Cava (Blue) */}
        <mesh position={[0.02, 0.1, 0]}>
          <cylinderGeometry args={[0.016, 0.014, 0.8, 12]} />
          <primitive object={veinMaterial} attach="material" />
        </mesh>
        {/* Iliac Artery Bifurcations to Legs */}
        <mesh position={[-0.06, -0.38, 0.01]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.009, 0.007, 0.28, 8]} />
          <primitive object={arteryMaterial} attach="material" />
        </mesh>
        <mesh position={[0.06, -0.38, 0.01]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.009, 0.007, 0.28, 8]} />
          <primitive object={arteryMaterial} attach="material" />
        </mesh>
      </group>

      {/* ----------------- HOLOGRAPHIC TARGET PEDESTAL RINGS ----------------- */}
      <group position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={pedestalRef}>
        {/* Glowing Outer Ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.85, 0.9, 64]} />
          <meshBasicMaterial color="#14B8A6" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner Ring */}
        <mesh>
          <ringGeometry args={[0.6, 0.64, 48]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        {/* Center Target Disc */}
        <mesh>
          <circleGeometry args={[0.92, 48]} />
          <meshBasicMaterial color="#0F2D33" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        {/* Floor Grid */}
        <gridHelper args={[2.2, 12, '#14B8A6', '#123E48']} rotation={[Math.PI / 2, 0, 0]} />
      </group>
    </group>
  );
};
