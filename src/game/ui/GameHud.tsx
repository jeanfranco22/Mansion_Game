"use client";

import { useGameStore } from "../store/useGameStore";
import { CompletionScreen } from "./completion/CompletionScreen";
import { Crosshair } from "./hud/Crosshair";
import { DebugPanel } from "./hud/DebugPanel";
import { DocumentOverlay } from "./documents/DocumentOverlay";
import { FlashlightHint } from "./hud/FlashlightHint";
import { InteractionPrompt } from "./hud/InteractionPrompt";
import { InventoryPanel } from "./hud/InventoryPanel";
import { ObjectivePanel } from "./hud/ObjectivePanel";
import { StaminaBar } from "./hud/StaminaBar";

export function GameHud() {
  const documentContent = useGameStore((state) => state.documentContent);
  const gameCompleted = useGameStore((state) => state.progression.gameCompleted);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 text-zinc-100">
      <Crosshair />
      <ObjectivePanel />
      <InventoryPanel />
      <InteractionPrompt />
      <StaminaBar />
      <FlashlightHint />
      <DebugPanel />
      {documentContent ? <DocumentOverlay content={documentContent} /> : null}
      {gameCompleted ? <CompletionScreen /> : null}
    </div>
  );
}
