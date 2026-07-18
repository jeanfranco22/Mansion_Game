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
    <div className="absolute bottom-[max(4rem,env(safe-area-inset-bottom)+3rem)] left-1/2 max-w-[calc(100vw-2rem)] -translate-x-1/2 bg-black/28 px-3 py-2 text-center text-sm text-zinc-300 backdrop-blur">
      Press F to toggle the flashlight
    </div>
  );
}
