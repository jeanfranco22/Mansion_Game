"use client";

import { useGameStore } from "../store/useGameStore";

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function requestPointerLockIfDesktop() {
  if (isCoarsePointer()) {
    return;
  }

  const canvas = document.querySelector("canvas");
  canvas?.requestPointerLock?.();
}

export async function setFullscreenMode(enabled: boolean) {
  if (enabled && !document.fullscreenElement) {
    await document.documentElement.requestFullscreen?.();
    return;
  }

  if (!enabled && document.fullscreenElement) {
    await document.exitFullscreen?.();
  }
}

export function applyPreferredFullscreen() {
  const { fullscreen } = useGameStore.getState().settings;

  if (!fullscreen || document.fullscreenElement) {
    return;
  }

  void setFullscreenMode(true).catch(() => undefined);
}

export function activateGameView() {
  applyPreferredFullscreen();
  requestPointerLockIfDesktop();
}
