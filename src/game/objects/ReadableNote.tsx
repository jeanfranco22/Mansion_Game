"use client";

import { useMemo } from "react";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import { useGameStore } from "../store/useGameStore";

type ReadableNoteProps = {
  id?: string;
  content?: string;
  position: [number, number, number];
  rotationY?: number;
  prompt?: string;
};

const noteText =
  "Something is moving behind the walls. The front door is not the only way out.";

export function ReadableNote({
  id = "study-note",
  content = noteText,
  position,
  rotationY = 0,
  prompt = "Press E to read the note",
}: ReadableNoteProps) {
  const openDocument = useGameStore((state) => state.openDocument);
  const config = useMemo(
    () => ({
      onInteract: () => openDocument(content),
      prompt,
    }),
    [content, openDocument, prompt],
  );

  useRegisterInteraction(id, config);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, rotationY]}
      scale={[0.42, 0.28, 0.02]}
      userData={{ interactionId: id }}
    >
      <boxGeometry />
      <meshStandardMaterial color="#d9cfb8" roughness={0.9} />
    </mesh>
  );
}
