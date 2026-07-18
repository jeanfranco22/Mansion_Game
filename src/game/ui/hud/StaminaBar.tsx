"use client";

import { useGameStore } from "../../store/useGameStore";

export function StaminaBar() {
  const stamina = useGameStore((state) => state.player.stamina);
  const isSprinting = useGameStore((state) => state.player.isSprinting);
  const barColor =
    stamina < 25 ? "bg-red-300" : isSprinting ? "bg-amber-300" : "bg-zinc-200";

  if (!isSprinting && stamina >= 100) {
    return null;
  }

  return (
    <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom)+1rem)] left-1/2 w-48 -translate-x-1/2">
      <div className="h-2 border border-zinc-100/20 bg-black/55 shadow-xl">
        <div
          className={`h-full transition-[background-color,width] duration-150 ${barColor}`}
          style={{ width: `${stamina}%` }}
        />
      </div>
    </div>
  );
}
