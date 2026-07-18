"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Object3D, PointLight, SpotLight, Vector3 } from "three";
import { useGameStore } from "../store/useGameStore";

const direction = new Vector3();
const flashlightTarget = new Object3D();

export function Flashlight() {
  const { camera, scene } = useThree();
  const spotlightRef = useRef<SpotLight>(null);
  const pointLightRef = useRef<PointLight>(null);
  const enabled = useGameStore((state) => state.flashlightEnabled);
  const isMoving = useGameStore((state) => state.player.isMoving);
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);
  const toggleFlashlight = useGameStore((state) => state.toggleFlashlight);

  useEffect(() => {
    scene.add(flashlightTarget);

    return () => {
      scene.remove(flashlightTarget);
    };
  }, [scene]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "KeyF") {
        return;
      }

      const state = useGameStore.getState();

      if (state.player.controlsSuspended || state.progression.gameCompleted) {
        return;
      }

      toggleFlashlight();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFlashlight]);

  useFrame((state, delta) => {
    const spotlight = spotlightRef.current;
    const pointLight = pointLightRef.current;

    if (!spotlight || !pointLight) {
      return;
    }

    camera.getWorldDirection(direction);
    const swayAmount = isMoving ? 0.035 : 0.014;
    const swayX = Math.sin(state.clock.elapsedTime * 5.2) * swayAmount;
    const swayY = Math.cos(state.clock.elapsedTime * 3.7) * swayAmount * 0.7;

    spotlight.position.copy(camera.position);
    spotlight.position.x += swayX;
    spotlight.position.y += swayY;
    flashlightTarget.position.copy(camera.position).addScaledVector(direction, 8);
    flashlightTarget.position.x += swayX * 3;
    flashlightTarget.position.y += swayY * 2;
    spotlight.target.updateMatrixWorld();
    pointLight.position.copy(camera.position);

    const qualityMultiplier =
      graphicsQuality === "high" ? 1 : graphicsQuality === "medium" ? 0.82 : 0.68;
    const spotTarget = enabled ? 7.5 * qualityMultiplier : 0;
    const pointTarget = enabled ? 0.55 * qualityMultiplier : 0;

    spotlight.intensity +=
      (spotTarget - spotlight.intensity) * Math.min(1, delta * 8);
    pointLight.intensity +=
      (pointTarget - pointLight.intensity) * Math.min(1, delta * 8);
  });

  return (
    <>
      <spotLight
        ref={spotlightRef}
        angle={0.36}
        castShadow={graphicsQuality === "high"}
        color="#fff1d0"
        decay={1.6}
        distance={graphicsQuality === "low" ? 9 : 12}
        intensity={0}
        penumbra={0.65}
        shadow-mapSize-height={graphicsQuality === "high" ? 1024 : 256}
        shadow-mapSize-width={graphicsQuality === "high" ? 1024 : 256}
        target={flashlightTarget}
      />
      <pointLight
        ref={pointLightRef}
        color="#fff0c6"
        decay={2}
        distance={3.2}
        intensity={0}
      />
    </>
  );
}
