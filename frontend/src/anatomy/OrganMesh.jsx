import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  RealisticHeart, 
  RealisticBrain, 
  RealisticLungs, 
  RealisticLiver, 
  RealisticStomach, 
  RealisticKidneys, 
  RealisticIntestines,
  RealisticPancreas,
  RealisticBladder,
  RealisticSpleen
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

  const isHighlighted = isSelected || localHover || isHovered;

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
      {/* Anatomical Organ Model */}
      {organ.organId === 'heart' && <RealisticHeart isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'brain' && <RealisticBrain isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'lungs' && <RealisticLungs isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'liver' && <RealisticLiver isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'stomach' && <RealisticStomach isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'kidneys' && <RealisticKidneys isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'pancreas' && <RealisticPancreas isSelected={isSelected} isHovered={isHighlighted} />}
      {(organ.organId === 'intestines' || organ.organId === 'small-intestine' || organ.organId === 'large-intestine') && (
        <RealisticIntestines isSelected={isSelected} isHovered={isHighlighted} isLarge={organ.organId === 'large-intestine'} />
      )}
      {organ.organId === 'bladder' && <RealisticBladder isSelected={isSelected} isHovered={isHighlighted} />}
      {organ.organId === 'spleen' && <RealisticSpleen isSelected={isSelected} isHovered={isHighlighted} />}

      {/* Floating 3D Organ Marker when hovered or selected */}
      {isHighlighted && (
        <mesh position={[0, 0.20, 0]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshBasicMaterial color={isSelected ? '#14B8A6' : '#38BDF8'} />
        </mesh>
      )}
    </group>
  );
};
