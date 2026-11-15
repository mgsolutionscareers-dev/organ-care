import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Configure DRACO decoder path
useGLTF.setDecoderPath('/draco/');

// High-fidelity Z-Anatomy Full Body Mesh Renderer
const ZAnatomyBodyRenderer = ({
  gender = 'male',
  showSkeletal = true,
  showMuscular = true,
  showInternalOrgans = true,
  boneMaterial,
  muscleMaterial,
  anteriorWallMaterial,
  tendonMaterial
}) => {
  const bodyRef = useRef();
  const { scene } = useGLTF('/models/full_body_anatomy.glb', '/draco/');

  const anatomyModel = useMemo(() => {
    if (!scene) return null;
    return scene.clone(true);
  }, [scene]);

  useEffect(() => {
    if (!anatomyModel) return;

    anatomyModel.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.renderOrder = showInternalOrgans ? 10 : 0;

        const name = (node.name || '').toLowerCase();
        const matName = node.material?.name || '';

        const isBone = matName === 'Mat_Bone_Pro' || 
          /bone|skeleton|cranium|mandible|maxilla|rib|sternum|vertebra|femur|tibia|fibula|scapula|clavicle|pelvis|sacrum|patella|radius|ulna/i.test(name);
        
        const isTendon = /tendon|sheath|bursa|cartilage/i.test(name);
        const isAnteriorMuscle = /pectoral|rectus\s*abdomin|obliquus\s*externus|intercostal/i.test(name);

        if (isBone) {
          node.visible = Boolean(showSkeletal);
          node.material = boneMaterial;
        } else if (isTendon) {
          node.visible = Boolean(showMuscular);
          node.material = tendonMaterial;
        } else if (isAnteriorMuscle && showInternalOrgans) {
          node.visible = Boolean(showMuscular);
          node.material = anteriorWallMaterial;
        } else {
          node.visible = Boolean(showMuscular);
          node.material = muscleMaterial;
        }
      }
    });
  }, [anatomyModel, showSkeletal, showMuscular, showInternalOrgans, boneMaterial, muscleMaterial, anteriorWallMaterial, tendonMaterial]);

  if (!anatomyModel) return null;

  const isFemale = gender === 'female';
  const bodyScale = isFemale ? [0.94, 0.97, 0.94] : [1.0, 1.0, 1.0];

  return (
    <group
      ref={bodyRef}
      position={[0, -0.858, 0]}
      scale={bodyScale}
      renderOrder={showInternalOrgans ? 10 : 0}
    >
      <primitive object={anatomyModel} />
    </group>
  );
};

// Immediate Anatomical Human Silhouette while GLB downloads over network
const BodySilhouetteFallback = ({ gender = 'male' }) => {
  const isFemale = gender === 'female';
  return (
    <group position={[0, -0.05, 0]}>
      {/* Head wireframe/hologram */}
      <mesh position={[0, 0.74, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.08} wireframe />
      </mesh>
      {/* Torso cage */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.18, 0.15, 0.65, 16, 1, true]} />
        <meshBasicMaterial color="#0D9488" transparent opacity={0.06} wireframe />
      </mesh>
      {/* Pelvis & legs silhouette */}
      <mesh position={[-0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.75, 12, 1, true]} />
        <meshBasicMaterial color="#0D9488" transparent opacity={0.05} wireframe />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.75, 12, 1, true]} />
        <meshBasicMaterial color="#0D9488" transparent opacity={0.05} wireframe />
      </mesh>
    </group>
  );
};

export const HumanBodyModel = ({ 
  gender = 'male', 
  visible = true, 
  showSkin = true,
  showSkeletal = true,
  showMuscular = true,
  showInternalOrgans = true,
  skinOpacity = 0.35,
}) => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  // Rotate concentric holographic pedestal rings
  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.005;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.0035;
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.002;
  });

  // Medical Ivory PBR material for skeletal structures
  const boneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#E8EDF2',
      roughness: 0.35,
      metalness: 0.08,
      transparent: Boolean(showInternalOrgans),
      opacity: showInternalOrgans ? 0.52 : 1.0,
      depthWrite: !showInternalOrgans,
      shadowSide: THREE.FrontSide,
    });
  }, [showInternalOrgans]);

  // Deep anatomical crimson PBR material for muscular tissue
  const muscleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#991B1B',
      roughness: 0.50,
      metalness: 0.06,
      transparent: true,
      opacity: showInternalOrgans ? 0.18 : 0.95,
      depthWrite: !showInternalOrgans,
    });
  }, [showInternalOrgans]);

  // Sheer transparent material for anterior chest & abdominal wall
  const anteriorWallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#7F1D1D',
      roughness: 0.55,
      transparent: true,
      opacity: showInternalOrgans ? 0.03 : 0.95,
      depthWrite: !showInternalOrgans,
    });
  }, [showInternalOrgans]);

  // Translucent pearlescent material for tendons & cartilages
  const tendonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#E0F2FE',
      roughness: 0.28,
      metalness: 0.12,
      transparent: true,
      opacity: showInternalOrgans ? 0.25 : 0.85,
      depthWrite: false,
    });
  }, [showInternalOrgans]);

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      
      {/* ----------------- HOLOGRAPHIC MEDICAL PEDESTAL (INSTANT RENDER) ----------------- */}
      <group position={[0, -0.855, 0]}>
        {/* Dark circular platform floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.25, 64]} />
          <meshBasicMaterial color="#051D23" transparent opacity={0.82} />
        </mesh>

        {/* Outer Rotating Glowing Teal Ring */}
        <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[1.05, 1.08, 64]} />
          <meshBasicMaterial color="#14B8A6" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>

        {/* Middle Cyan Ring with Dashes */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
          <ringGeometry args={[0.78, 0.81, 48]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Inner Core Ring */}
        <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[0.45, 0.47, 36]} />
          <meshBasicMaterial color="#2DD4BF" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Vertical Holographic Cylindrical Projector Glow */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[1.05, 1.15, 1.7, 32, 1, true]} />
          <meshBasicMaterial
            color="#14B8A6"
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ----------------- FULL BODY Z-ANATOMY WITH SILHOUETTE FALLBACK ----------------- */}
      <Suspense fallback={<BodySilhouetteFallback gender={gender} />}>
        <ZAnatomyBodyRenderer
          gender={gender}
          showSkeletal={showSkeletal}
          showMuscular={showMuscular}
          showInternalOrgans={showInternalOrgans}
          boneMaterial={boneMaterial}
          muscleMaterial={muscleMaterial}
          anteriorWallMaterial={anteriorWallMaterial}
          tendonMaterial={tendonMaterial}
        />
      </Suspense>

    </group>
  );
};
