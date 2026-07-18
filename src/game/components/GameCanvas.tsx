"use client";

import { KeyboardControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, useEffect, type ReactNode } from "react";
import { ACESFilmicToneMapping } from "three";
import { AmbientSoundscape } from "../audio/AmbientSoundscape";
import { AudioController } from "../audio/AudioController";
import { DebugModeProvider } from "../hooks/useDebugMode";
import { InteractionRaycaster } from "../interactions/InteractionRaycaster";
import { GamePhysics } from "../physics/GamePhysics";
import { Flashlight } from "../player/Flashlight";
import { FirstPersonController } from "../player/FirstPersonController";
import { keyboardMap } from "../player/playerControls";
import { useGameStore } from "../store/useGameStore";
import { GameHud } from "../ui/GameHud";
import { DustParticles } from "../world/DustParticles";
import { MansionWorld } from "../world/MansionWorld";

type GameCanvasProps = {
  debug: boolean;
};

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    useGameStore
      .getState()
      .setLoadingError(error.message || "Unable to initialize the 3D renderer.");
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function AssetReadinessReporter() {
  const active = useProgress((state) => state.active);
  const errors = useProgress((state) => state.errors);
  const setAssetsReady = useGameStore((state) => state.setAssetsReady);

  useEffect(() => {
    if (!active) {
      setAssetsReady(errors.length);
    }
  }, [active, errors.length, setAssetsReady]);

  return null;
}

export function GameCanvas({ debug }: GameCanvasProps) {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);
  const hydrateSettings = useGameStore((state) => state.hydrateSettings);
  const setRendererReady = useGameStore((state) => state.setRendererReady);
  const isPlaying = gameStatus === "playing";
  const dpr: [number, number] =
    graphicsQuality === "high"
      ? [1, 1.5]
      : graphicsQuality === "medium"
        ? [0.85, 1.15]
        : [0.75, 1];
  const fogFar = graphicsQuality === "low" ? 15 : 18;

  useEffect(() => {
    hydrateSettings();
  }, [hydrateSettings]);

  return (
    <DebugModeProvider enabled={debug}>
      <div className="fixed inset-0 bg-[#101014]">
        <AudioController />
        <KeyboardControls map={keyboardMap}>
          <CanvasErrorBoundary>
            <Canvas
              frameloop={isPlaying ? "always" : "demand"}
              performance={{ debounce: 250, min: 0.65 }}
              shadows={graphicsQuality === "high"}
              camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.55, 3] }}
              dpr={dpr}
              gl={{ antialias: graphicsQuality === "high", powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.toneMapping = ACESFilmicToneMapping;
                gl.toneMappingExposure = graphicsQuality === "high" ? 0.92 : 0.9;
                setRendererReady();
              }}
              style={{ display: "block", height: "100%", width: "100%" }}
            >
              <color attach="background" args={["#101014"]} />
              <fog attach="fog" args={["#101014", 5, fogFar]} />
              <AssetReadinessReporter />
              <GamePhysics>
                <MansionWorld />
                <DustParticles />
                <FirstPersonController />
                <Flashlight />
                <AmbientSoundscape />
                <InteractionRaycaster />
              </GamePhysics>
            </Canvas>
          </CanvasErrorBoundary>
        </KeyboardControls>
        <GameHud />
      </div>
    </DebugModeProvider>
  );
}
