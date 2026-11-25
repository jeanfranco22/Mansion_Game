"use client";

import { useGameStore } from "../store/useGameStore";
import { keyboardMap } from "../player/playerControls";

let lockEpoch = 0;
let pendingLockEpoch: number | null = null;
let pendingResumeAction: (() => void) | null = null;

export function resetActiveKeys() {
  if (typeof window !== "undefined") {
    for (const entry of keyboardMap)
      for (const key of entry.keys)
        window.dispatchEvent(new KeyboardEvent("keyup", { code: key, key }));
  }
  useGameStore.getState().resetMobileInput();
}
export function invalidatePointerLock() {
  ++lockEpoch;
  pendingLockEpoch = null;
  pendingResumeAction = null;
  resetActiveKeys();
  useGameStore.getState().setPointerLocked(false);
  if (document.pointerLockElement) document.exitPointerLock?.();
}

export function handlePointerLockError() {
  pendingLockEpoch = null;
  pendingResumeAction = null;
  resetActiveKeys();
  useGameStore.getState().setPointerLocked(false);
  if (useGameStore.getState().gameStatus === "playing")
    useGameStore.getState().pauseGame();
}




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
