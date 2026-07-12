"use client";

import { useDebugMode } from "../../hooks/useDebugMode";
import { useGameStore } from "../../store/useGameStore";

export function DebugPanel() {
  const debug = useDebugMode();
  const objective = useGameStore((state) => state.objective);
  const progression = useGameStore((state) => state.progression);
  const stamina = useGameStore((state) => state.player.stamina);

  if (!debug) {
    return null;
  }

  return (
    <pre className="pointer-events-none absolute right-5 top-5 max-w-sm whitespace-pre-wrap border border-lime-300/30 bg-black/70 p-3 text-xs text-lime-200">
      {JSON.stringify({ objective, stamina: Math.round(stamina), progression }, null, 2)}
    </pre>
  );
}
