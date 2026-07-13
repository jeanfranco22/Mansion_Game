"use client";

import { useGameStore } from "../store/useGameStore";
import { Crosshair } from "./hud/Crosshair";
import { DebugPanel } from "./hud/DebugPanel";
import { DocumentOverlay } from "./documents/DocumentOverlay";
import { FlashlightHint } from "./hud/FlashlightHint";
import { FullscreenPreferenceSync } from "./FullscreenPreferenceSync";
import { GameMenus } from "./menus/GameMenus";
import { InteractionPrompt } from "./hud/InteractionPrompt";
import { InventoryPanel } from "./hud/InventoryPanel";
import { ObjectivePanel } from "./hud/ObjectivePanel";
import { PauseController } from "./hud/PauseController";
import { ScreenEffects } from "./hud/ScreenEffects";
import { StaminaBar } from "./hud/StaminaBar";
import { MobileControls } from "./mobile/MobileControls";

export function GameHud() {
  const documentContent = useGameStore((state) => state.documentContent);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const showHud = gameStatus === "playing";

  return (
    <div className="pointer-events-none fixed inset-0 z-10 text-zinc-100">
      <FullscreenPreferenceSync />
      <PauseController />
      <ScreenEffects />
      {showHud ? (
        <>
          <Crosshair />
          <ObjectivePanel />
          <InventoryPanel />
          <InteractionPrompt />
          <StaminaBar />
          <FlashlightHint />
        </>
      ) : null}
      <DebugPanel />
      {documentContent ? <DocumentOverlay content={documentContent} /> : null}
      <MobileControls />
      <GameMenus />
    </div>
  );
}
