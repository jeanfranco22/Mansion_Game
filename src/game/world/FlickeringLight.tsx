"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { useGameStore } from "../store/useGameStore";

type FlickeringLightProps = {
  color: string;
  distance?: number;
  intensity: number;
  position: [number, number, number];
  speed?: number;
};

export function FlickeringLight({
  color,
  distance = 6,
  intensity,
  position,
  speed = 2,
}: FlickeringLightProps) {
  const lightRef = useRef<PointLight>(null);
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);
  const shadowMapSize = graphicsQuality === "high" ? 512 : 256;

  useFrame((state) => {
    const light = lightRef.current;

    if (!light) {
      return;
    }

    const pulse =
      0.9 +
      Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.07 +
      Math.sin(state.clock.elapsedTime * speed * 2.7 + position[2]) * 0.03;
    light.intensity = intensity * pulse;
  });

  return (
    <pointLight
      ref={lightRef}
      castShadow={graphicsQuality === "high"}
      color={color}
      distance={graphicsQuality === "low" ? Math.min(distance, 4.8) : distance}
      intensity={intensity}
      position={position}
      shadow-mapSize-height={shadowMapSize}
      shadow-mapSize-width={shadowMapSize}
    />
  );
}
