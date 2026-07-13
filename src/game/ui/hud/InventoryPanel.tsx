"use client";

import { useGameStore } from "../../store/useGameStore";

export function InventoryPanel() {
  const inventory = useGameStore((state) => state.inventory);

  if (inventory.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] max-w-[min(22rem,calc(100vw-2rem))] border border-zinc-100/10 bg-black/38 px-3 py-2 text-xs shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        <span>Inventory</span>
        <span>{inventory.length}</span>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {inventory.map((item, index) => (
          <div
            className="animate-inventory-item border border-zinc-100/15 bg-zinc-100/8 px-2.5 py-1.5 text-zinc-100"
            key={item.id}
            style={{ animationDelay: `${index * 35}ms` }}
            title={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
