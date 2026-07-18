"use client";

import { useCallback } from "react";
import { playGameSound } from "../audio/gameAudio";
import { useGameStore } from "../store/useGameStore";
import { AnimatedDoor } from "./AnimatedDoor";

export function StudyDoor() {
  const closed = useGameStore((state) => state.studyRoom.studyDoorClosed);
  const interactionDisabled = useGameStore(
    (state) => state.studyRoom.studyDoorInteractionDisabled,
  );
  const setStudyDoorClosed = useGameStore((state) => state.setStudyDoorClosed);
  const handleInteract = useCallback(() => {
    const state = useGameStore.getState();

    if (
      state.studyRoom.studyDoorInteractionDisabled ||
      !state.progression.studyDoorUnlocked
    ) {
      return;
    }

    setStudyDoorClosed(!state.studyRoom.studyDoorClosed);
    playGameSound("doorOpen", 0.35);
  }, [setStudyDoorClosed]);

  return (
    <AnimatedDoor
      color="#3e281c"
      disabled={() => interactionDisabled}
      id="study-door"
      isOpen={!closed}
      onInteract={handleInteract}
      position={[1.15, 0, -8]}
      prompt={() => {
        const { progression } = useGameStore.getState();

        if (interactionDisabled) {
          return null;
        }

        return progression.studyDoorUnlocked
          ? "Presiona E para usar la puerta del estudio"
          : "La cerradura del estudio se controla desde algún lugar cercano.";
      }}
      rotationY={Math.PI / 2}
    />
  );
}
