"use client";

import { useEffect, useRef } from "react";
import {
  playGameSound,
  setAudioMix,
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
  const masterVolume = useGameStore((state) => state.settings.masterVolume);
  const musicVolume = useGameStore((state) => state.settings.musicVolume);
  const sfxVolume = useGameStore((state) => state.settings.sfxVolume);
  const stepIndex = useRef(0);
  const randomSoundTimer = useRef<number | null>(null);

  useEffect(() => {
    setAudioMix({ masterVolume, musicVolume, sfxVolume });
  }, [masterVolume, musicVolume, sfxVolume]);

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

  useEffect(() => {
    if (!pointerLocked || gameCompleted) {
      if (randomSoundTimer.current) {
        window.clearTimeout(randomSoundTimer.current);
        randomSoundTimer.current = null;
      }
      return;
    }

    function scheduleNextSound() {
      randomSoundTimer.current = window.setTimeout(
        () => {
          const sounds = ["distantImpact", "lightFlicker"] as const;
          const sound = sounds[Math.floor(Math.random() * sounds.length)];
          playGameSound(sound, sound === "distantImpact" ? 0.22 : 0.12);
          scheduleNextSound();
        },
        9000 + Math.random() * 13000,
      );
    }

    scheduleNextSound();

    return () => {
      if (randomSoundTimer.current) {
        window.clearTimeout(randomSoundTimer.current);
        randomSoundTimer.current = null;
      }
    };
  }, [gameCompleted, pointerLocked]);

  return null;
}
