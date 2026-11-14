import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HumanBodyModel = ({ 
  gender = 'male', 
  visible = true, 
  showSkin = true,
  showSkeletal = true,
  skinOpacity = 0.35,
}) => {
  const pedestalRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  // Rotate concentric holographic pedestal rings
  useFrame((state) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.004;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.003;
  });

  if (!visible) return null;

  const isFemale = gender === 'female';
  const shoulderWidth = isFemale ? 0.34 : 0.42;
  const hipWidth = isFemale ? 0.32 : 0.28;
  const torsoScale = isFemale ? 0.94 : 1.0;

  // Translucent biological skin material with smooth opacity
  const skinMaterial = new THREE.MeshPhysicalMaterial({
    color: '#083344',
    emissive: '#042F2E',
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.85,
    thickness: 1.2,
    transparent: true,
    opacity: showSkin ? Math.max(0.12, skinOpacity) : 0.0,
    depthWrite: skinOpacity > 0.7,
  });

  // Skeletal silhouette material
  const boneMaterial = new THREE.MeshStandardMaterial({
    color: '#E0E7FF',
    emissive: '#38BDF8',
    emissiveIntensity: 0.25,
    roughness: 0.4,
    transparent: true,
    opacity: showSkeletal ? 0.4 : 0.0,
    depthWrite: false,
  });

  // Vascular tree materials
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

  return (
    <group position={[0, -0.15, 0]}>
      
      {/* ----------------- HOLOGRAPHIC MEDICAL PEDESTAL ----------------- */}
      <group position={[0, -1.05, 0]}>
        {/* Glowing circular platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.3, 64]} />
          <meshBasicMaterial color="#061E23" transparent opacity={0.75} />
        </mesh>

        {/* Outer Rotating Cyan Ring */}
        <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.15, 1.18, 64]} />
          <meshBasicMaterial color="#14B8A6" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Inner Rotating Sky Ring */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[0.85, 0.88, 48]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>

        {/* Vertical light projector cylinder */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.15, 1.25, 1.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#14B8A6"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ----------------- ANATOMICAL HUMAN BODY SILHOUETTE ----------------- */}
      <group position={[0, 0.1, 0]} scale={[torsoScale, torsoScale, torsoScale]}>
        
        {/* Head & Cranium */}
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, 0.81, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.12, 24]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>

        {/* Shoulders & Upper Chest */}
        <mesh position={[0, 0.68, 0]}>
          <boxGeometry args={[shoulderWidth * 2, 0.14, 0.18]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>

        {/* Thoracic Cavity / Chest Shell */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.26, 0.23, 0.26, 32]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>

        {/* Abdominal Cavity Shell */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.24, 32]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>

        {/* Pelvic Basin Shell */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.24, hipWidth, 0.20, 32]} />
          <primitive object={skinMaterial} attach="material" />
        </mesh>

        {/* Arms (Standing in anatomical position) */}
        {/* Left Arm */}
        <group position={[shoulderWidth + 0.06, 0.42, 0]}>
          <mesh position={[0.02, 0, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.05, 0.045, 0.36, 16]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
          <mesh position={[0.08, -0.32, 0]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.042, 0.038, 0.34, 16]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[-shoulderWidth - 0.06, 0.42, 0]}>
          <mesh position={[-0.02, 0, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.05, 0.045, 0.36, 16]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.08, -0.32, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.042, 0.038, 0.34, 16]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>

        {/* Legs (Lower Extremities) */}
        {/* Left Leg */}
        <group position={[0.13, -0.42, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.065, 0.44, 20]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.06, 0.045, 0.44, 20]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[-0.13, -0.42, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.065, 0.44, 20]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.06, 0.045, 0.44, 20]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>

        {/* ----------------- SKELETAL SYSTEM SILHOUETTE ----------------- */}
        {showSkeletal && (
          <group position={[0, 0, 0]}>
            {/* Cranium / Skull Vault */}
            <mesh position={[0, 0.96, 0.01]}>
              <sphereGeometry args={[0.11, 24, 24]} />
              <primitive object={boneMaterial} attach="material" />
            </mesh>
            
            {/* Spine (Vertebral Column) */}
            <mesh position={[0, 0.45, -0.06]}>
              <cylinderGeometry args={[0.025, 0.03, 0.68, 16]} />
              <primitive object={boneMaterial} attach="material" />
            </mesh>

            {/* Clavicles (Collar bones) */}
            <mesh position={[0, 0.69, 0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, shoulderWidth * 1.8, 12]} />
              <primitive object={boneMaterial} attach="material" />
            </mesh>

            {/* Sternum (Breastbone) */}
            <mesh position={[0, 0.52, 0.12]}>
              <boxGeometry args={[0.045, 0.18, 0.02]} />
              <primitive object={boneMaterial} attach="material" />
            </mesh>

            {/* Ribcage Structure (Thorax Rings) */}
            {[0.62, 0.56, 0.50, 0.44, 0.38].map((y, idx) => (
              <mesh key={idx} position={[0, y, 0.02]} rotation={[Math.PI / 12, 0, 0]}>
                <torusGeometry args={[0.18 - idx * 0.01, 0.012, 12, 28, Math.PI * 1.4]} />
                <primitive object={boneMaterial} attach="material" />
              </mesh>
            ))}

            {/* Pelvic Basin Ring */}
            <mesh position={[0, 0.07, 0]}>
              <torusGeometry args={[0.18, 0.028, 16, 32]} />
              <primitive object={boneMaterial} attach="material" />
            </mesh>
          </group>
        )}

        {/* ----------------- VASCULAR TREE (AORTA & VENA CAVA) ----------------- */}
        <group position={[0, 0, 0]}>
          {/* Descending Aorta */}
          <mesh position={[-0.015, 0.42, -0.03]}>
            <cylinderGeometry args={[0.012, 0.010, 0.55, 12]} />
            <primitive object={arteryMaterial} attach="material" />
          </mesh>
          {/* Inferior Vena Cava */}
          <mesh position={[0.018, 0.38, -0.03]}>
            <cylinderGeometry args={[0.014, 0.012, 0.48, 12]} />
            <primitive object={veinMaterial} attach="material" />
          </mesh>
        </group>

      </group>

    </group>
  );
};
