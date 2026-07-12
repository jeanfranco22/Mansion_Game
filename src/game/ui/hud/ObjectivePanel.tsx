"use client";

import { useGameStore } from "../../store/useGameStore";

export function ObjectivePanel() {
  const objective = useGameStore((state) => state.objective);

  return (
    <div className="absolute left-5 top-5 max-w-xs border border-zinc-100/15 bg-black/45 px-4 py-3 text-sm shadow-lg backdrop-blur">
      <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        Objective
      </div>
      <div className="mt-1 text-zinc-100">{objective}</div>
    </div>
  );
}
