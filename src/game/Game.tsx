"use client";

import { GameCanvas } from "./components/GameCanvas";

type GameProps = {
  debug?: boolean;
};

export function Game({ debug = false }: GameProps) {
  return <GameCanvas debug={debug} />;
}
