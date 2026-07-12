export const audioFiles = {
  ambient: "/audio/ambient-room.mp3",
  footstepWood1: "/audio/footstep-wood-1.mp3",
  footstepWood2: "/audio/footstep-wood-2.mp3",
  doorOpen: "/audio/door-open.mp3",
  keyPickup: "/audio/key-pickup.mp3",
  lightFlicker: "/audio/light-flicker.mp3",
  distantImpact: "/audio/distant-impact.mp3",
} as const;

export type GameSound = keyof typeof audioFiles;
