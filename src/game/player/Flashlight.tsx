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

  useFrame((state) => {
    const spotlight = spotlightRef.current;

    if (!spotlight) {
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
    pointLightRef.current?.position.copy(camera.position);
  });

  if (!enabled) {
    return null;
  }

  return (
    <>
      <spotLight
        ref={spotlightRef}
        angle={0.36}
        castShadow
        color="#fff1d0"
        decay={1.6}
        distance={12}
        intensity={7.5}
        penumbra={0.65}
        target={flashlightTarget}
      />
      <pointLight
        ref={pointLightRef}
        color="#fff0c6"
        decay={2}
        distance={3.2}
        intensity={0.55}
      />
    </>
  );
}
