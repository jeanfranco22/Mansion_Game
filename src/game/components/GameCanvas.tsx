"use client";

import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AmbientSoundscape } from "../audio/AmbientSoundscape";
import { AudioController } from "../audio/AudioController";
import { DebugModeProvider } from "../hooks/useDebugMode";
import { InteractionRaycaster } from "../interactions/InteractionRaycaster";
import { GamePhysics } from "../physics/GamePhysics";
import { Flashlight } from "../player/Flashlight";
import { FirstPersonController } from "../player/FirstPersonController";
import { keyboardMap } from "../player/playerControls";
import { GameHud } from "../ui/GameHud";
import { MansionWorld } from "../world/MansionWorld";

type GameCanvasProps = {
  debug: boolean;
};

export function GameCanvas({ debug }: GameCanvasProps) {
  return (
    <DebugModeProvider enabled={debug}>
      <div className="fixed inset-0 bg-[#101014]">
        <AudioController />
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.55, 3] }}
            dpr={[1, 2]}
            gl={{ antialias: true }}
            style={{ display: "block", height: "100%", width: "100%" }}
          >
            <color attach="background" args={["#101014"]} />
            <fog attach="fog" args={["#101014", 5, 18]} />
            <GamePhysics>
              <MansionWorld />
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
