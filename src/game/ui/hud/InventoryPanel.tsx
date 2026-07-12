"use client";

import { useGameStore } from "../../store/useGameStore";

export function InventoryPanel() {
  const inventory = useGameStore((state) => state.inventory);

  if (inventory.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-5 right-5 max-w-xs border border-zinc-100/10 bg-black/35 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        Inventory
      </div>
      <div className="flex flex-wrap gap-2">
        {inventory.map((item) => (
          <div
            className="border border-zinc-100/15 bg-zinc-100/8 px-2 py-1 text-zinc-100"
            key={item.id}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
