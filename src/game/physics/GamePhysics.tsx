"use client";

import { Physics } from "@react-three/rapier";
import type { ReactNode } from "react";
import { useGameStore } from "../store/useGameStore";

type GamePhysicsProps = {
  children: ReactNode;
};

export function GamePhysics({ children }: GamePhysicsProps) {
  const gameStatus = useGameStore((state) => state.gameStatus);

  return (
    <Physics gravity={[0, -30, 0]} paused={gameStatus !== "playing"} timeStep={1 / 60}>
      {children}
    </Physics>
  );
}
