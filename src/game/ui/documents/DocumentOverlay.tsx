"use client";

import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";

type DocumentOverlayProps = {
  content: string;
};

function restorePointerLock() {
  const canvas = document.querySelector("canvas");
  canvas?.requestPointerLock?.();
}

export function DocumentOverlay({ content }: DocumentOverlayProps) {
  const closeDocument = useGameStore((state) => state.closeDocument);

  useEffect(() => {
    document.exitPointerLock?.();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "KeyE" && event.code !== "Escape") {
        return;
      }

      closeDocument();
      restorePointerLock();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDocument]);

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/65 p-6">
      <div className="w-full max-w-lg border border-zinc-300/25 bg-[#d9cfb8] p-8 text-zinc-950 shadow-2xl">
        <p className="whitespace-pre-line text-lg leading-8">{content}</p>
        <button
          className="mt-8 border border-zinc-950/30 px-4 py-2 text-sm transition hover:bg-zinc-950 hover:text-zinc-100"
          onClick={() => {
            closeDocument();
            restorePointerLock();
          }}
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
}
