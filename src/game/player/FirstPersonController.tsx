"use client";

import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
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
const targetMoveVector = new Vector3();

export function FirstPersonController() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const hasAlignedCamera = useRef(false);
  const hasReportedReady = useRef(false);
  const smoothedMoveRef = useRef(new Vector3());
  const bobTimeRef = useRef(0);
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const [canUsePointerLock, setCanUsePointerLock] = useState(false);
  const [, getControls] = useKeyboardControls<PlayerControl>();
  const controlsSuspended = useGameStore(
    (state) => state.player.controlsSuspended,
  );
  const resetCounter = useGameStore((state) => state.player.resetCounter);
  const mouseSensitivity = useGameStore(
    (state) => state.settings.mouseSensitivity,
  );
  const setPointerLocked = useGameStore((state) => state.setPointerLocked);
  const setPlayerReady = useGameStore((state) => state.setPlayerReady);
  const setPlayerMovement = useGameStore((state) => state.setPlayerMovement);
  const setStamina = useGameStore((state) => state.setStamina);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const updatePointerLockAvailability = () => {
      setCanUsePointerLock(!query.matches && window.navigator.maxTouchPoints === 0);
    };

    updatePointerLockAvailability();
    query.addEventListener("change", updatePointerLockAvailability);

    return () =>
      query.removeEventListener("change", updatePointerLockAvailability);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    if (!hasReportedReady.current) {
      body.setTranslation(
        {
          x: playerSpawnPosition[0],
          y: playerSpawnPosition[1],
          z: playerSpawnPosition[2],
        },
        true,
      );
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      hasReportedReady.current = true;
      setPlayerReady();
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
  }, [resetCounter, setPlayerReady]);

  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, 0.05);
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    const controls = getControls();
    const translation = body.translation();
    const currentVelocity = body.linvel();
    const state = useGameStore.getState();
    const mobileInput = state.mobileInput;

    if (!state.pointerLocked && !controlsSuspended) {
      const lookStrength =
        Math.abs(mobileInput.lookX) + Math.abs(mobileInput.lookY);

      if (lookStrength > 0.01) {
        const activeCamera = cameraRef.current;
        activeCamera.rotation.order = "YXZ";
        activeCamera.rotation.y -=
          mobileInput.lookX *
          frameDelta *
          2.65 *
          state.settings.mouseSensitivity;
        activeCamera.rotation.x = MathUtils.clamp(
          activeCamera.rotation.x -
            mobileInput.lookY *
              frameDelta *
              1.85 *
              state.settings.mouseSensitivity,
          -1.35,
          1.35,
        );
      }
    }

    const bobSpeed = state.player.isSprinting ? 11 : 8;
    bobTimeRef.current += state.player.isMoving
      ? frameDelta * bobSpeed
      : frameDelta * 2;
    const walkingBob =
      state.player.isMoving && !state.progression.gameCompleted
        ? Math.sin(bobTimeRef.current) * (state.player.isSprinting ? 0.036 : 0.022)
        : 0;
    const breathingSway = Math.sin(bobTimeRef.current * 0.42) * 0.006;

    const activeCamera = cameraRef.current;

    activeCamera.position.set(
      translation.x,
      translation.y + CAMERA_HEIGHT_OFFSET + walkingBob + breathingSway,
      translation.z,
    );

    if (!hasAlignedCamera.current) {
      activeCamera.lookAt(0, 0.9, -2);
      hasAlignedCamera.current = true;
    }

    if (controlsSuspended || state.progression.gameCompleted) {
      smoothedMoveRef.current.set(0, 0, 0);
      body.setLinvel({ x: 0, y: currentVelocity.y, z: 0 }, true);
      setPlayerMovement(false, false);
      return;
    }

    activeCamera.getWorldDirection(forwardVector);
    forwardVector.y = 0;
    forwardVector.normalize();

    rightVector.crossVectors(forwardVector, camera.up).normalize();

    targetMoveVector.set(0, 0, 0);

    if (controls.forward) {
      targetMoveVector.add(forwardVector);
    }

    if (controls.backward) {
      targetMoveVector.sub(forwardVector);
    }

    if (controls.right) {
      targetMoveVector.add(rightVector);
    }

    if (controls.left) {
      targetMoveVector.sub(rightVector);
    }

    if (mobileInput.moveY !== 0) {
      targetMoveVector.addScaledVector(forwardVector, mobileInput.moveY);
    }

    if (mobileInput.moveX !== 0) {
      targetMoveVector.addScaledVector(rightVector, mobileInput.moveX);
    }

    const isMoving = targetMoveVector.lengthSq() > 0.001;
    const canSprint = state.player.stamina > 0;
    const isSprinting =
      isMoving && (controls.sprint || mobileInput.sprint) && canSprint;
    const targetSpeed = isSprinting ? SPRINT_SPEED : WALK_SPEED;

    if (targetMoveVector.lengthSq() > 0) {
      targetMoveVector.normalize().multiplyScalar(targetSpeed);
    }

    moveVector
      .copy(smoothedMoveRef.current)
      .lerp(targetMoveVector, Math.min(1, frameDelta * 10));
    smoothedMoveRef.current.copy(moveVector);

    if (isSprinting) {
      setStamina(state.player.stamina - STAMINA_DRAIN_PER_SECOND * frameDelta);
    } else if (state.player.stamina < 100) {
      setStamina(state.player.stamina + STAMINA_REGEN_PER_SECOND * frameDelta);
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
      {canUsePointerLock ? (
        <PointerLockControls
          onLock={() => setPointerLocked(true)}
          onUnlock={() => setPointerLocked(false)}
          pointerSpeed={mouseSensitivity}
        />
      ) : null}
    </>
  );
}
