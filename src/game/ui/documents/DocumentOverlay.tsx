"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { requestPointerLockIfDesktop } from "../browserControls";

type DocumentOverlayProps = {
  content: string;
  imageSrc?: string | null;
};

function DocumentImage({ src }: { src: string }) {
  const [available, setAvailable] = useState(true);

  if (!available) {
    return null;
  }

  return (
    <Image
      alt="Recuerdo"
      className="mb-6 max-h-[42vh] w-full object-cover"
      height={600}
      onError={() => setAvailable(false)}
      src={src}
      width={900}
    />
  );
}

export function DocumentOverlay({ content, imageSrc }: DocumentOverlayProps) {
  const closeDocument = useGameStore((state) => state.closeDocument);

  useEffect(() => {
    document.exitPointerLock?.();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "KeyE" && event.code !== "Escape") {
        return;
      }

      closeDocument();
      requestPointerLockIfDesktop();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDocument]);

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center overflow-y-auto bg-black/65 p-4 sm:p-6">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto border border-zinc-300/25 bg-[#d9cfb8] p-6 text-zinc-950 shadow-2xl sm:p-8">
        {imageSrc ? <DocumentImage key={imageSrc} src={imageSrc} /> : null}
        <p className="whitespace-pre-line text-base leading-7 sm:text-lg sm:leading-8">
          {content}
        </p>
        <button
          className="mt-8 border border-zinc-950/30 px-4 py-2 text-sm outline-none transition hover:bg-zinc-950 hover:text-zinc-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-zinc-950/35"
          onClick={() => {
            closeDocument();
            requestPointerLockIfDesktop();
          }}
          type="button"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
