"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { playGameSound } from "../audio/gameAudio";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import type { InventoryItem } from "../store/gameStoreTypes";
import { useGameStore } from "../store/useGameStore";

type CollectibleItemProps = {
  id: string;
  item: InventoryItem;
  position: [number, number, number];
  rotationY?: number;
  color?: string;
  shape?: "box" | "cylinder" | "key";
  prompt?: string;
};

export function CollectibleItem({
  id,
  item,
  position,
  rotationY = 0,
  color = "#c7b37a",
  shape = "box",
  prompt,
}: CollectibleItemProps) {
  const groupRef = useRef<Group>(null);
  const hasItem = useGameStore((state) =>
    state.inventory.some((existing) => existing.id === item.id),
  );
  const addInventoryItem = useGameStore((state) => state.addInventoryItem);
  const activeInteractionId = useGameStore(
    (state) => state.interaction.activeInteractionId,
  );
  const isActive = activeInteractionId === id;
  const config = useMemo(
    () => ({
      enabled: () =>
        !useGameStore
          .getState()
          .inventory.some((existing) => existing.id === item.id),
      onInteract: () => {
        addInventoryItem(item);
        playGameSound("keyPickup", 0.38);
      },
      prompt: prompt ?? `Press E to pick up ${item.label.toLowerCase()}`,
    }),
    [addInventoryItem, item, prompt],
  );

  useRegisterInteraction(id, config);

  useFrame((state) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    group.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 2.2 + position[0]) * 0.025;
  });

  if (hasItem) {
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
      userData={{ interactionId: id }}
    >
      {shape === "key" ? (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.13, 0.13, 0.025]}>
            <torusGeometry args={[1, 0.16, 8, 18]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.3 : 0.08}
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
          <mesh
            position={[0.24, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            scale={[0.04, 0.38, 0.04]}
          >
            <cylinderGeometry args={[1, 1, 1, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.3 : 0.08}
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0.48, 0, 0.06]} scale={[0.08, 0.04, 0.04]}>
            <boxGeometry />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.3 : 0.08}
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
        </>
      ) : null}
      {shape === "box" ? (
        <mesh castShadow scale={[0.26, 0.09, 0.18]}>
          <boxGeometry />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 0.32 : 0.08}
            roughness={0.72}
          />
        </mesh>
      ) : null}
      {shape === "cylinder" ? (
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} scale={[0.08, 0.08, 0.32]}>
          <cylinderGeometry args={[1, 1, 1, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 0.32 : 0.08}
            metalness={0.25}
            roughness={0.48}
          />
        </mesh>
      ) : null}
    </group>
  );
}
