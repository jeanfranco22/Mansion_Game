import type { KeyboardControlsEntry } from "@react-three/drei";

export enum PlayerControl {
  Forward = "forward",
  Backward = "backward",
  Left = "left",
  Right = "right",
  Sprint = "sprint",
}

export const keyboardMap: KeyboardControlsEntry<PlayerControl>[] = [
  { name: PlayerControl.Forward, keys: ["KeyW", "ArrowUp"] },
  { name: PlayerControl.Backward, keys: ["KeyS", "ArrowDown"] },
  { name: PlayerControl.Left, keys: ["KeyA", "ArrowLeft"] },
  { name: PlayerControl.Right, keys: ["KeyD", "ArrowRight"] },
  { name: PlayerControl.Sprint, keys: ["ShiftLeft", "ShiftRight"] },
];
