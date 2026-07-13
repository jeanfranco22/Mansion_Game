"use client";

import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export function FullscreenPreferenceSync() {
  const updateSettings = useGameStore((state) => state.updateSettings);

  useEffect(() => {
    function handleFullscreenChange() {
      const { fullscreen } = useGameStore.getState().settings;

      if (fullscreen && !document.fullscreenElement) {
        updateSettings({ fullscreen: false });
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [updateSettings]);

  return null;
}
