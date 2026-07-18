"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Points } from "three";
import { BufferAttribute, BufferGeometry } from "three";
import { useGameStore } from "../store/useGameStore";

function createDustGeometry(count: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 13;
    positions[i * 3 + 1] = 0.8 + Math.random() * 1.9;
    positions[i * 3 + 2] = 5 - Math.random() * 25;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

export function DustParticles() {
  const pointsRef = useRef<Points>(null);
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);
  const count =
    graphicsQuality === "high" ? 120 : graphicsQuality === "medium" ? 45 : 0;
  const geometry = useMemo(() => createDustGeometry(count), [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const points = pointsRef.current;

    if (!points) {
      return;
    }

    points.rotation.y += delta * 0.008;
    points.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.035;
  });

  if (count === 0) {
    return null;
  }

  return (
    <points ref={pointsRef} dispose={null} geometry={geometry}>
      <pointsMaterial
        color="#d9c8a6"
        depthWrite={false}
        opacity={0.22}
        size={0.025}
        transparent
      />
    </points>
  );
}
