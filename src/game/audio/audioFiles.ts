export const audioFiles = {
  ambient: "/audio/ambient-room.wav",
  footstepWood1: "/audio/footstep-wood-1.wav",
  footstepWood2: "/audio/footstep-wood-2.wav",
  doorOpen: "/audio/door-open.wav",
  keyPickup: "/audio/key-pickup.wav",
  lightFlicker: "/audio/light-flicker.wav",
  distantImpact: "/audio/distant-impact.wav",
} as const;

export type GameSound = keyof typeof audioFiles;
