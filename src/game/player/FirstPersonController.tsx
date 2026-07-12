"use client";

import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { playerSpawnPosition } from "../store/gameDefaults";
import { useGameStore } from "../store/useGameStore";
import { PlayerControl } from "./playerControls";

const WALK_SPEED = 4.2;
const SPRINT_SPEED = 6.4;
const STAMINA_DRAIN_PER_SECOND = 24;
const STAMINA_REGEN_PER_SECOND = 18;
const PLAYER_RADIUS = 0.35;
const PLAYER_HALF_HEIGHT = 0.55;
const CAMERA_HEIGHT_OFFSET = 0.62;

const forwardVector = new Vector3();
const rightVector = new Vector3();
const moveVector = new Vector3();

export function FirstPersonController() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const hasAlignedCamera = useRef(false);
  const { camera } = useThree();
  const [, getControls] = useKeyboardControls<PlayerControl>();
  const controlsSuspended = useGameStore(
    (state) => state.player.controlsSuspended,
  );
  const resetCounter = useGameStore((state) => state.player.resetCounter);
  const setPointerLocked = useGameStore((state) => state.setPointerLocked);
  const setPlayerMovement = useGameStore((state) => state.setPlayerMovement);
  const setStamina = useGameStore((state) => state.setStamina);

  useEffect(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    body.setTranslation(
      {
        x: playerSpawnPosition[0],
        y: playerSpawnPosition[1],
        z: playerSpawnPosition[2],
      },
      true,
    );
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    hasAlignedCamera.current = false;
  }, [resetCounter]);

  useFrame((_, delta) => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    const controls = getControls();
    const translation = body.translation();
    const currentVelocity = body.linvel();
    const state = useGameStore.getState();

    const walkingBob =
      state.player.isMoving && !state.progression.gameCompleted
        ? Math.sin(performance.now() * 0.0085) * (state.player.isSprinting ? 0.035 : 0.022)
        : 0;

    camera.position.set(
      translation.x,
      translation.y + CAMERA_HEIGHT_OFFSET + walkingBob,
      translation.z,
    );

    if (!hasAlignedCamera.current) {
      camera.lookAt(0, 0.9, -2);
      hasAlignedCamera.current = true;
    }

    if (controlsSuspended || state.progression.gameCompleted) {
      body.setLinvel({ x: 0, y: currentVelocity.y, z: 0 }, true);
      setPlayerMovement(false, false);
      return;
    }

    camera.getWorldDirection(forwardVector);
    forwardVector.y = 0;
    forwardVector.normalize();

    rightVector.crossVectors(forwardVector, camera.up).normalize();

    moveVector.set(0, 0, 0);

    if (controls.forward) {
      moveVector.add(forwardVector);
    }

    if (controls.backward) {
      moveVector.sub(forwardVector);
    }

    if (controls.right) {
      moveVector.add(rightVector);
    }

    if (controls.left) {
      moveVector.sub(rightVector);
    }

    const isMoving = moveVector.lengthSq() > 0;
    const canSprint = state.player.stamina > 0;
    const isSprinting = isMoving && controls.sprint && canSprint;
    const targetSpeed = isSprinting ? SPRINT_SPEED : WALK_SPEED;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(targetSpeed);
    }

    if (isSprinting) {
      setStamina(state.player.stamina - STAMINA_DRAIN_PER_SECOND * delta);
    } else if (state.player.stamina < 100) {
      setStamina(state.player.stamina + STAMINA_REGEN_PER_SECOND * delta);
    }

    setPlayerMovement(isMoving, isSprinting);

    body.setLinvel(
      {
        x: moveVector.x,
        y: currentVelocity.y,
        z: moveVector.z,
      },
      true,
    );
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        colliders={false}
        enabledRotations={[false, false, false]}
        linearDamping={0}
        position={playerSpawnPosition}
      >
        <CapsuleCollider args={[PLAYER_HALF_HEIGHT, PLAYER_RADIUS]} />
      </RigidBody>
      <PointerLockControls
        onLock={() => setPointerLocked(true)}
        onUnlock={() => setPointerLocked(false)}
      />
    </>
  );
}
