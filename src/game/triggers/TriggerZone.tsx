"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useDebugMode } from "../hooks/useDebugMode";

type TriggerZoneProps = {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  once?: boolean;
  onEnter: () => void;
};

export function TriggerZone({
  name,
  position,
  size,
  once = true,
  onEnter,
}: TriggerZoneProps) {
  const debug = useDebugMode();
  const hasActivated = useRef(false);

  return (
    <RigidBody type="fixed" colliders={false} userData={{ triggerName: name }}>
      <CuboidCollider
        args={[size[0] / 2, size[1] / 2, size[2] / 2]}
        onIntersectionEnter={() => {
          if (once && hasActivated.current) {
            return;
          }

          hasActivated.current = true;
          onEnter();
        }}
        position={position}
        sensor
      />
      {debug ? (
        <mesh position={position} scale={size}>
          <boxGeometry />
          <meshBasicMaterial color="#8cff8c" opacity={0.18} transparent wireframe />
        </mesh>
      ) : null}
    </RigidBody>
  );
}
