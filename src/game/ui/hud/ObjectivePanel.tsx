"use client";

import { useGameStore } from "../../store/useGameStore";

export function ObjectivePanel() {
  const objective = useGameStore((state) => state.objective);

  return (
    <div
      className="animate-objective-flash absolute left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] max-w-[min(22rem,calc(100vw-2rem))] border border-zinc-100/15 bg-black/42 px-4 py-3 text-sm shadow-2xl backdrop-blur transition duration-500"
      key={objective}
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-amber-100/70">
        Objective
      </div>
      <div className="mt-1 text-balance text-zinc-100">{objective}</div>
    </div>
  );
}
