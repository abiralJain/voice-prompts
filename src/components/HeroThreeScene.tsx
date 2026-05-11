"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function SignalSculpture() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        angle: (index / 34) * Math.PI * 2,
        radius: 1.35 + (index % 5) * 0.08,
        y: ((index % 7) - 3) * 0.09,
        size: 0.018 + (index % 4) * 0.006,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22;
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.08;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.8) * 0.035;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} rotation={[0.18, -0.35, 0.02]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.68, 3]} />
        <meshStandardMaterial color="#111111" roughness={0.48} metalness={0.18} />
      </mesh>

      {[0.92, 1.14, 1.36].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, index * 0.55]}>
          <torusGeometry args={[radius, 0.006, 12, 128]} />
          <meshBasicMaterial color={index === 1 ? "#1f5cff" : "#171511"} transparent opacity={index === 1 ? 0.5 : 0.18} />
        </mesh>
      ))}

      {dots.map((dot, index) => (
        <mesh
          key={`${dot.angle}-${index}`}
          position={[Math.cos(dot.angle) * dot.radius, dot.y, Math.sin(dot.angle) * dot.radius]}
        >
          <sphereGeometry args={[dot.size, 12, 12]} />
          <meshBasicMaterial color={index % 6 === 0 ? "#1f5cff" : "#171511"} transparent opacity={index % 6 === 0 ? 0.72 : 0.28} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroThreeScene() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[2.5, 3, 4]} intensity={2.2} />
        <pointLight position={[-2, -1, 2]} intensity={1.4} color="#1f5cff" />
        <SignalSculpture />
      </Canvas>
    </div>
  );
}
