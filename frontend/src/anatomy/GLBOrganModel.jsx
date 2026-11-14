import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Center } from '@react-three/drei';
import * as THREE from 'three';

// Configure DRACO loader path to use our local decoder
useGLTF.setDecoderPath('/draco/');

// Anatomical landmarks definition with 3D offset and descriptive medical annotations
export const ORGAN_LANDMARKS = {
  heart: [
    { id: 'aorta', name: 'Aortic Arch', desc: 'Distributes oxygen-rich blood throughout systemic circulation.', pos: [0, 0.55, 0.05] },
    { id: 'pulmonary_trunk', name: 'Pulmonary Trunk', desc: 'Carries deoxygenated blood to the left & right lungs.', pos: [-0.3, 0.35, 0.2] },
    { id: 'left_ventricle', name: 'Left Ventricle', desc: 'High-pressure muscular chamber pumping blood into the aorta.', pos: [0.35, -0.35, 0.15] },
    { id: 'right_atrium', name: 'Right Atrium', desc: 'Receives deoxygenated blood from superior & inferior venae cavae.', pos: [-0.4, 0.1, -0.1] },
    { id: 'coronary_artery', name: 'Coronary Vessels', desc: 'Supplies essential oxygen and nutrients to myocardial tissue.', pos: [0.05, -0.15, 0.4] },
    { id: 'superior_vena_cava', name: 'Superior Vena Cava', desc: 'Returns venous blood from head, neck, and upper limbs.', pos: [-0.35, 0.55, -0.15] }
  ],
  brain: [
    { id: 'frontal_lobe', name: 'Frontal Lobe', desc: 'Governs executive function, decision making, motor control, and speech.', pos: [0, 0.3, 0.55] },
    { id: 'parietal_lobe', name: 'Parietal Lobe', desc: 'Integrates somatosensory information: touch, temperature, and spatial awareness.', pos: [0, 0.55, -0.1] },
    { id: 'occipital_lobe', name: 'Occipital Lobe', desc: 'Primary visual processing center of the mammalian brain.', pos: [0, 0.15, -0.6] },
    { id: 'temporal_lobe', name: 'Temporal Lobe', desc: 'Processes auditory perception, language comprehension, and long-term memory.', pos: [0.55, -0.1, 0.1] },
    { id: 'cerebellum', name: 'Cerebellum', desc: 'Coordinates precision, timing, balance, and motor learning.', pos: [0, -0.4, -0.45] },
    { id: 'brainstem', name: 'Brainstem', desc: 'Regulates autonomous vital functions including respiration and cardiac rhythm.', pos: [0, -0.65, -0.1] }
  ],
  lungs: [
    { id: 'trachea', name: 'Trachea & Primary Bronchi', desc: 'Cartilaginous airway conducting inhaled air into bilateral bronchial trees.', pos: [0, 0.65, 0] },
    { id: 'right_superior', name: 'Right Superior Lobe', desc: 'Upper pulmonary segment of the 3-lobed right lung.', pos: [-0.45, 0.4, 0.1] },
    { id: 'right_inferior', name: 'Right Inferior Lobe', desc: 'Base segment resting atop the right hemidiaphragm.', pos: [-0.45, -0.4, 0] },
    { id: 'left_superior', name: 'Left Superior Lobe', desc: 'Upper segment of the 2-lobed left lung containing the aortic depression.', pos: [0.45, 0.35, 0.1] },
    { id: 'cardiac_notch', name: 'Cardiac Notch', desc: 'Anatomical indentation accommodating the apex of the human heart.', pos: [0.2, -0.15, 0.25] },
    { id: 'left_inferior', name: 'Left Inferior Lobe', desc: 'Posterior and inferior pulmonary segment exchanging O2 and CO2.', pos: [0.45, -0.4, 0] }
  ],
  liver: [
    { id: 'right_lobe', name: 'Right Hepatic Lobe', desc: 'Largest anatomical lobe performing metabolic filtration and glycogen storage.', pos: [0.5, 0.1, 0.05] },
    { id: 'left_lobe', name: 'Left Hepatic Lobe', desc: 'Extends across epigastrium above the lesser curvature of the stomach.', pos: [-0.45, 0.2, 0] },
    { id: 'gallbladder', name: 'Gallbladder Bed', desc: 'Stores and concentrates alkaline bile produced by hepatic hepatocytes.', pos: [0.15, -0.35, 0.3] },
    { id: 'portal_vein', name: 'Hepatic Portal Vein', desc: 'Carries nutrient-dense venous blood directly from digestive tract.', pos: [0, -0.15, -0.2] },
    { id: 'vena_cava', name: 'Inferior Vena Cava Groove', desc: 'Major venous conduit returning filtered blood to the right heart.', pos: [0, 0.45, -0.2] }
  ],
  kidneys: [
    { id: 'right_kidney', name: 'Right Kidney', desc: 'Positioned slightly lower than left due to the hepatic mass above.', pos: [-0.4, 0.05, 0] },
    { id: 'left_kidney', name: 'Left Kidney', desc: 'Retroperitoneal organ filtering ~180 liters of blood daily.', pos: [0.4, 0.15, 0] },
    { id: 'renal_cortex', name: 'Renal Cortex', desc: 'Outer region containing ~1 million microscopic nephron filtering units.', pos: [0.55, 0.3, 0.05] },
    { id: 'renal_hilum', name: 'Renal Hilum & Artery', desc: 'Entry point for high-pressure renal blood vessels and exiting ureters.', pos: [0.2, 0.15, 0] },
    { id: 'ureters', name: 'Descending Ureters', desc: 'Fibromuscular tubes propelling urine into the urinary bladder.', pos: [0.25, -0.5, 0] }
  ],
  stomach: [
    { id: 'fundus', name: 'Gastric Fundus', desc: 'Dome-shaped superior curvature collecting digestive gases.', pos: [-0.35, 0.5, 0] },
    { id: 'greater_curvature', name: 'Greater Curvature', desc: 'Convex lateral margin anchored to the greater omentum.', pos: [-0.6, 0.05, 0] },
    { id: 'gastric_body', name: 'Gastric Body (Corpus)', desc: 'Central reservoir producing hydrochloric acid (HCl) and pepsinogen.', pos: [-0.15, 0.15, 0.15] },
    { id: 'lesser_curvature', name: 'Lesser Curvature', desc: 'Concave medial margin extending between cardia and pylorus.', pos: [0.15, 0.3, 0] },
    { id: 'pyloric_sphincter', name: 'Pyloric Sphincter & Duodenum', desc: 'Regulates periodic release of acidic chyme into the small intestine.', pos: [0.45, -0.3, 0.1] }
  ],
  bones: [
    { id: 'cranium', name: 'Cranium & Facial Skeleton', desc: 'Rigid osseous vault shielding the brain and sensory organs.', pos: [0, 0.95, 0.1] },
    { id: 'cervical', name: 'Cervical & Thoracic Spine', desc: 'Flexible vertebral column supporting the head and protecting the spinal cord.', pos: [0, 0.6, -0.1] },
    { id: 'thoracic_cage', name: 'Thoracic Cage (Ribs & Sternum)', desc: 'Elastic bony cage protecting heart and lungs during respiratory cycles.', pos: [0, 0.35, 0.2] },
    { id: 'pelvis', name: 'Pelvis & Sacral Complex', desc: 'Weight-bearing pelvic ring transmitting force to the lower extremities.', pos: [0, -0.15, 0.1] }
  ]
};

// Preset optimal scale factors & orientation offsets for each GLB model
const MODEL_CONFIGS = {
  heart: { scale: 0.85, rot: [0, 0, 0], pos: [0, -0.1, 0] },
  brain: { scale: 1.1, rot: [0, 0, 0], pos: [0, 0, 0] },
  lungs: { scale: 0.9, rot: [0, 0, 0], pos: [0, -0.1, 0] },
  liver: { scale: 0.9, rot: [0, 0, 0], pos: [0, 0, 0] },
  kidneys: { scale: 0.95, rot: [0, 0, 0], pos: [0, 0, 0] },
  stomach: { scale: 0.85, rot: [0, 0, 0], pos: [0, 0, 0] },
  bones: { scale: 0.8, rot: [0, 0, 0], pos: [0, 0, 0] },
  skeleton: { scale: 0.8, rot: [0, 0, 0], pos: [0, 0, 0] },
};

export const GLBOrganModel = ({
  modelPath,
  organId,
  isSelected = false,
  isHovered = false,
  showLandmarks = true,
  activeLandmark = null,
  onSelectLandmark,
  onClick,
  onPointerOver,
  onPointerOut,
  scaleMultiplier = 1
}) => {
  const groupRef = useRef();
  const [hoveredMesh, setHoveredMesh] = useState(false);

  // Load GLTF / GLB model via React Three Fiber Drei
  const gltf = useGLTF(modelPath, '/draco/');

  // Clone scene so multiple viewers can mount the same model independently
  const clonedScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const cloned = gltf.scene.clone(true);

    // Enhance materials with physiological realism
    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        // Apply realistic PBR parameters to existing materials
        if (node.material) {
          node.material = node.material.clone();
          node.material.roughness = Math.min(0.45, node.material.roughness || 0.35);
          node.material.metalness = Math.max(0.05, node.material.metalness || 0.1);
          if (node.material.isMeshStandardMaterial || node.material.isMeshPhysicalMaterial) {
            node.material.envMapIntensity = 1.2;
          }
        }
      }
    });

    return cloned;
  }, [gltf]);

  // Subtle physiological pulse animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (organId === 'heart') {
      // Characteristic physiological heartbeat (systole & diastole)
      const beat = 1 + Math.sin(t * 4.2) * 0.025 + Math.sin(t * 8.4) * 0.015;
      groupRef.current.scale.set(beat * scaleMultiplier, beat * scaleMultiplier, beat * scaleMultiplier);
    } else if (organId === 'lungs') {
      // Rhythmic respiratory expansion
      const breath = 1 + Math.sin(t * 1.8) * 0.02;
      groupRef.current.scale.set(breath * scaleMultiplier, breath * scaleMultiplier, breath * scaleMultiplier);
    } else if (isSelected) {
      // Gentle selection highlight pulse
      const pulse = 1 + Math.sin(t * 3.0) * 0.018;
      groupRef.current.scale.set(pulse * scaleMultiplier, pulse * scaleMultiplier, pulse * scaleMultiplier);
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
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredMesh(true);
        if (onPointerOver) onPointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHoveredMesh(false);
        if (onPointerOut) onPointerOut();
      }}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>

      {/* Anatomical Landmark Pins & Callout Tooltips */}
      {showLandmarks && landmarks.map((lm) => {
        const isActive = activeLandmark === lm.id;
        return (
          <group key={lm.id} position={lm.pos}>
            <Html distanceFactor={4} position={[0, 0, 0]} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectLandmark) onSelectLandmark(lm);
                }}
                className={`transition-all duration-300 cursor-pointer pointer-events-auto select-none ${
                  isActive ? 'scale-110 z-50' : 'hover:scale-105 z-20'
                }`}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-950/85 backdrop-blur-md border border-teal-400/60 shadow-lg text-white">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400 animate-ping' : 'bg-teal-400'}`}></span>
                  <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
                    {lm.name}
                  </span>
                </div>

                {isActive && (
                  <div className="mt-1.5 p-2.5 rounded-xl bg-white/95 backdrop-blur-lg shadow-2xl border border-teal-200 text-slate-800 text-[11px] max-w-[200px] animate-in fade-in zoom-in-95">
                    <div className="font-extrabold text-teal-800">{lm.name}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">{lm.desc}</div>
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
