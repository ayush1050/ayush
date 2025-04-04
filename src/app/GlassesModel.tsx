// src/components/GlassesModel.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export default function GlassesModel({ landmarks, modelPath }) {
  const glassesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (glassesRef.current && landmarks?.length > 0) {
      const noseTip = landmarks[1];
      glassesRef.current.position.set(noseTip.x, noseTip.y, noseTip.z);
    }
  });

  return (
    <group ref={glassesRef}>
      <GLTFLoader key={modelPath} path={modelPath} />
    </group>
  );
}
