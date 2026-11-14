import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { 
  RealisticHeart, 
  RealisticBrain, 
  RealisticLungs, 
  RealisticLiver, 
  RealisticStomach, 
  RealisticKidneys, 
  RealisticIntestines 
} from './RealisticOrganMeshes';

export const Organ3DViewer = ({ organ }) => {
  if (!organ) return null;

  const renderSingleOrgan = () => {
    switch (organ.organId) {
      case 'heart':
        return <RealisticHeart isSelected={false} isHovered={false} isCloseUp={true} />;
      case 'brain':
        return <RealisticBrain isSelected={false} isHovered={false} />;
      case 'lungs':
        return <RealisticLungs isSelected={false} isHovered={false} />;
      case 'liver':
        return <RealisticLiver isSelected={false} isHovered={false} />;
      case 'stomach':
        return <RealisticStomach isSelected={false} isHovered={false} />;
      case 'kidneys':
        return <RealisticKidneys isSelected={false} isHovered={false} />;
      case 'small-intestine':
      case 'large-intestine':
        return <RealisticIntestines isSelected={false} isHovered={false} isLarge={organ.organId === 'large-intestine'} />;
      default:
        return <RealisticHeart isSelected={false} isHovered={false} />;
    }
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 0.7]} fov={45} />
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          autoRotate
          autoRotateSpeed={1.5}
          minDistance={0.35}
          maxDistance={1.5}
        />
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <directionalLight position={[-2, -2, -2]} intensity={0.6} color="#0D9488" />
        <pointLight position={[0, 0, 1]} intensity={0.8} color="#38BDF8" />

        <Suspense fallback={null}>
          <group scale={1.8}>
            {renderSingleOrgan()}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};
