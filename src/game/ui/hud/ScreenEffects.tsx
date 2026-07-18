"use client";

import { useGameStore } from "../../store/useGameStore";

export function ScreenEffects() {
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);

  if (graphicsQuality === "low") {
    return null;
  }

  return (
    <>
      <div className="screen-vignette pointer-events-none absolute inset-0" />
      {graphicsQuality === "high" ? (
        <div className="screen-grain pointer-events-none absolute inset-0" />
      ) : null}
    </>
  );
}
