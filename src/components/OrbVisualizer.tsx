"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

export type OrbVisualizerState = "idle" | "listening" | "thinking";

interface AnimatedOrbProps {
  volume: number;
  state: OrbVisualizerState;
}

function AnimatedOrb({ volume, state }: AnimatedOrbProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const rotMul = state === "thinking" ? 0.45 : state === "listening" ? 0.28 : 0.18;
    m.rotation.x += delta * rotMul;
    m.rotation.y += delta * (rotMul * 1.25);

    const breath = state === "idle" ? 1 + Math.sin(performance.now() * 0.002) * 0.04 : 1;
    const thinkPulse = state === "thinking" ? 1 + Math.sin(performance.now() * 0.004) * 0.06 : 0;
    m.scale.setScalar(breath + thinkPulse);
  });

  const baseDistort =
    state === "thinking" ? 0.26 : state === "listening" ? 0.16 + volume * 0.08 : 0.12;
  const distort = baseDistort + (state === "listening" ? volume * 0.62 : volume * 0.12);
  const speed =
    state === "thinking" ? 2.4 : state === "listening" ? 2.2 + volume * 7 : 1.15;

  return (
    <Sphere ref={meshRef} args={[1, 72, 72]}>
      <MeshDistortMaterial
        color="#7B6CF0"
        emissive="#4C3D99"
        emissiveIntensity={0.18}
        roughness={0.12}
        metalness={0.82}
        distort={distort}
        speed={speed}
      />
    </Sphere>
  );
}

interface OrbVisualizerProps {
  volume: number;
  state: OrbVisualizerState;
  className?: string;
}

export default function OrbVisualizer({ volume, state, className = "" }: OrbVisualizerProps) {
  return (
    <div
      className={`relative mx-auto rounded-full bg-[#F2F0ED] p-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.07)] ${className}`}
      style={{
        width: "clamp(150px, 40vw, 200px)",
        height: "clamp(150px, 40vw, 200px)",
        boxShadow:
          "inset 0 2px 10px rgba(0,0,0,0.07), 0 0 40px rgba(108, 92, 231, 0.18), 0 8px 32px rgba(108, 92, 231, 0.08)",
      }}
    >
      <div className="h-full w-full overflow-hidden rounded-full bg-[#FAFAFA]">
        <Canvas
          camera={{ position: [0, 0, 2.45], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#FAFAFA"]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 3, 6]} intensity={1.15} />
          <directionalLight position={[-4, -2, 4]} intensity={0.35} color="#a5b4fc" />
          <Suspense fallback={null}>
            <AnimatedOrb volume={volume} state={state} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
