"use client";

import { useEffect, useRef } from "react";
import {
  playGameSound,
  setAudioMix,
  setEffectsEnabled,
  startAmbient,
  stopAllAudio,
  stopAmbient,
} from "./gameAudio";
import { useGameStore } from "../store/useGameStore";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  Object.assign(window, {
    audioDoor: () => playGameSound("doorOpen", 0.35),
    audioState: () => useGameStore.getState().gameStatus,
  });
}

export function AudioController() {
  const pointerLocked = useGameStore((state) => state.pointerLocked);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const isMoving = useGameStore((state) => state.player.isMoving);
  const isSprinting = useGameStore((state) => state.player.isSprinting);
  const gameCompleted = useGameStore((state) => state.progression.gameCompleted);
  const masterVolume = useGameStore((state) => state.settings.masterVolume);
  const musicVolume = useGameStore((state) => state.settings.musicVolume);
  const sfxVolume = useGameStore((state) => state.settings.sfxVolume);
  const stepIndex = useRef(0);
  const randomSoundTimer = useRef<number | null>(null);

  useEffect(() => {
    const sync = () => 
      setEffectsEnabled(useGameStore.getState().gameStatus === "playing")
    sync()
    const unsubscribe = useGameStore.subscribe(sync)

    return () => {
      unsubscribe()
      setEffectsEnabled(false)
    };
  }, [])

  useEffect(() => {
    setAudioMix({ masterVolume, musicVolume, sfxVolume });
  }, [masterVolume, musicVolume, sfxVolume]);

  useEffect(() => {
    if (gameStatus === "playing" && pointerLocked && !gameCompleted) {
      startAmbient();
      return;
    }

    stopAmbient();
  }, [gameCompleted, gameStatus, pointerLocked]);

  useEffect(() => {
    if (gameCompleted) {
      stopAllAudio();
    }
  }, [gameCompleted]);

  useEffect(() => {
    if (gameStatus !== "playing" || !pointerLocked || !isMoving || gameCompleted) {
      return;
    }

    const intervalMs = isSprinting ? 280 : 430;
    const interval = window.setInterval(() => {
      const sound = stepIndex.current % 2 === 0 ? "footstepWood1" : "footstepWood2";
      playGameSound(sound, isSprinting ? 0.38 : 0.28);
      stepIndex.current += 1;
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [gameCompleted, gameStatus, isMoving, isSprinting, pointerLocked]);

  useEffect(() => {
    if (gameStatus !== "playing" || !pointerLocked || gameCompleted) {
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
  }, [gameCompleted, gameStatus, pointerLocked]);

  return null;
}
