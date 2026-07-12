"use client";

import { Physics } from "@react-three/rapier";
import type { ReactNode } from "react";

type GamePhysicsProps = {
  children: ReactNode;
};

export function GamePhysics({ children }: GamePhysicsProps) {
  return (
    <Physics gravity={[0, -30, 0]} timeStep="vary">
      {children}
    </Physics>
  );
}
