"use client";

import { useGameStore } from "../store/useGameStore";
import { TriggerZone } from "./TriggerZone";

export function DoorCloseTrigger() {
  const setStudyDoorClosed = useGameStore((state) => state.setStudyDoorClosed);

  return (
    <TriggerZone
      name="study-door-close"
      onEnter={() => setStudyDoorClosed(true)}
      position={[3.2, 1.15, -8]}
      size={[1.4, 2.3, 2.6]}
    />
  );
}
