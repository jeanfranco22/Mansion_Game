"use client";

import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";

export function FlashlightHint() {
  const pointerLocked = useGameStore((state) => state.pointerLocked);
  const visible = useGameStore((state) => state.flashlightHintVisible);
  const dismissFlashlightHint = useGameStore(
    (state) => state.dismissFlashlightHint,
  );

  useEffect(() => {
    if (!pointerLocked || !visible) {
      return;
    }

    const timeout = window.setTimeout(dismissFlashlightHint, 4500);
    return () => window.clearTimeout(timeout);
  }, [dismissFlashlightHint, pointerLocked, visible]);

  if (!pointerLocked || !visible) {
    return null;
  }

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-sm text-zinc-300">
      Press F to toggle the flashlight
    </div>
  );
}
