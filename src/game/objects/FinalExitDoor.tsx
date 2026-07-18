"use client";

import { useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { AnimatedDoor } from "./AnimatedDoor";

export function FinalExitDoor() {
  const gameCompleted = useGameStore((state) => state.progression.gameCompleted);
  const completeGame = useGameStore((state) => state.completeGame);
  const handleInteract = useCallback(() => {
    const { progression } = useGameStore.getState();
    const canExit =
      progression.basementDoorOpened &&
      progression.escapeMechanismAligned &&
      progression.finalRoomReached;

    if (!canExit) {
      return;
    }

    completeGame();
    document.exitPointerLock?.();
  }, [completeGame]);

  return (
    <AnimatedDoor
      color="#2a201b"
      id="final-exit-door"
      isOpen={gameCompleted}
      onInteract={handleInteract}
      position={[0, 0, -19.45]}
      prompt={() => {
        const { progression } = useGameStore.getState();
        const canExit =
          progression.basementDoorOpened &&
          progression.escapeMechanismAligned &&
          progression.finalRoomReached;

        return canExit
          ? "Presiona E para salir"
          : "El seguro de la salida sigue activado.";
      }}
    />
  );
}
