"use client";

import { useCallback } from "react";
import { playGameSound } from "../audio/gameAudio";
import {
  CHAPTER_ONE_KEY,
  CHAPTER_ONE_OBJECTIVES,
  CHAPTER_ONE_ROOM,
} from "../story/story";
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
    const state = useGameStore.getState();
    const { mainRooms } = state;

    if (mainRooms[roomId].locked) {
      if (
        roomId === CHAPTER_ONE_ROOM.roomId &&
        state.hasInventoryItem(CHAPTER_ONE_KEY.id)
      ) {
        state.setRoomLocked(roomId, false);
        useGameStore.getState().setRoomDoorOpen(roomId, true);
        state.setObjective(CHAPTER_ONE_OBJECTIVES.enterRoomOne);
        playGameSound("doorOpen", 0.35);
      }

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
        const state = useGameStore.getState();
        const { mainRooms } = state;

        if (roomId === CHAPTER_ONE_ROOM.roomId) {
          if (mainRooms[roomId].locked) {
            return state.hasInventoryItem(CHAPTER_ONE_KEY.id)
              ? CHAPTER_ONE_ROOM.openPrompt
              : CHAPTER_ONE_ROOM.lockedPrompt;
          }

          return mainRooms[roomId].doorOpen
            ? CHAPTER_ONE_ROOM.closePrompt
            : CHAPTER_ONE_ROOM.openPrompt;
        }

        return mainRooms[roomId].locked
          ? lockedRoomPrompt
          : `Presiona E para usar la Habitación ${roomId.replace("room", "")}`;
      }}
      rotationY={rotationY}
    />
  );
}
