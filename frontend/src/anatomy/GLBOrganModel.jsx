import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Configure DRACO loader path
useGLTF.setDecoderPath('/draco/');

// Anatomical landmarks definition with 3D offset and descriptive medical annotations
export const ORGAN_LANDMARKS = {
  heart: [
    { id: 'aorta', name: 'Aortic Arch', desc: 'Distributes oxygen-rich blood throughout systemic circulation.', pos: [0, 0.5, 0.05] },
    { id: 'pulmonary_trunk', name: 'Pulmonary Trunk', desc: 'Carries deoxygenated blood to the left & right lungs.', pos: [-0.25, 0.3, 0.15] },
    { id: 'left_ventricle', name: 'Left Ventricle', desc: 'High-pressure muscular chamber pumping blood into the aorta.', pos: [0.3, -0.3, 0.1] },
    { id: 'right_atrium', name: 'Right Atrium', desc: 'Receives deoxygenated blood from superior & inferior venae cavae.', pos: [-0.35, 0.1, -0.05] },
    { id: 'coronary_artery', name: 'Coronary Vessels', desc: 'Supplies essential oxygen and nutrients to myocardial tissue.', pos: [0.05, -0.1, 0.3] },
    { id: 'superior_vena_cava', name: 'Superior Vena Cava', desc: 'Returns venous blood from head, neck, and upper limbs.', pos: [-0.3, 0.45, -0.1] }
  ],
  brain: [
    { id: 'frontal_lobe', name: 'Frontal Lobe', desc: 'Governs executive function, decision making, motor control, and speech.', pos: [0, 0.25, 0.45] },
    { id: 'parietal_lobe', name: 'Parietal Lobe', desc: 'Integrates somatosensory information: touch, temperature, and spatial awareness.', pos: [0, 0.45, -0.1] },
    { id: 'occipital_lobe', name: 'Occipital Lobe', desc: 'Primary visual processing center of the mammalian brain.', pos: [0, 0.1, -0.45] },
    { id: 'temporal_lobe', name: 'Temporal Lobe', desc: 'Processes auditory perception, language comprehension, and long-term memory.', pos: [0.45, -0.1, 0.1] },
    { id: 'cerebellum', name: 'Cerebellum', desc: 'Coordinates precision, timing, balance, and motor learning.', pos: [0, -0.35, -0.35] },
    { id: 'brainstem', name: 'Brainstem', desc: 'Regulates autonomous vital functions including respiration and cardiac rhythm.', pos: [0, -0.5, -0.1] }
  ],
  lungs: [
    { id: 'trachea', name: 'Trachea & Primary Bronchi', desc: 'Cartilaginous airway conducting inhaled air into bilateral bronchial trees.', pos: [0, 0.55, 0] },
    { id: 'right_superior', name: 'Right Superior Lobe', desc: 'Upper pulmonary segment of the 3-lobed right lung.', pos: [-0.4, 0.3, 0.1] },
    { id: 'right_inferior', name: 'Right Inferior Lobe', desc: 'Base segment resting atop the right hemidiaphragm.', pos: [-0.4, -0.35, 0] },
    { id: 'left_superior', name: 'Left Superior Lobe', desc: 'Upper segment of the 2-lobed left lung containing the aortic depression.', pos: [0.4, 0.25, 0.1] },
    { id: 'cardiac_notch', name: 'Cardiac Notch', desc: 'Anatomical indentation accommodating the apex of the human heart.', pos: [0.18, -0.1, 0.2] },
    { id: 'left_inferior', name: 'Left Inferior Lobe', desc: 'Posterior and inferior pulmonary segment exchanging O2 and CO2.', pos: [0.4, -0.35, 0] }
  ],
  liver: [
    { id: 'right_lobe', name: 'Right Hepatic Lobe', desc: 'Largest anatomical lobe performing metabolic filtration and glycogen storage.', pos: [0.4, 0.1, 0.05] },
    { id: 'left_lobe', name: 'Left Hepatic Lobe', desc: 'Extends across epigastrium above the lesser curvature of the stomach.', pos: [-0.35, 0.15, 0] },
    { id: 'gallbladder', name: 'Gallbladder Bed', desc: 'Stores and concentrates alkaline bile produced by hepatic hepatocytes.', pos: [0.1, -0.25, 0.2] },
    { id: 'portal_vein', name: 'Hepatic Portal Vein', desc: 'Carries nutrient-dense venous blood directly from digestive tract.', pos: [0, -0.1, -0.15] },
    { id: 'vena_cava', name: 'Inferior Vena Cava Groove', desc: 'Major venous conduit returning filtered blood to the right heart.', pos: [0, 0.35, -0.15] }
  ],
  kidneys: [
    { id: 'right_kidney', name: 'Right Kidney', desc: 'Positioned slightly lower than left due to the hepatic mass above.', pos: [-0.35, 0.05, 0] },
    { id: 'left_kidney', name: 'Left Kidney', desc: 'Retroperitoneal organ filtering ~180 liters of blood daily.', pos: [0.35, 0.1, 0] },
    { id: 'renal_cortex', name: 'Renal Cortex', desc: 'Outer region containing ~1 million microscopic nephron filtering units.', pos: [0.45, 0.2, 0.05] },
    { id: 'renal_hilum', name: 'Renal Hilum & Artery', desc: 'Entry point for high-pressure renal blood vessels and exiting ureters.', pos: [0.15, 0.1, 0] },
    { id: 'ureters', name: 'Descending Ureters', desc: 'Fibromuscular tubes propelling urine into the urinary bladder.', pos: [0.2, -0.4, 0] }
  ],
  stomach: [
    { id: 'fundus', name: 'Gastric Fundus', desc: 'Dome-shaped superior curvature collecting digestive gases.', pos: [-0.3, 0.4, 0] },
    { id: 'greater_curvature', name: 'Greater Curvature', desc: 'Convex lateral margin anchored to the greater omentum.', pos: [-0.5, 0.05, 0] },
    { id: 'gastric_body', name: 'Gastric Body (Corpus)', desc: 'Central reservoir producing hydrochloric acid (HCl) and pepsinogen.', pos: [-0.1, 0.1, 0.1] },
    { id: 'lesser_curvature', name: 'Lesser Curvature', desc: 'Concave medial margin extending between cardia and pylorus.', pos: [0.1, 0.2, 0] },
    { id: 'pyloric_sphincter', name: 'Pyloric Sphincter & Duodenum', desc: 'Regulates periodic release of acidic chyme into the small intestine.', pos: [0.35, -0.25, 0.1] }
  ],
  bones: [
    { id: 'cranium', name: 'Cranium & Facial Skeleton', desc: 'Rigid osseous vault shielding the brain and sensory organs.', pos: [0, 0.8, 0.1] },
    { id: 'cervical', name: 'Cervical & Thoracic Spine', desc: 'Flexible vertebral column supporting the head and protecting the spinal cord.', pos: [0, 0.5, -0.1] },
    { id: 'thoracic_cage', name: 'Thoracic Cage (Ribs & Sternum)', desc: 'Elastic bony cage protecting heart and lungs during respiratory cycles.', pos: [0, 0.3, 0.15] },
    { id: 'pelvis', name: 'Pelvis & Sacral Complex', desc: 'Weight-bearing pelvic ring transmitting force to the lower extremities.', pos: [0, -0.1, 0.1] }
  ]
};

const MODEL_CONFIGS = {
  heart: { scale: 0.85, rot: [0, 0, 0], pos: [0, -0.1, 0] },
  brain: { scale: 1.0, rot: [0, 0, 0], pos: [0, 0, 0] },
  lungs: { scale: 0.85, rot: [0, 0, 0], pos: [0, -0.1, 0] },
  liver: { scale: 0.85, rot: [0, 0, 0], pos: [0, 0, 0] },
  kidneys: { scale: 0.9, rot: [0, 0, 0], pos: [0, 0, 0] },
  stomach: { scale: 0.8, rot: [0, 0, 0], pos: [0, 0, 0] },
  bones: { scale: 0.75, rot: [0, 0, 0], pos: [0, 0, 0] },
  skeleton: { scale: 0.75, rot: [0, 0, 0], pos: [0, 0, 0] },
};

export const GLBOrganModel = ({
  modelPath,
  organId,
  isSelected = false,
  isHovered = false,
  showLandmarks = true,
  activeLandmark = null,
  onSelectLandmark,
  onHoverLandmark,
  scaleMultiplier = 1
}) => {
  const groupRef = useRef();
  const [hoveredLandmark, setHoveredLandmark] = useState(null);
  const gltf = useGLTF(modelPath, '/draco/');

  const clonedScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const cloned = gltf.scene.clone(true);

    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material = node.material.clone();
          node.material.roughness = Math.min(0.45, node.material.roughness || 0.35);
          node.material.metalness = Math.max(0.05, node.material.metalness || 0.1);
        }
      }
    });

    return cloned;
  }, [gltf]);

  // Physiological pulse animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (organId === 'heart') {
      const beat = 1 + Math.sin(t * 4.2) * 0.025 + Math.sin(t * 8.4) * 0.012;
      groupRef.current.scale.set(beat * scaleMultiplier, beat * scaleMultiplier, beat * scaleMultiplier);
    } else if (organId === 'lungs') {
      const breath = 1 + Math.sin(t * 1.8) * 0.02;
      groupRef.current.scale.set(breath * scaleMultiplier, breath * scaleMultiplier, breath * scaleMultiplier);
    }
  });

  const config = MODEL_CONFIGS[organId] || { scale: 1, rot: [0, 0, 0], pos: [0, 0, 0] };
  const landmarks = ORGAN_LANDMARKS[organId] || [];

  if (!clonedScene) return null;

  return (
    <group
      ref={groupRef}
      scale={config.scale * scaleMultiplier}
      rotation={config.rot}
      position={config.pos}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>

      {/* 3D Anatomical Landmarks - Sleek glowing 3D pins without disruptive DOM elements */}
      {showLandmarks && landmarks.map((lm) => {
        const isActive = activeLandmark === lm.id;
        const isHoveredPin = hoveredLandmark === lm.id;

        return (
          <group 
            key={lm.id} 
            position={lm.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredLandmark(lm.id);
              if (onHoverLandmark) onHoverLandmark(lm);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredLandmark(null);
              if (onHoverLandmark) onHoverLandmark(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectLandmark) onSelectLandmark(lm);
            }}
          >
            {/* 3D Landmark Pin Sphere */}
            <mesh>
              <sphereGeometry args={[isActive || isHoveredPin ? 0.03 : 0.022, 16, 16]} />
              <meshStandardMaterial
                color={isActive ? '#F59E0B' : (isHoveredPin ? '#38BDF8' : '#14B8A6')}
                emissive={isActive ? '#F59E0B' : (isHoveredPin ? '#38BDF8' : '#0D9488')}
                emissiveIntensity={isActive ? 1.2 : 0.7}
              />
            </mesh>

            {/* Pulsing ring indicator */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.028, 0.036, 24]} />
              <meshBasicMaterial 
                color={isActive ? '#FBBF24' : '#2DD4BF'} 
                transparent 
                opacity={isActive ? 0.9 : 0.6} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
