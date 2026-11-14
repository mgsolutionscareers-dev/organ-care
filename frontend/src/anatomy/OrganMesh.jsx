import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Organ geometries and visual definitions
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

  // Dynamic animations (e.g. heart beating, lungs breathing)
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (organ.organId === 'heart') {
      // Realistic systolic/diastolic dual pulse
      const pulse = 1 + Math.pow(Math.sin(t * 3.5), 63) * 0.12 + Math.pow(Math.sin(t * 3.5 + 0.3), 63) * 0.08;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (organ.organId === 'lungs') {
      // Smooth breathing expansion
      const breathe = 1 + Math.sin(t * 1.5) * 0.035;
      meshRef.current.scale.set(breathe, breathe, breathe * 1.05);
    } else if (isSelected) {
      // Gentle floating glow indicator for selected organ
      const glowScale = 1.05 + Math.sin(t * 4) * 0.02;
      meshRef.current.scale.set(glowScale, glowScale, glowScale);
    } else if (localHover) {
      meshRef.current.scale.set(1.08, 1.08, 1.08);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  if (!visible) return null;

  const color = isSelected 
    ? '#38BDF8' // bright cyan highlight when selected
    : (localHover || isHovered)
    ? '#2DD4BF' // teal when hovered
    : organ.colorAccent || '#14B8A6';

  const emissiveColor = isSelected ? '#0284C7' : (localHover || isHovered) ? '#0D9488' : '#000000';
  const emissiveIntensity = isSelected ? 0.8 : (localHover || isHovered) ? 0.4 : 0.05;

  // Build appropriate 3D geometry representation for each organ
  const renderGeometry = () => {
    switch (organ.organId) {
      case 'brain':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            {/* Left Hemisphere */}
            <mesh position={[-0.08, 0, 0]}>
              <sphereGeometry args={[0.13, 32, 24]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Right Hemisphere */}
            <mesh position={[0.08, 0, 0]}>
              <sphereGeometry args={[0.13, 32, 24]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Cerebellum */}
            <mesh position={[0, -0.09, -0.06]}>
              <sphereGeometry args={[0.08, 20, 16]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'heart':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            {/* Ventricles / Main Body */}
            <mesh rotation={[0.2, 0.1, -0.3]}>
              <coneGeometry args={[0.12, 0.22, 24]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Atria / Base */}
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.11, 24, 18]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Aorta Arch */}
            <mesh position={[0.02, 0.16, 0]} rotation={[0, 0, 0.5]}>
              <torusGeometry args={[0.05, 0.025, 16, 24, Math.PI]} />
              <meshStandardMaterial color="#EF4444" roughness={0.3} metalness={0.2} />
            </mesh>
          </group>
        );

      case 'lungs':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            {/* Left Lung */}
            <mesh position={[-0.22, 0.02, 0.08]} rotation={[0, 0.15, -0.1]}>
              <cylinderGeometry args={[0.09, 0.13, 0.32, 24]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Right Lung */}
            <mesh position={[0.22, 0.02, 0.08]} rotation={[0, -0.15, 0.1]}>
              <cylinderGeometry args={[0.10, 0.14, 0.33, 24]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Trachea / Airway */}
            <mesh position={[0, 0.22, 0.06]}>
              <cylinderGeometry args={[0.025, 0.025, 0.18, 16]} />
              <meshStandardMaterial color="#A5F3FC" transparent opacity={0.7} />
            </mesh>
          </group>
        );

      case 'liver':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh rotation={[0.1, -0.2, -0.2]}>
              <boxGeometry args={[0.32, 0.17, 0.2]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'stomach':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh rotation={[0.2, 0.3, -0.5]}>
              <torusGeometry args={[0.1, 0.065, 20, 24, Math.PI * 1.2]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'pancreas':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh rotation={[0, 0, 0.3]}>
              <capsuleGeometry args={[0.035, 0.18, 12, 16]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'spleen':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh rotation={[0.4, -0.3, 0.5]}>
              <sphereGeometry args={[0.075, 20, 16]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'kidneys':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            {/* Left Kidney */}
            <mesh position={[-0.14, 0, 0]} rotation={[0.1, 0, 0.2]}>
              <capsuleGeometry args={[0.045, 0.08, 12, 16]} />
              <primitive object={material} attach="material" />
            </mesh>
            {/* Right Kidney */}
            <mesh position={[0.42, -0.02, 0]} rotation={[-0.1, 0, -0.2]}>
              <capsuleGeometry args={[0.045, 0.08, 12, 16]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'small-intestine':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh>
              <sphereGeometry args={[0.13, 24, 20]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'large-intestine':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh>
              <torusGeometry args={[0.2, 0.048, 16, 28, Math.PI * 1.5]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      case 'bladder':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <mesh>
              <sphereGeometry args={[0.08, 20, 18]} />
              <primitive object={material} attach="material" />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <primitive object={material} attach="material" />
          </mesh>
        );
    }
  };

  const material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: emissiveColor,
    emissiveIntensity: emissiveIntensity,
    roughness: 0.25,
    metalness: 0.15,
    transparent: true,
    opacity: isSelected ? 0.95 : 0.82
  });

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(organ);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setLocalHover(true);
        if (onHover) onHover(organ);
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'default';
        setLocalHover(false);
        if (onHover) onHover(null);
      }}
    >
      {renderGeometry()}
    </group>
  );
};
