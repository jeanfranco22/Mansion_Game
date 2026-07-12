"use client";

import { useEffect, useRef } from "react";
import {
  playGameSound,
  startAmbient,
  stopAllAudio,
  stopAmbient,
} from "./gameAudio";
import { useGameStore } from "../store/useGameStore";

export function AudioController() {
  const pointerLocked = useGameStore((state) => state.pointerLocked);
  const isMoving = useGameStore((state) => state.player.isMoving);
  const isSprinting = useGameStore((state) => state.player.isSprinting);
  const gameCompleted = useGameStore((state) => state.progression.gameCompleted);
  const stepIndex = useRef(0);

  useEffect(() => {
    if (pointerLocked && !gameCompleted) {
      startAmbient();
      return;
    }

    stopAmbient();
  }, [gameCompleted, pointerLocked]);

  useEffect(() => {
    if (gameCompleted) {
      stopAllAudio();
    }
  }, [gameCompleted]);

  useEffect(() => {
    if (!pointerLocked || !isMoving || gameCompleted) {
      return;
    }

    const intervalMs = isSprinting ? 280 : 430;
    const interval = window.setInterval(() => {
      const sound = stepIndex.current % 2 === 0 ? "footstepWood1" : "footstepWood2";
      playGameSound(sound, isSprinting ? 0.38 : 0.28);
      stepIndex.current += 1;
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [gameCompleted, isMoving, isSprinting, pointerLocked]);

  return null;
}
