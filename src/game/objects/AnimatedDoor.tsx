"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import { StaticBox } from "../world/StaticBox";

type AnimatedDoorProps = {
  id: string;
  position: [number, number, number];
  rotationY?: number;
  isOpen: boolean;
  prompt: () => string | null;
  disabled?: () => boolean;
  onInteract: () => void;
  color?: string;
};

const openAngle = Math.PI * 0.46;

export function AnimatedDoor({
  id,
  position,
  rotationY = 0,
  isOpen,
  prompt,
  disabled,
  onInteract,
  color = "#4b2f20",
}: AnimatedDoorProps) {
  const groupRef = useRef<Group>(null);
  const config = useMemo(
    () => ({
      enabled: () => !disabled?.(),
      onInteract,
      prompt,
    }),
    [disabled, onInteract, prompt],
  );

  useRegisterInteraction(id, config);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const target = rotationY + (isOpen ? openAngle : 0);
    group.rotation.y += (target - group.rotation.y) * Math.min(1, delta * 8);
  });

  return (
    <>
      <group
        ref={groupRef}
        position={position}
        rotation={[0, rotationY, 0]}
        userData={{ interactionId: id }}
      >
        <mesh castShadow receiveShadow position={[0, 1.05, 0]} scale={[1.12, 2.1, 0.12]}>
          <boxGeometry />
          <meshStandardMaterial color={color} roughness={0.82} />
        </mesh>
        <mesh position={[0.38, 1.05, -0.08]} scale={[0.08, 0.08, 0.06]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#bca66d" roughness={0.35} />
        </mesh>
      </group>
      {!isOpen ? (
        <StaticBox
          color={color}
          position={[position[0], position[1] + 1.05, position[2]]}
          rotation={[0, rotationY, 0]}
          scale={[1.12, 2.1, 0.12]}
          visible={false}
        />
      ) : null}
    </>
  );
}
