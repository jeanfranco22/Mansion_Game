"use client";

import { useGameStore } from "../../store/useGameStore";

export function Crosshair() {
  const controlsSuspended = useGameStore(
    (state) => state.player.controlsSuspended,
  );

  if (controlsSuspended) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-zinc-100/80" />
      <div className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-zinc-100/80" />
      <div className="absolute left-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-zinc-100/80" />
      <div className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-zinc-100/80" />
    </div>
  );
}
