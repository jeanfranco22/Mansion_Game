"use client";

import { useGameStore } from "../store/useGameStore";

function isCoarsePointer() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches ||
      window.navigator.maxTouchPoints > 0)
  );
}

export function requestPointerLockIfDesktop() {
  if (typeof document === "undefined" || isCoarsePointer()) {
    return;
  }

  const canvas = document.querySelector("canvas");
  if (!canvas?.requestPointerLock) {
    return;
  }

  try {
    void Promise.resolve(canvas.requestPointerLock()).catch(() => undefined);
  } catch {
    // Pointer lock is optional; gameplay must continue if the browser rejects it.
  }
}

export async function setFullscreenMode(enabled: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  if (enabled && !document.fullscreenElement) {
    await document.documentElement.requestFullscreen?.();
    return;
  }

  if (!enabled && document.fullscreenElement) {
    await document.exitFullscreen?.();
  }
}

export function requestPreferredFullscreen() {
  const { fullscreen } = useGameStore.getState().settings;

  if (!fullscreen || document.fullscreenElement) {
    return;
  }

  void setFullscreenMode(true).catch(() => undefined);
}

export function prepareGameViewFromUserAction() {
  requestPreferredFullscreen();
  requestPointerLockIfDesktop();
}
