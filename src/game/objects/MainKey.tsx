"use client";

import { useMemo } from "react";
import { playGameSound } from "../audio/gameAudio";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import { CHAPTER_ONE_KEY } from "../story/story";
import { useGameStore } from "../store/useGameStore";

type MainKeyProps = {
  available?: boolean;
  position: [number, number, number];
};

export function MainKey({ available = true, position }: MainKeyProps) {
  const hasRoomOneKey = useGameStore((state) =>
    state.inventory.some((item) => item.id === CHAPTER_ONE_KEY.id),
  );
  const collectRoomOneKey = useGameStore((state) => state.collectRoomOneKey);
  const config = useMemo(
    () => ({
      enabled: () =>
        available &&
        !useGameStore
          .getState()
          .inventory.some((item) => item.id === CHAPTER_ONE_KEY.id),
      onInteract: () => {
        collectRoomOneKey();
        playGameSound("keyPickup", 0.55);
      },
      prompt: CHAPTER_ONE_KEY.prompt,
    }),
    [available, collectRoomOneKey],
  );

  useRegisterInteraction("main-key", config);

  if (!available || hasRoomOneKey) {
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
