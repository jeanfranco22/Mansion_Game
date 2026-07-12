"use client";

import { useGameStore } from "../store/useGameStore";
import { TriggerZone } from "./TriggerZone";

export function FinalRoomTrigger() {
  const enterFinalRoom = useGameStore((state) => state.enterFinalRoom);

  return (
    <TriggerZone
      name="final-room"
      onEnter={enterFinalRoom}
      position={[0, 1.15, -17]}
      size={[5.2, 2.3, 4.1]}
    />
  );
}
