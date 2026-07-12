"use client";

import { useGameStore } from "../../store/useGameStore";

export function CompletionScreen() {
  const restartGame = useGameStore((state) => state.restartGame);

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black p-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold text-zinc-100">
          You escaped the mansion
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          The first section of Vale House is complete.
        </p>
        <button
          className="mt-8 border border-zinc-100/30 px-5 py-2 text-sm text-zinc-100 transition hover:bg-zinc-100 hover:text-zinc-950"
          onClick={restartGame}
          type="button"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
