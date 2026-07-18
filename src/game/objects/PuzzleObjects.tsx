"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import type { Group } from "three";
import { playGameSound } from "../audio/gameAudio";
import { useRegisterInteraction } from "../interactions/useRegisterInteraction";
import { useGameStore } from "../store/useGameStore";
import { StaticBox } from "../world/StaticBox";
import { AnimatedDoor } from "./AnimatedDoor";

function useIsActiveInteraction(id: string) {
  return useGameStore((state) => state.interaction.activeInteractionId === id);
}

export function HiddenWallSwitch({
  id,
  position,
  rotationY = 0,
  mode,
}: {
  id: string;
  position: [number, number, number];
  rotationY?: number;
  mode: "study" | "storage";
}) {
  const isActive = useIsActiveInteraction(id);
  const config = useMemo(
    () => ({
      enabled: () => {
        const { progression } = useGameStore.getState();
        return mode === "study"
          ? !progression.studyDoorUnlocked
          : !progression.storageLatchReleased;
      },
      onInteract: () => {
        const state = useGameStore.getState();
        if (mode === "study") {
          state.unlockStudyDoor();
        } else {
          state.releaseStorageLatch();
        }
        playGameSound("doorOpen", 0.22);
      },
      prompt:
        mode === "study"
          ? "Presiona E para pulsar el interruptor suelto"
          : "Presiona E para liberar el pestillo del almacén",
    }),
    [mode],
  );

  useRegisterInteraction(id, config);

  return (
    <group position={position} rotation={[0, rotationY, 0]} userData={{ interactionId: id }}>
      <mesh castShadow scale={[0.22, 0.08, 0.04]}>
        <boxGeometry />
        <meshStandardMaterial
          color={isActive ? "#c6b47a" : "#4d463c"}
          emissive={isActive ? "#c6b47a" : "#000000"}
          emissiveIntensity={isActive ? 0.28 : 0}
          roughness={0.86}
        />
      </mesh>
    </group>
  );
}

export function StorageDoor() {
  const storageOpened = useGameStore((state) => state.progression.storageOpened);
  const openStorage = useGameStore((state) => state.openStorage);
  const handleInteract = () => {
    const { progression } = useGameStore.getState();

    if (!progression.storageLatchReleased || progression.storageOpened) {
      return;
    }

    openStorage();
    playGameSound("doorOpen", 0.45);
  };

  return (
    <AnimatedDoor
      color="#4a3528"
      id="storage-door"
      isOpen={storageOpened}
      onInteract={handleInteract}
      position={[-1.15, 0, -6]}
      prompt={() => {
        const { progression } = useGameStore.getState();

        if (progression.storageOpened) {
          return null;
        }

        return progression.storageLatchReleased
          ? "Presiona E para abrir la puerta del almacén"
          : "La puerta del almacén está cerrada desde el otro lado.";
      }}
      rotationY={Math.PI / 2}
    />
  );
}

export function BasementAccessDoor() {
  const isOpen = useGameStore((state) => state.progression.basementDoorOpened);
  const openBasementDoor = useGameStore((state) => state.openBasementDoor);

  return (
    <AnimatedDoor
      color="#252326"
      id="basement-door"
      isOpen={isOpen}
      onInteract={() => {
        const { progression, hasInventoryItem } = useGameStore.getState();

        if (
          progression.basementDoorOpened ||
          !progression.electricityRestored ||
          !hasInventoryItem("basementKey")
        ) {
          return;
        }

        openBasementDoor();
        playGameSound("doorOpen", 0.5);
      }}
      position={[0, 0, -14.5]}
      prompt={() => {
        const { progression, hasInventoryItem } = useGameStore.getState();

        if (progression.basementDoorOpened) {
          return null;
        }

        if (!progression.electricityRestored) {
          return "La cerradura magnética no tiene energía.";
        }

        return hasInventoryItem("basementKey")
          ? "Presiona E para desbloquear el acceso al sótano"
          : "El acceso al sótano necesita una llave numerada.";
      }}
    />
  );
}

export function FuseBox() {
  const fuseBoxOpened = useGameStore((state) => state.progression.fuseBoxOpened);
  const electricityRestored = useGameStore(
    (state) => state.progression.electricityRestored,
  );
  const isActive = useIsActiveInteraction("fuse-box");
  const config = useMemo(
    () => ({
      onInteract: () => {
        const state = useGameStore.getState();

        if (!state.progression.fuseBoxOpened) {
          if (state.hasInventoryItem("screwdriver")) {
            state.openFuseBox();
            playGameSound("doorOpen", 0.25);
          }
          return;
        }

        if (!state.progression.electricityRestored && state.hasInventoryItem("fuse")) {
          state.restoreElectricity();
          playGameSound("lightFlicker", 0.55);
        }
      },
      prompt: () => {
        const state = useGameStore.getState();

        if (state.progression.electricityRestored) {
          return "El panel eléctrico vibra con energía.";
        }

        if (!state.progression.fuseBoxOpened) {
          return state.hasInventoryItem("screwdriver")
            ? "Presiona E para quitar los tornillos del panel"
            : "El panel está cerrado con tornillos.";
        }

        return state.hasInventoryItem("fuse")
          ? "Presiona E para instalar el fusible de repuesto"
          : "Hay una ranura de fusible vacía.";
      },
    }),
    [],
  );

  useRegisterInteraction("fuse-box", config);

  return (
    <group position={[-6.9, 1.35, -5.4]} rotation={[0, Math.PI / 2, 0]} userData={{ interactionId: "fuse-box" }}>
      <mesh castShadow scale={[0.68, 0.88, 0.12]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#303338"
          emissive={isActive || electricityRestored ? "#596a75" : "#000000"}
          emissiveIntensity={electricityRestored ? 0.28 : isActive ? 0.18 : 0}
          roughness={0.7}
        />
      </mesh>
      <mesh
        position={[fuseBoxOpened ? -0.42 : 0, 0, -0.08]}
        rotation={[0, fuseBoxOpened ? -0.7 : 0, 0]}
        scale={[0.5, 0.7, 0.04]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#202327" roughness={0.78} />
      </mesh>
      {electricityRestored ? (
        <pointLight color="#a9d5ff" distance={3} intensity={28} position={[0, 0.2, -0.2]} />
      ) : null}
    </group>
  );
}

type BookData = {
  id: string;
  keyName: string;
  x: number;
  color: string;
};

function PullableBook({
  book,
  index,
  sequenceRef,
  solved,
}: {
  book: BookData;
  index: number;
  sequenceRef: MutableRefObject<string[]>;
  solved: boolean;
}) {
  const config = useMemo(
    () => ({
      enabled: () => !useGameStore.getState().progression.bookPuzzleSolved,
      onInteract: () => {
        const expected = ["cuervo", "sol", "corona"];
        const nextSequence = [...sequenceRef.current, book.keyName].slice(-3);
        sequenceRef.current = nextSequence;

        if (nextSequence.every((entry, entryIndex) => entry === expected[entryIndex])) {
          useGameStore.getState().solveBookPuzzle();
          playGameSound("doorOpen", 0.32);
          return;
        }

        if (nextSequence.length === expected.length) {
          sequenceRef.current = [];
          playGameSound("lightFlicker", 0.18);
        }
      },
      prompt: `Presiona E para tirar del libro ${book.keyName}`,
    }),
    [book.keyName, sequenceRef],
  );

  useRegisterInteraction(book.id, config);

  return (
    <mesh
      castShadow
      position={[book.x, solved && index < 3 ? -0.04 : 0, -0.16]}
      scale={[0.16, 0.54, 0.14]}
      userData={{ interactionId: book.id }}
    >
      <boxGeometry />
      <meshStandardMaterial
        color={book.color}
        emissive={solved && index < 3 ? "#d3b46c" : "#000000"}
        emissiveIntensity={solved && index < 3 ? 0.2 : 0}
        roughness={0.84}
      />
    </mesh>
  );
}

export function BookOrderPuzzle() {
  const solved = useGameStore((state) => state.progression.bookPuzzleSolved);
  const sequenceRef = useRef<string[]>([]);
  const books: BookData[] = [
    { id: "book-raven", keyName: "cuervo", x: -0.42, color: "#342f4f" },
    { id: "book-sun", keyName: "sol", x: -0.14, color: "#72612d" },
    { id: "book-crown", keyName: "corona", x: 0.14, color: "#612d31" },
    { id: "book-ash", keyName: "ceniza", x: 0.42, color: "#3e463f" },
  ];

  return (
    <group position={[5.84, 1.24, -10.32]}>
      {books.map((book, index) => (
        <PullableBook
          book={book}
          index={index}
          key={book.id}
          sequenceRef={sequenceRef}
          solved={solved}
        />
      ))}
      {solved ? (
        <mesh position={[0, -0.52, -0.2]} scale={[0.46, 0.16, 0.04]}>
          <boxGeometry />
          <meshStandardMaterial color="#d8cfb9" roughness={0.85} />
        </mesh>
      ) : null}
    </group>
  );
}

export function OfficeSafe() {
  const safeOpened = useGameStore((state) => state.progression.safeOpened);
  const isActive = useIsActiveInteraction("office-safe");
  const config = useMemo(
    () => ({
      onInteract: () => {
        const state = useGameStore.getState();

        if (!state.progression.safeCodeDiscovered || state.progression.safeOpened) {
          return;
        }

        state.openSafe();
        state.addInventoryItem({
          id: "architectReport",
          label: "Reporte del arquitecto",
        });
        playGameSound("doorOpen", 0.4);
      },
      prompt: () => {
        const { progression } = useGameStore.getState();

        if (progression.safeOpened) {
          return "La caja fuerte está abierta.";
        }

        return progression.safeCodeDiscovered
          ? "Presiona E para introducir 1847 en la caja fuerte"
          : "Una caja fuerte de cuatro dígitos. El dial marca 0000.";
      },
    }),
    [],
  );

  useRegisterInteraction("office-safe", config);

  return (
    <group position={[3.0, 0.48, -9.88]} userData={{ interactionId: "office-safe" }}>
      <mesh castShadow receiveShadow scale={[0.72, 0.72, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#25282c"
          emissive={isActive ? "#5c6470" : "#000000"}
          emissiveIntensity={isActive ? 0.18 : 0}
          metalness={0.15}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[safeOpened ? -0.42 : 0, 0.02, -0.28]} rotation={[0, safeOpened ? -0.65 : 0, 0]} scale={[0.58, 0.56, 0.05]}>
        <boxGeometry />
        <meshStandardMaterial color="#1c1e22" roughness={0.45} />
      </mesh>
      <mesh position={[0.22, 0.06, -0.36]} rotation={[Math.PI / 2, 0, 0]} scale={[0.08, 0.08, 0.03]}>
        <cylinderGeometry args={[1, 1, 1, 18]} />
        <meshStandardMaterial color="#b6a269" metalness={0.35} roughness={0.32} />
      </mesh>
      {safeOpened ? (
        <mesh position={[0, -0.08, -0.5]} scale={[0.28, 0.04, 0.16]}>
          <boxGeometry />
          <meshStandardMaterial color="#d5c58e" metalness={0.32} roughness={0.38} />
        </mesh>
      ) : null}
    </group>
  );
}

export function ValveWheel() {
  const valveAligned = useGameStore((state) => state.progression.valveAligned);
  const wheelRef = useRef<Group>(null);
  const config = useMemo(
    () => ({
      enabled: () => {
        const { progression } = useGameStore.getState();
        return progression.basementDoorOpened && !progression.valveAligned;
      },
      onInteract: () => {
        useGameStore.getState().alignValve();
        playGameSound("doorOpen", 0.25);
      },
      prompt: "Presiona E para girar la válvula de presión",
    }),
    [],
  );

  useRegisterInteraction("pressure-valve", config);

  useFrame((_, delta) => {
    const wheel = wheelRef.current;

    if (!wheel || !valveAligned) {
      return;
    }

    wheel.rotation.z += delta * 5;
  });

  return (
    <group position={[-2.9, 1.28, -18.55]} rotation={[0, Math.PI / 2, 0]} userData={{ interactionId: "pressure-valve" }}>
      <group ref={wheelRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.28, 0.28, 0.035]}>
          <torusGeometry args={[1, 0.12, 10, 28]} />
          <meshStandardMaterial color="#7b2e2c" roughness={0.54} />
        </mesh>
        <mesh scale={[0.7, 0.06, 0.06]}>
          <boxGeometry />
          <meshStandardMaterial color="#7b2e2c" roughness={0.54} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.7, 0.06, 0.06]}>
          <boxGeometry />
          <meshStandardMaterial color="#7b2e2c" roughness={0.54} />
        </mesh>
      </group>
    </group>
  );
}

export function PressurePlate() {
  const pressurePlateActive = useGameStore(
    (state) => state.progression.pressurePlateActive,
  );

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider
        args={[0.62, 0.08, 0.62]}
        onIntersectionEnter={() => useGameStore.getState().setPressurePlateActive(true)}
        onIntersectionExit={() => useGameStore.getState().setPressurePlateActive(false)}
        position={[1.25, 0.05, -17.1]}
        sensor
      />
      <mesh receiveShadow position={[1.25, 0.01, -17.1]} scale={[1.24, 0.04, 1.24]}>
        <boxGeometry />
        <meshStandardMaterial
          color={pressurePlateActive ? "#606867" : "#333735"}
          emissive={pressurePlateActive ? "#8cc2a0" : "#000000"}
          emissiveIntensity={pressurePlateActive ? 0.2 : 0}
          roughness={0.82}
        />
      </mesh>
    </RigidBody>
  );
}

export function EscapeLever() {
  const mechanismAligned = useGameStore(
    (state) => state.progression.escapeMechanismAligned,
  );
  const leverRef = useRef<Group>(null);
  const config = useMemo(
    () => ({
      onInteract: () => {
        const state = useGameStore.getState();

        if (
          state.progression.escapeMechanismAligned ||
          !state.progression.valveAligned ||
          !state.progression.pressurePlateActive
        ) {
          return;
        }

        state.alignEscapeMechanism();
        playGameSound("distantImpact", 0.52);
      },
      prompt: () => {
        const { progression } = useGameStore.getState();

        if (progression.escapeMechanismAligned) {
          return "El seguro de la salida está desactivado.";
        }

        if (!progression.valveAligned) {
          return "El medidor de presión está en cero.";
        }

        return progression.pressurePlateActive
          ? "Presiona E para tirar de la palanca de escape"
          : "La palanca necesita peso sobre la placa del suelo.";
      },
    }),
    [],
  );

  useRegisterInteraction("escape-lever", config);

  useFrame((_, delta) => {
    const lever = leverRef.current;

    if (!lever) {
      return;
    }

    const target = mechanismAligned ? -0.9 : 0.28;
    lever.rotation.x += (target - lever.rotation.x) * Math.min(1, delta * 8);
  });

  return (
    <group position={[2.88, 1.18, -18.3]} rotation={[0, -Math.PI / 2, 0]} userData={{ interactionId: "escape-lever" }}>
      <StaticBox color="#2b2f34" collider={false} position={[0, 0, 0]} scale={[0.44, 0.62, 0.12]} />
      <group ref={leverRef} position={[0, 0.12, -0.12]}>
        <mesh scale={[0.06, 0.52, 0.06]}>
          <boxGeometry />
          <meshStandardMaterial color="#72634a" metalness={0.25} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.34, 0]} scale={[0.13, 0.13, 0.13]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#8a2f2d" roughness={0.45} />
        </mesh>
      </group>
    </group>
  );
}
