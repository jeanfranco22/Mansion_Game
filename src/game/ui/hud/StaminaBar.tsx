"use client";

import { useGameStore } from "../../store/useGameStore";

export function StaminaBar() {
  const stamina = useGameStore((state) => state.player.stamina);
  const isSprinting = useGameStore((state) => state.player.isSprinting);

  if (!isSprinting && stamina >= 100) {
    return null;
  }

  return (
    <div className="absolute bottom-8 left-1/2 w-48 -translate-x-1/2">
      <div className="h-2 border border-zinc-100/20 bg-black/55">
        <div
          className="h-full bg-amber-300 transition-[width]"
          style={{ width: `${stamina}%` }}
        />
      </div>
    </div>
  );
}
