"use client";

import { useCallback } from "react";
import { playGameSound } from "../audio/gameAudio";
import type { MainRoomId } from "../store/gameStoreTypes";
import { useGameStore } from "../store/useGameStore";
import { AnimatedDoor } from "./AnimatedDoor";

type MainRoomDoorProps = {
  roomId: MainRoomId;
  position: [number, number, number];
  rotationY?: number;
};

const lockedRoomPrompt = "Esta habitación aún permanece cerrada.";

export function MainRoomDoor({
  roomId,
  position,
  rotationY = 0,
}: MainRoomDoorProps) {
  const room = useGameStore((state) => state.mainRooms[roomId]);
  const toggleRoomDoor = useGameStore((state) => state.toggleRoomDoor);
  const handleInteract = useCallback(() => {
    const { mainRooms } = useGameStore.getState();

    if (mainRooms[roomId].locked) {
      return;
    }

    toggleRoomDoor(roomId);
    playGameSound("doorOpen", 0.35);
  }, [roomId, toggleRoomDoor]);

  return (
    <AnimatedDoor
      color="#442c20"
      id={`main-room-door-${roomId}`}
      isOpen={room.doorOpen}
      onInteract={handleInteract}
      position={position}
      prompt={() => {
        const { mainRooms } = useGameStore.getState();

        return mainRooms[roomId].locked
          ? lockedRoomPrompt
          : `Press E to use ${roomId}`;
      }}
      rotationY={rotationY}
    />
  );
}
