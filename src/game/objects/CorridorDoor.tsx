"use client";

import { useCallback } from "react";
import { playGameSound } from "../audio/gameAudio";
import { useGameStore } from "../store/useGameStore";
import { AnimatedDoor } from "./AnimatedDoor";

export function CorridorDoor() {
  const isOpen = useGameStore((state) => state.progression.corridorDoorOpened);
  const openCorridorDoor = useGameStore((state) => state.openCorridorDoor);
  const handleInteract = useCallback(() => {
    const { progression } = useGameStore.getState();

    if (!progression.hasMainKey || progression.corridorDoorOpened) {
      return;
    }

    openCorridorDoor();
    playGameSound("doorOpen", 0.55);
  }, [openCorridorDoor]);

  return (
    <AnimatedDoor
      id="corridor-door"
      isOpen={isOpen}
      onInteract={handleInteract}
      position={[0, 0, -11.45]}
      prompt={() => {
        const { progression } = useGameStore.getState();

        if (progression.corridorDoorOpened) {
          return null;
        }

        return progression.hasMainKey
          ? "Presiona E para desbloquear la puerta del pasillo"
          : "La puerta está cerrada. Necesitas una llave.";
      }}
    />
  );
}
