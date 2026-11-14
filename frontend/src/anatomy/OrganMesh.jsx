import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  RealisticHeart, 
  RealisticBrain, 
  RealisticLungs, 
  RealisticLiver, 
  RealisticStomach, 
  RealisticKidneys, 
  RealisticIntestines 
} from './RealisticOrganMeshes';

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

  // Subtle floating pulsation for selected organ
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isSelected) {
      const pulse = 1.04 + Math.sin(t * 3.5) * 0.02;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (localHover) {
      meshRef.current.scale.set(1.06, 1.06, 1.06);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  if (!visible) return null;

  const renderRealisticOrgan = () => {
    switch (organ.organId) {
      case 'heart':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticHeart isSelected={isSelected} isHovered={localHover || isHovered} />
          </group>
        );

      case 'brain':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticBrain isSelected={isSelected} isHovered={localHover || isHovered} />
          </group>
        );

      case 'lungs':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticLungs isSelected={isSelected} isHovered={localHover || isHovered} />
          </group>
        );

      case 'liver':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticLiver isSelected={isSelected} isHovered={localHover || isHovered} />
          </group>
        );

      case 'stomach':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticStomach isSelected={isSelected} isHovered={localHover || isHovered} />
          </group>
        );

      case 'kidneys':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticKidneys isSelected={isSelected} isHovered={localHover || isHovered} />
          </group>
        );

      case 'small-intestine':
      case 'large-intestine':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <RealisticIntestines 
              isSelected={isSelected} 
              isHovered={localHover || isHovered} 
              isLarge={organ.organId === 'large-intestine'} 
            />
          </group>
        );

      case 'pancreas':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]} rotation={[0, 0, 0.25]}>
            {/* Glandular Pancreatic Body with Tapering Tail */}
            <mesh>
              <capsuleGeometry args={[0.038, 0.2, 16, 20]} />
              <meshStandardMaterial 
                color={isSelected ? '#38BDF8' : '#F59E0B'} 
                emissive={isSelected ? '#0284C7' : '#78350F'} 
                emissiveIntensity={isSelected ? 0.7 : 0.3}
                roughness={0.4} 
              />
            </mesh>
            {/* Head in Duodenal C-Loop */}
            <mesh position={[-0.1, -0.02, 0]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color={isSelected ? '#38BDF8' : '#F59E0B'} roughness={0.4} />
            </mesh>
          </group>
        );

      case 'spleen':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]} rotation={[0.4, -0.3, 0.5]}>
            {/* Notched Lymphoid Spleen Wedge */}
            <mesh>
              <capsuleGeometry args={[0.05, 0.1, 16, 16]} />
              <meshStandardMaterial 
                color={isSelected ? '#38BDF8' : '#6B21A8'} 
                emissive={isSelected ? '#0284C7' : '#3B0764'} 
                emissiveIntensity={isSelected ? 0.7 : 0.3}
                roughness={0.3} 
              />
            </mesh>
          </group>
        );

      case 'bladder':
        return (
          <group position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            {/* Muscular Detrusor Dome & Neck */}
            <mesh>
              <sphereGeometry args={[0.09, 24, 20]} />
              <meshStandardMaterial 
                color={isSelected ? '#38BDF8' : '#0D9488'} 
                emissive={isSelected ? '#0284C7' : '#042F2E'} 
                emissiveIntensity={isSelected ? 0.7 : 0.3}
                roughness={0.3} 
              />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh position={[organ.coords3D.x, organ.coords3D.y, organ.coords3D.z]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#14B8A6" roughness={0.3} />
          </mesh>
        );
    }
  };

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
      {renderRealisticOrgan()}
    </group>
  );
};
