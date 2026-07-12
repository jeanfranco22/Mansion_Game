"use client";

import { useGameStore } from "../../store/useGameStore";

export function InteractionPrompt() {
  const prompt = useGameStore((state) => state.interaction.activeInteractionPrompt);

  if (!prompt) {
    return null;
  }

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 border border-zinc-100/15 bg-black/55 px-4 py-2 text-sm text-zinc-100 shadow-lg backdrop-blur">
      {prompt}
    </div>
  );
}
