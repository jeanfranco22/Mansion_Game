"use client";

import { useGameStore } from "../store/useGameStore";
import { TriggerZone } from "./TriggerZone";

export function LightFlickerTrigger() {
  const startStudyEvent = useGameStore((state) => state.startStudyEvent);

  return (
    <TriggerZone
      name="study-event"
      onEnter={startStudyEvent}
      position={[4.25, 1.15, -8]}
      size={[3.6, 2.3, 3.2]}
    />
  );
}
