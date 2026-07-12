"use client";

import { useMemo } from "react";
import { playGameSound } from "../audio/gameAudio";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import { useGameStore } from "../store/useGameStore";

type MainKeyProps = {
  position: [number, number, number];
};

export function MainKey({ position }: MainKeyProps) {
  const hasMainKey = useGameStore((state) => state.progression.hasMainKey);
  const collectMainKey = useGameStore((state) => state.collectMainKey);
  const config = useMemo(
    () => ({
      enabled: () => !useGameStore.getState().progression.hasMainKey,
      onInteract: () => {
        collectMainKey();
        playGameSound("keyPickup", 0.55);
      },
      prompt: "Press E to pick up the key",
    }),
    [collectMainKey],
  );

  useRegisterInteraction("main-key", config);

  if (hasMainKey) {
    return null;
  }

  return (
    <group position={position} userData={{ interactionId: "main-key" }}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.13, 0.13, 0.025]}>
        <torusGeometry args={[1, 0.16, 8, 18]} />
        <meshStandardMaterial color="#d9b865" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.04, 0.38, 0.04]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color="#d9b865" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.48, 0, 0.06]} scale={[0.08, 0.04, 0.04]}>
        <boxGeometry />
        <meshStandardMaterial color="#d9b865" metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
}
