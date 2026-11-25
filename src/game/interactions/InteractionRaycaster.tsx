"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Object3D, Raycaster, Vector2 } from "three";
import {
  getInteraction,
  getInteractionPrompt,
  triggerInteraction,
} from "./interactionRegistry";
import { useGameStore } from "../store/useGameStore";

const interactionRaycaster = new Raycaster();
const screenCenter = new Vector2(0, 0);
const INTERACTION_DISTANCE = 2.6;

function findInteractableId(object: Object3D): string | null {
  let current: Object3D | null = object;

  while (current) {
    const id = current.userData.interactionId;

    if (typeof id === "string") {
      return id;
    }

    current = current.parent;
  }

  return null;
}

export function InteractionRaycaster() {
  const { camera, scene } = useThree();
  const gameStatus = useGameStore((state) => state.gameStatus);
  const controlsSuspended = useGameStore(
    (state) => state.player.controlsSuspended,
  );
  const setActiveInteraction = useGameStore(
    (state) => state.setActiveInteraction,
  );

  useEffect(() => {
    function handleInteract(event: KeyboardEvent) {
      if (event.code !== "KeyE") {
        return;
      }

      const { activeInteractionId } = useGameStore.getState().interaction;

      if (!activeInteractionId) {
        return;
      }

      triggerInteraction(activeInteractionId);
    }

    window.addEventListener("keydown", handleInteract);
    return () => window.removeEventListener("keydown", handleInteract);
  }, []);

  useFrame(() => {
    if (gameStatus !== "playing" || controlsSuspended) {
      setActiveInteraction(null, null);
      return;
    }

    interactionRaycaster.setFromCamera(screenCenter, camera);
    interactionRaycaster.far = INTERACTION_DISTANCE;

    const hits = interactionRaycaster.intersectObjects(scene.children, true);

    for (const hit of hits) {
      const id = findInteractableId(hit.object);

      if (!id) {
        continue;
      }

      const interaction = getInteraction(id);
      const prompt = interaction ? getInteractionPrompt(interaction) : null;

      if (interaction && interaction.enabled?.() !== false && prompt) {
        setActiveInteraction(id, prompt);
        return;
      }
    }

    setActiveInteraction(null, null);
  });

  return null;
}
