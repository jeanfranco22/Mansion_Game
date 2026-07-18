"use client";

import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";

export function PauseController() {
  const pauseGame = useGameStore((state) => state.pauseGame);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Escape" && event.code !== "KeyP") {
        return;
      }

      const state = useGameStore.getState();

      if (state.documentContent || state.gameStatus === "settings") {
        return;
      }

      if (state.gameStatus === "playing") {
        event.preventDefault();
        document.exitPointerLock?.();
        pauseGame();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pauseGame]);

  return null;
}
