"use client";

import { useGameStore } from "../../store/useGameStore";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";

function getPromptAction(prompt: string) {
  return prompt
    .replace(/^Press E to /, "")
    .replace(/^Presiona E para /, "");
}

export function InteractionPrompt() {
  const prompt = useGameStore((state) => state.interaction.activeInteractionPrompt);
  const isTouch = useIsTouchDevice();

  if (!prompt) {
    return null;
  }

  return (
    <div className="absolute bottom-[calc(max(5.75rem,env(safe-area-inset-bottom)+5rem))] left-1/2 max-w-[calc(100vw-2rem)] -translate-x-1/2 border border-amber-100/25 bg-black/62 px-4 py-3 text-sm text-zinc-100 shadow-2xl backdrop-blur transition duration-200 md:bottom-24">
      <span className="mr-3 inline-flex h-6 min-w-6 items-center justify-center border border-zinc-100/20 bg-zinc-100/10 px-1.5 text-[11px] text-amber-100">
        {isTouch ? "Usar" : "E"}
      </span>
      <span>{getPromptAction(prompt)}</span>
    </div>
  );
}
