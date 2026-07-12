"use client";

import { playGameSound } from "../audio/gameAudio";
import type { GameSound } from "../audio/audioFiles";
import { TriggerZone } from "./TriggerZone";

type SoundTriggerProps = {
  name: string;
  sound: GameSound;
  position: [number, number, number];
  size: [number, number, number];
  volume?: number;
};

export function SoundTrigger({
  name,
  sound,
  position,
  size,
  volume = 0.45,
}: SoundTriggerProps) {
  return (
    <TriggerZone
      name={name}
      onEnter={() => playGameSound(sound, volume)}
      position={position}
      size={size}
    />
  );
}
