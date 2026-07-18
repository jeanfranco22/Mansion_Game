"use client";

import { useMemo } from "react";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import { useGameStore } from "../store/useGameStore";

type ReadableNoteProps = {
  id?: string;
  content?: string;
  onRead?: () => void;
  position: [number, number, number];
  rotationY?: number;
  prompt?: string;
};

const noteText =
  "Hay una nota sin texto definido.";

export function ReadableNote({
  id = "study-note",
  content = noteText,
  onRead,
  position,
  rotationY = 0,
  prompt = "Presiona E para leer la nota",
}: ReadableNoteProps) {
  const openDocument = useGameStore((state) => state.openDocument);
  const config = useMemo(
    () => ({
      onInteract: () => {
        onRead?.();
        openDocument(content);
      },
      prompt,
    }),
    [content, onRead, openDocument, prompt],
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
