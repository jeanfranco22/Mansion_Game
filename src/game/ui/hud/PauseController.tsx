"use client";

import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { activateGameView } from "../browserControls";

export function PauseController() {
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);

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
        document.exitPointerLock?.();
        pauseGame();
        return;
      }

      if (state.gameStatus === "paused") {
        resumeGame();
        activateGameView();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pauseGame, resumeGame]);

  return null;
}
