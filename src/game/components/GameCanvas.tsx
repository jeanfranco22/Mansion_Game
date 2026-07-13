"use client";

import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
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

export function GameCanvas({ debug }: GameCanvasProps) {
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);
  const dpr: [number, number] =
    graphicsQuality === "high"
      ? [1, 2]
      : graphicsQuality === "medium"
        ? [1, 1.5]
        : [0.75, 1];
  const fogFar = graphicsQuality === "low" ? 15 : 18;

  return (
    <DebugModeProvider enabled={debug}>
      <div className="fixed inset-0 bg-[#101014]">
        <AudioController />
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows={graphicsQuality !== "low"}
            camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.55, 3] }}
            dpr={dpr}
            gl={{ antialias: graphicsQuality !== "low", powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = graphicsQuality === "high" ? 0.92 : 0.86;
            }}
            style={{ display: "block", height: "100%", width: "100%" }}
          >
            <color attach="background" args={["#101014"]} />
            <fog attach="fog" args={["#101014", 5, fogFar]} />
            <GamePhysics>
              <MansionWorld />
              <DustParticles />
              <FirstPersonController />
              <Flashlight />
              <AmbientSoundscape />
              <InteractionRaycaster />
            </GamePhysics>
          </Canvas>
        </KeyboardControls>
        <GameHud />
      </div>
    </DebugModeProvider>
  );
}
