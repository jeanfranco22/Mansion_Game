"use client";

import { useEffect, useRef } from "react";
import { runStudyRoomEvent } from "./studyRoomEvent";
import { useGameStore } from "../store/useGameStore";

export function StudyRoomEventController() {
  const started = useGameStore((state) => state.progression.studyEventStarted);
  const completed = useGameStore((state) => state.progression.studyEventCompleted);
  const resetCounter = useGameStore((state) => state.player.resetCounter);
  const hasRun = useRef(false);

  useEffect(() => {
    hasRun.current = false;
  }, [resetCounter]);

  useEffect(() => {
    if (!started || completed || hasRun.current) {
      return;
    }

    hasRun.current = true;
    void runStudyRoomEvent({
      closeDoor: () => useGameStore.getState().setStudyDoorClosed(true),
      complete: () => useGameStore.getState().completeStudyEvent(),
      setDoorLocked: (locked) =>
        useGameStore.getState().setStudyDoorInteractionDisabled(locked),
      setLightIntensity: (intensity) =>
        useGameStore.getState().setStudyLightIntensity(intensity),
    });
  }, [completed, started]);

  return null;
}
