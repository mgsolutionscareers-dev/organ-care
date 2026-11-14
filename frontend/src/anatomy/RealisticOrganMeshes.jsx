import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ------------------- REALISTIC PROCEDURAL ANATOMICAL MESHES -------------------

// 1. REALISTIC HEART WITH AORTA, PULMONARY TRUNK, CORONARY VESSELS & ATRIUM
export const RealisticHeart = ({ isSelected, isHovered, isCloseUp = false }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Systolic & diastolic dual heartbeat pulse
    const scaleFactor = 1 + Math.pow(Math.sin(t * 3.8), 31) * 0.08 + Math.pow(Math.sin(t * 3.8 + 0.35), 31) * 0.05;
    groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  // Aorta curve (arch with 3 branch arteries)
  const aortaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.05, 0.04),
      new THREE.Vector3(-0.01, 0.16, 0.03),
      new THREE.Vector3(0.04, 0.22, 0.0),
      new THREE.Vector3(0.08, 0.16, -0.04),
      new THREE.Vector3(0.07, -0.05, -0.05),
    ]);
  }, []);

  // Pulmonary trunk curve (crossing in front of aorta)
  const pulmonaryCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, 0.02, 0.08),
      new THREE.Vector3(0.0, 0.12, 0.06),
      new THREE.Vector3(-0.06, 0.16, 0.02),
    ]);
  }, []);

  // Superior vena cava
  const venaCavaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.09, 0.22, -0.02),
      new THREE.Vector3(0.08, 0.1, -0.02),
      new THREE.Vector3(0.06, 0.04, -0.01),
    ]);
  }, []);

  // Materials with biological specular sheen
  const muscleMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#A31D1D',
    emissive: isSelected ? '#0284C7' : (isHovered ? '#7F1D1D' : '#3B0707'),
    emissiveIntensity: isSelected ? 0.7 : 0.3,
    roughness: 0.3,
    metalness: 0.15,
  });

  const aortaMat = new THREE.MeshStandardMaterial({
    color: '#DC2626',
    roughness: 0.25,
    metalness: 0.2,
  });

  const veinMat = new THREE.MeshStandardMaterial({
    color: '#2563EB',
    roughness: 0.3,
    metalness: 0.1,
  });

  const vesselMat = new THREE.MeshStandardMaterial({
    color: '#EF4444',
    roughness: 0.2,
  });

  return (
    <group ref={groupRef} rotation={[0.1, 0.2, -0.2]}>
      {/* Ventricular Conical Apex & Main Muscle Body */}
      <mesh position={[0, -0.04, 0.02]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>
      
      {/* Left Ventricle Tapered Apex */}
      <mesh position={[-0.04, -0.12, 0.05]} rotation={[0.4, 0, -0.2]}>
        <coneGeometry args={[0.08, 0.14, 24]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Right Ventricle / Anterior Contour */}
      <mesh position={[0.05, -0.06, 0.04]} rotation={[0.1, 0.2, 0.2]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Right Atrium & Auricle */}
      <mesh position={[0.08, 0.05, 0.0]}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Left Atrium & Auricle */}
      <mesh position={[-0.07, 0.06, -0.02]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Aortic Arch Tube */}
      <mesh>
        <tubeGeometry args={[aortaCurve, 32, 0.028, 16, false]} />
        <primitive object={aortaMat} attach="material" />
      </mesh>

      {/* 3 Cephalic Aortic Branch Arteries */}
      <mesh position={[0.02, 0.22, 0.01]} rotation={[-0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.06, 12]} />
        <primitive object={aortaMat} attach="material" />
      </mesh>
      <mesh position={[0.045, 0.22, -0.01]} rotation={[-0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.007, 0.007, 0.055, 12]} />
        <primitive object={aortaMat} attach="material" />
      </mesh>
      <mesh position={[0.068, 0.21, -0.03]} rotation={[0.1, 0, -0.1]}>
        <cylinderGeometry args={[0.007, 0.007, 0.05, 12]} />
        <primitive object={aortaMat} attach="material" />
      </mesh>

      {/* Pulmonary Trunk */}
      <mesh>
        <tubeGeometry args={[pulmonaryCurve, 24, 0.024, 16, false]} />
        <primitive object={veinMat} attach="material" />
      </mesh>

      {/* Superior Vena Cava */}
      <mesh>
        <tubeGeometry args={[venaCavaCurve, 20, 0.022, 16, false]} />
        <primitive object={veinMat} attach="material" />
      </mesh>

      {/* Anterior Interventricular Coronary Artery Vessel Network */}
      <mesh position={[-0.01, -0.04, 0.14]} rotation={[0.2, 0, -0.3]}>
        <cylinderGeometry args={[0.004, 0.002, 0.16, 8]} />
        <primitive object={vesselMat} attach="material" />
      </mesh>
      <mesh position={[-0.04, -0.06, 0.13]} rotation={[0.1, 0.4, 0.6]}>
        <cylinderGeometry args={[0.003, 0.001, 0.06, 8]} />
        <primitive object={vesselMat} attach="material" />
      </mesh>
    </group>
  );
};

// 2. REALISTIC BRAIN WITH WRINKLED GYRI/SULCI, CEREBELLUM & BRAINSTEM
export const RealisticBrain = ({ isSelected, isHovered }) => {
  const brainMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#D1A3A4',
    emissive: isSelected ? '#0284C7' : (isHovered ? '#6B21A8' : '#2A1015'),
    emissiveIntensity: isSelected ? 0.7 : 0.2,
    roughness: 0.45,
    metalness: 0.05,
    flatShading: false,
  });

  const cerebellumMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#B88688',
    emissive: isSelected ? '#0284C7' : '#1F0B0E',
    roughness: 0.5,
    metalness: 0.05,
  });

  const stemMat = new THREE.MeshStandardMaterial({
    color: '#E2C2C3',
    roughness: 0.35,
  });

  return (
    <group>
      {/* Left Cerebral Hemisphere with Cortical Bulges */}
      <group position={[-0.08, 0, 0.01]}>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.13, 32, 24]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
        {/* Frontal Lobe */}
        <mesh position={[0.02, 0.04, 0.06]}>
          <sphereGeometry args={[0.085, 20, 16]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
        {/* Parietal / Occipital Lobe */}
        <mesh position={[0.01, 0.05, -0.06]}>
          <sphereGeometry args={[0.08, 20, 16]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
        {/* Temporal Lobe */}
        <mesh position={[-0.03, -0.05, 0.02]}>
          <capsuleGeometry args={[0.05, 0.08, 12, 16]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
      </group>

      {/* Right Cerebral Hemisphere */}
      <group position={[0.08, 0, 0.01]}>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.13, 32, 24]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
        {/* Frontal Lobe */}
        <mesh position={[-0.02, 0.04, 0.06]}>
          <sphereGeometry args={[0.085, 20, 16]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
        {/* Parietal / Occipital Lobe */}
        <mesh position={[-0.01, 0.05, -0.06]}>
          <sphereGeometry args={[0.08, 20, 16]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
        {/* Temporal Lobe */}
        <mesh position={[0.03, -0.05, 0.02]}>
          <capsuleGeometry args={[0.05, 0.08, 12, 16]} />
          <primitive object={brainMat} attach="material" />
        </mesh>
      </group>

      {/* Cerebellum (Horizontal Striated Lobes under Occipital) */}
      <mesh position={[-0.05, -0.09, -0.07]}>
        <sphereGeometry args={[0.065, 20, 16]} />
        <primitive object={cerebellumMat} attach="material" />
      </mesh>
      <mesh position={[0.05, -0.09, -0.07]}>
        <sphereGeometry args={[0.065, 20, 16]} />
        <primitive object={cerebellumMat} attach="material" />
      </mesh>

      {/* Brainstem (Pons & Medulla Oblongata) */}
      <mesh position={[0, -0.13, -0.03]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.022, 0.12, 16]} />
        <primitive object={stemMat} attach="material" />
      </mesh>
    </group>
  );
};

// 3. REALISTIC LUNGS WITH 3 RIGHT LOBES, 2 LEFT LOBES, CARDIAC NOTCH & TRACHEA
export const RealisticLungs = ({ isSelected, isHovered }) => {
  const lungsRef = useRef();

  useFrame((state) => {
    if (!lungsRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle breathing expansion
    const breathe = 1 + Math.sin(t * 1.6) * 0.035;
    lungsRef.current.scale.set(breathe, breathe, breathe * 1.04);
  });

  const lungMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#D47E84',
    emissive: isSelected ? '#0284C7' : (isHovered ? '#0891B2' : '#2D0F12'),
    emissiveIntensity: isSelected ? 0.7 : 0.25,
    roughness: 0.35,
    metalness: 0.08,
  });

  const airwayMat = new THREE.MeshStandardMaterial({
    color: '#E0F2FE',
    roughness: 0.3,
    metalness: 0.1,
  });

  return (
    <group ref={lungsRef}>
      {/* Trachea with segmented cartilage appearance */}
      <mesh position={[0, 0.22, 0.04]}>
        <cylinderGeometry args={[0.025, 0.025, 0.18, 16]} />
        <primitive object={airwayMat} attach="material" />
      </mesh>

      {/* Primary Bronchi Bifurcation */}
      <mesh position={[-0.045, 0.11, 0.03]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.016, 0.016, 0.09, 12]} />
        <primitive object={airwayMat} attach="material" />
      </mesh>
      <mesh position={[0.045, 0.11, 0.03]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.016, 0.016, 0.09, 12]} />
        <primitive object={airwayMat} attach="material" />
      </mesh>

      {/* RIGHT LUNG (3 Lobes: Superior, Middle, Inferior) */}
      <group position={[0.22, 0.02, 0.04]} rotation={[0, -0.15, 0.08]}>
        {/* Superior Lobe */}
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.1, 0.15, 20]} />
          <primitive object={lungMat} attach="material" />
        </mesh>
        {/* Middle Lobe */}
        <mesh position={[0.02, 0.0, 0.02]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <primitive object={lungMat} attach="material" />
        </mesh>
        {/* Inferior Base Lobe */}
        <mesh position={[0.01, -0.09, 0]}>
          <cylinderGeometry args={[0.11, 0.13, 0.14, 20]} />
          <primitive object={lungMat} attach="material" />
        </mesh>
      </group>

      {/* LEFT LUNG (2 Lobes with distinct Cardiac Notch) */}
      <group position={[-0.22, 0.02, 0.04]} rotation={[0, 0.15, -0.08]}>
        {/* Superior Lobe */}
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.095, 0.15, 20]} />
          <primitive object={lungMat} attach="material" />
        </mesh>
        {/* Inferior Lobe with Cardiac Notch Indentation */}
        <mesh position={[-0.01, -0.08, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.16, 20]} />
          <primitive object={lungMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// 4. REALISTIC LIVER WITH RIGHT/LEFT LOBES, FALCIFORM SULCUS & GALLBLADDER
export const RealisticLiver = ({ isSelected, isHovered }) => {
  const liverMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#8B2500',
    emissive: isSelected ? '#0284C7' : (isHovered ? '#B45309' : '#2D0A00'),
    emissiveIntensity: isSelected ? 0.7 : 0.3,
    roughness: 0.28,
    metalness: 0.12,
  });

  const gallMat = new THREE.MeshStandardMaterial({
    color: '#15803D',
    roughness: 0.3,
  });

  return (
    <group rotation={[0.12, -0.22, -0.15]}>
      {/* Large Right Lobe (Broad convex diaphragmatic dome) */}
      <mesh position={[0.06, 0.02, 0]}>
        <sphereGeometry args={[0.15, 32, 24]} />
        <primitive object={liverMat} attach="material" />
      </mesh>

      {/* Smaller Left Lobe Tapering Lateral */}
      <mesh position={[-0.12, -0.01, -0.02]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.11, 0.18, 20]} />
        <primitive object={liverMat} attach="material" />
      </mesh>

      {/* Inferior Visceral Gallbladder */}
      <mesh position={[0.04, -0.12, 0.06]} rotation={[0.4, 0, -0.2]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <primitive object={gallMat} attach="material" />
      </mesh>
    </group>
  );
};

// 5. REALISTIC STOMACH WITH J-CURVATURE, FUNDUS & PYLORUS
export const RealisticStomach = ({ isSelected, isHovered }) => {
  const stomachMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#C2410C',
    emissive: isSelected ? '#0284C7' : (isHovered ? '#D97706' : '#330D02'),
    emissiveIntensity: isSelected ? 0.7 : 0.28,
    roughness: 0.32,
    metalness: 0.1,
  });

  const stomachCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 0.14, 0.0),    // Cardia (Esophagus entry)
      new THREE.Vector3(-0.06, 0.16, 0.02),  // Fundus dome
      new THREE.Vector3(-0.12, 0.05, 0.04),  // Greater curvature body
      new THREE.Vector3(-0.09, -0.08, 0.03), // Inferior angle
      new THREE.Vector3(0.02, -0.09, 0.01),  // Pyloric antrum
      new THREE.Vector3(0.09, -0.05, -0.02), // Pylorus exit to duodenum
    ]);
  }, []);

  return (
    <group rotation={[0.15, 0.25, -0.3]}>
      {/* J-Curve Tubular Gastric Reservoir */}
      <mesh>
        <tubeGeometry args={[stomachCurve, 32, 0.075, 20, false]} />
        <primitive object={stomachMat} attach="material" />
      </mesh>
      {/* Fundus Superior Dome Bulb */}
      <mesh position={[-0.06, 0.14, 0.02]}>
        <sphereGeometry args={[0.085, 24, 20]} />
        <primitive object={stomachMat} attach="material" />
      </mesh>
    </group>
  );
};

// 6. REALISTIC KIDNEYS WITH RENAL HILUM, ARTERY, VEIN & URETER
export const RealisticKidneys = ({ isSelected, isHovered }) => {
  const kidneyMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#7F1D1D',
    emissive: isSelected ? '#0284C7' : (isHovered ? '#0284C7' : '#1C0404'),
    emissiveIntensity: isSelected ? 0.7 : 0.25,
    roughness: 0.28,
    metalness: 0.15,
  });

  const adrenalMat = new THREE.MeshStandardMaterial({
    color: '#D97706',
    roughness: 0.4,
  });

  const arteryMat = new THREE.MeshStandardMaterial({ color: '#DC2626' });
  const veinMat = new THREE.MeshStandardMaterial({ color: '#2563EB' });
  const ureterMat = new THREE.MeshStandardMaterial({ color: '#FEF08A' });

  return (
    <group>
      {/* Left Kidney */}
      <group position={[-0.16, 0, 0]} rotation={[0.1, 0, 0.2]}>
        {/* Kidney Bean Convex Pole */}
        <mesh>
          <capsuleGeometry args={[0.05, 0.09, 16, 20]} />
          <primitive object={kidneyMat} attach="material" />
        </mesh>
        {/* Adrenal Gland on Upper Pole */}
        <mesh position={[0, 0.09, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.035, 0.04, 12]} />
          <primitive object={adrenalMat} attach="material" />
        </mesh>
        {/* Renal Hilum Vessels */}
        <mesh position={[0.05, 0.01, 0]} rotation={[0, 0, 1.57]}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
          <primitive object={arteryMat} attach="material" />
        </mesh>
        <mesh position={[0.05, -0.01, 0.01]} rotation={[0, 0, 1.57]}>
          <cylinderGeometry args={[0.009, 0.009, 0.06, 8]} />
          <primitive object={veinMat} attach="material" />
        </mesh>
        {/* Ureter Exiting Downward */}
        <mesh position={[0.03, -0.06, -0.01]} rotation={[0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.006, 0.005, 0.12, 8]} />
          <primitive object={ureterMat} attach="material" />
        </mesh>
      </group>

      {/* Right Kidney (Slightly lower due to liver) */}
      <group position={[0.42, -0.03, 0]} rotation={[-0.1, 0, -0.2]}>
        <mesh>
          <capsuleGeometry args={[0.05, 0.09, 16, 20]} />
          <primitive object={kidneyMat} attach="material" />
        </mesh>
        {/* Adrenal Gland */}
        <mesh position={[0, 0.09, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.035, 0.04, 12]} />
          <primitive object={adrenalMat} attach="material" />
        </mesh>
        {/* Renal Hilum Vessels */}
        <mesh position={[-0.05, 0.01, 0]} rotation={[0, 0, 1.57]}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
          <primitive object={arteryMat} attach="material" />
        </mesh>
        <mesh position={[-0.05, -0.01, 0.01]} rotation={[0, 0, 1.57]}>
          <cylinderGeometry args={[0.009, 0.009, 0.06, 8]} />
          <primitive object={veinMat} attach="material" />
        </mesh>
        {/* Ureter */}
        <mesh position={[-0.03, -0.06, -0.01]} rotation={[-0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.006, 0.005, 0.12, 8]} />
          <primitive object={ureterMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// 7. REALISTIC INTESTINES (COILED SMALL BOWEL & FRAMING COLON WITH HAUSTRATIONS)
export const RealisticIntestines = ({ isSelected, isHovered, isLarge = false }) => {
  const smallMat = new THREE.MeshStandardMaterial({
    color: isSelected && !isLarge ? '#38BDF8' : '#FB923C',
    emissive: isSelected && !isLarge ? '#0284C7' : '#331300',
    emissiveIntensity: isSelected ? 0.7 : 0.2,
    roughness: 0.35,
    metalness: 0.05,
  });

  const colonMat = new THREE.MeshStandardMaterial({
    color: isSelected && isLarge ? '#38BDF8' : '#C2410C',
    emissive: isSelected && isLarge ? '#0284C7' : '#330D00',
    emissiveIntensity: isSelected ? 0.7 : 0.25,
    roughness: 0.38,
    metalness: 0.08,
  });

  // Colon perimeter arch
  const colonCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.18, -0.22, 0.04),  // Cecum
      new THREE.Vector3(0.19, 0.02, 0.05),   // Ascending colon
      new THREE.Vector3(0.16, 0.08, 0.05),   // Hepatic flexure
      new THREE.Vector3(0.0, 0.09, 0.06),    // Transverse colon
      new THREE.Vector3(-0.16, 0.08, 0.05),  // Splenic flexure
      new THREE.Vector3(-0.19, -0.08, 0.04), // Descending colon
      new THREE.Vector3(-0.14, -0.22, 0.04), // Sigmoid colon
    ]);
  }, []);

  return (
    <group>
      {/* Framing Large Intestine / Colon */}
      <mesh>
        <tubeGeometry args={[colonCurve, 32, 0.044, 16, false]} />
        <primitive object={colonMat} attach="material" />
      </mesh>

      {/* Central Convoluted Small Intestinal Loops */}
      <group position={[0, -0.06, 0.05]}>
        <mesh position={[-0.05, 0.02, 0]}>
          <torusGeometry args={[0.07, 0.03, 16, 24]} />
          <primitive object={smallMat} attach="material" />
        </mesh>
        <mesh position={[0.04, -0.03, 0.01]} rotation={[0.4, 0.3, 0]}>
          <torusGeometry args={[0.065, 0.03, 16, 24]} />
          <primitive object={smallMat} attach="material" />
        </mesh>
        <mesh position={[0, -0.07, 0.02]} rotation={[-0.3, 0.2, 0.5]}>
          <torusGeometry args={[0.06, 0.03, 16, 24]} />
          <primitive object={smallMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// 8. REALISTIC PANCREAS (HEAD NESTLED IN DUODENUM, ELONGATED BODY, TAPERING TAIL)
export const RealisticPancreas = ({ isSelected, isHovered }) => {
  const pancMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#FDE047',
    emissive: isSelected ? '#0284C7' : '#422006',
    emissiveIntensity: isSelected ? 0.7 : 0.2,
    roughness: 0.45,
    metalness: 0.05,
  });

  return (
    <group rotation={[0, 0, -0.15]}>
      {/* Pancreatic Head (C-curve) */}
      <mesh position={[0.08, -0.02, 0]} scale={[1.1, 1.4, 0.8]}>
        <sphereGeometry args={[0.045, 24, 24]} />
        <primitive object={pancMat} attach="material" />
      </mesh>
      {/* Pancreatic Body (elongated) */}
      <mesh position={[0, 0.01, 0.01]} rotation={[0, 0, 1.45]} scale={[0.8, 1.5, 0.6]}>
        <cylinderGeometry args={[0.028, 0.038, 0.14, 16]} />
        <primitive object={pancMat} attach="material" />
      </mesh>
      {/* Pancreatic Tail (tapering towards spleen) */}
      <mesh position={[-0.09, 0.03, 0.02]} scale={[0.9, 0.7, 0.5]}>
        <sphereGeometry args={[0.03, 20, 20]} />
        <primitive object={pancMat} attach="material" />
      </mesh>
    </group>
  );
};

// 9. REALISTIC BLADDER (PYRIFORM/ROUNDED HOLLOW VISCUS WITH URETERAL ENTRANCES)
export const RealisticBladder = ({ isSelected, isHovered }) => {
  const bladderMat = new THREE.MeshPhysicalMaterial({
    color: isSelected ? '#38BDF8' : '#F59E0B',
    emissive: isSelected ? '#0284C7' : '#451A03',
    emissiveIntensity: isSelected ? 0.7 : 0.2,
    roughness: 0.25,
    metalness: 0.1,
    transmission: 0.35,
    thickness: 0.5,
  });

  return (
    <group>
      <mesh scale={[1.1, 1.0, 0.95]}>
        <sphereGeometry args={[0.065, 32, 32]} />
        <primitive object={bladderMat} attach="material" />
      </mesh>
      {/* Urethral neck */}
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[0.015, 0.018, 0.04, 16]} />
        <primitive object={bladderMat} attach="material" />
      </mesh>
    </group>
  );
};

// 10. REALISTIC SPLEEN (CRESCENT / OVOID LYMPHOID ORGAN WITH GASTRIC/RENAL IMPRESSIONS)
export const RealisticSpleen = ({ isSelected, isHovered }) => {
  const spleenMat = new THREE.MeshStandardMaterial({
    color: isSelected ? '#38BDF8' : '#831843',
    emissive: isSelected ? '#0284C7' : '#4C0519',
    emissiveIntensity: isSelected ? 0.7 : 0.25,
    roughness: 0.35,
    metalness: 0.12,
  });

  return (
    <group rotation={[0.3, -0.4, 0.2]}>
      <mesh scale={[0.8, 1.4, 0.5]}>
        <sphereGeometry args={[0.055, 28, 28]} />
        <primitive object={spleenMat} attach="material" />
      </mesh>
    </group>
  );
};

