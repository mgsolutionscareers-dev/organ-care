import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.setDecoderPath('/draco/');

export const HumanBodyModel = ({ 
  gender = 'male', 
  visible = true, 
  showSkin = true,
  showSkeletal = true,
  showInternalOrgans = true,
  skinOpacity = 0.35,
  isolatedOrgan = null,
  onSelectOrgan
}) => {
  const pedestalRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  // Load actual medical anatomy GLB models
  const bodyGltf = useGLTF('/models/human_body.glb');
  const skeletonGltf = useGLTF('/models/skeleton.glb');

  // Rotate glowing holographic pedestal
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.004;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.003;
  });

  // Prepare biological translucent skin / anatomy body model
  const bodyScene = useMemo(() => {
    if (!bodyGltf || !bodyGltf.scene) return null;
    const cloned = bodyGltf.scene.clone(true);

    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        if (node.material) {
          node.material = node.material.clone();
          node.material.transparent = true;
          node.material.opacity = showSkin ? Math.max(0.15, skinOpacity) : 0.0;
          node.material.roughness = 0.3;
          node.material.metalness = 0.1;
          node.material.depthWrite = skinOpacity > 0.7;
          if (node.material.isMeshPhysicalMaterial) {
            node.material.transmission = 1 - skinOpacity;
            node.material.thickness = 1.0;
          }
        }
      }
    });

    return cloned;
  }, [bodyGltf, showSkin, skinOpacity]);

  // Prepare full human skeleton model
  const skeletonScene = useMemo(() => {
    if (!skeletonGltf || !skeletonGltf.scene) return null;
    const cloned = skeletonGltf.scene.clone(true);

    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        // Medical bone material
        node.material = new THREE.MeshStandardMaterial({
          color: '#E0E7FF',
          roughness: 0.45,
          metalness: 0.1,
          transparent: true,
          opacity: showSkeletal ? 0.85 : 0.0,
          depthWrite: showSkeletal,
        });
      }
    });

    return cloned;
  }, [skeletonGltf, showSkeletal]);

  if (!visible || isolatedOrgan) return null;

  // Female proportion scaling adjustments (narrower shoulders, slightly wider pelvic contour)
  const isFemale = gender === 'female';
  const scaleX = isFemale ? 0.94 : 1.0;
  const scaleY = isFemale ? 0.96 : 1.0;

  return (
    <group position={[0, -0.4, 0]}>
      
      {/* ----------------- HOLOGRAPHIC MEDICAL PEDESTAL ----------------- */}
      <group position={[0, -0.85, 0]}>
        {/* Glowing circular platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.3, 64]} />
          <meshBasicMaterial color="#0A2A30" transparent opacity={0.65} />
        </mesh>

        {/* Concentric rotating holographic rings (matches screenshot) */}
        <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.15, 1.18, 64]} />
          <meshBasicMaterial color="#14B8A6" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[0.85, 0.87, 48]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>

        {/* Vertical light projector cylinder */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.2, 1.25, 1.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#14B8A6"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ----------------- 3D FULL SKELETON MODEL ----------------- */}
      {showSkeletal && skeletonScene && (
        <group scale={[0.85 * scaleX, 0.85 * scaleY, 0.85]} position={[0, 0.45, 0]}>
          <Center top>
            <primitive object={skeletonScene} />
          </Center>
        </group>
      )}

      {/* ----------------- 3D MEDICAL HUMAN ANATOMY & TORSO ----------------- */}
      {showInternalOrgans && bodyScene && (
        <group scale={[1.4 * scaleX, 1.4 * scaleY, 1.4]} position={[0, 0.45, 0]}>
          <Center top>
            <primitive object={bodyScene} />
          </Center>
        </group>
      )}

    </group>
  );
};
