import { create } from "zustand";
import {
  initialObjective,
  initialProgression,
  initialStudyRoom,
} from "./gameDefaults";
import type {
  InteractionState,
  InventoryItem,
  InventoryItemId,
  Objective,
  PlayerRuntimeState,
  ProgressionState,
  StudyRoomState,
} from "./gameStoreTypes";

type GameActions = {
  setPointerLocked: (pointerLocked: boolean) => void;
  setControlsSuspended: (controlsSuspended: boolean) => void;
  setPlayerMovement: (isMoving: boolean, isSprinting: boolean) => void;
  setStamina: (stamina: number) => void;
  setActiveInteraction: (id: string | null, prompt: string | null) => void;
  addInventoryItem: (item: InventoryItem) => void;
  hasInventoryItem: (id: InventoryItemId) => boolean;
  collectMainKey: () => void;
  openCorridorDoor: () => void;
  unlockStudyDoor: () => void;
  releaseStorageLatch: () => void;
  openStorage: () => void;
  readElectricalMemo: () => void;
  openFuseBox: () => void;
  restoreElectricity: () => void;
  solveBookPuzzle: () => void;
  discoverSafeCode: () => void;
  openSafe: () => void;
  openBasementDoor: () => void;
  alignValve: () => void;
  setPressurePlateActive: (pressurePlateActive: boolean) => void;
  alignEscapeMechanism: () => void;
  startStudyEvent: () => void;
  completeStudyEvent: () => void;
  setStudyDoorClosed: (studyDoorClosed: boolean) => void;
  setStudyDoorInteractionDisabled: (studyDoorInteractionDisabled: boolean) => void;
  setStudyLightIntensity: (studyLightIntensity: number) => void;
  enterFinalRoom: () => void;
  completeGame: () => void;
  setObjective: (objective: Objective) => void;
  toggleFlashlight: () => void;
  dismissFlashlightHint: () => void;
  openDocument: (content: string) => void;
  closeDocument: () => void;
  restartGame: () => void;
};

type GameStore = {
  pointerLocked: boolean;
  flashlightEnabled: boolean;
  flashlightHintVisible: boolean;
  objective: Objective;
  documentContent: string | null;
  inventory: InventoryItem[];
  progression: ProgressionState;
  player: PlayerRuntimeState;
  interaction: InteractionState;
  studyRoom: StudyRoomState;
} & GameActions;

const clampStamina = (stamina: number) => Math.min(100, Math.max(0, stamina));

function addUniqueInventoryItem(
  inventory: InventoryItem[],
  item: InventoryItem,
) {
  if (inventory.some((existing) => existing.id === item.id)) {
    return inventory;
  }

  return [...inventory, item];
}

export const useGameStore = create<GameStore>((set, get) => ({
  pointerLocked: false,
  flashlightEnabled: false,
  flashlightHintVisible: true,
  objective: initialObjective,
  documentContent: null,
  inventory: [],
  progression: initialProgression,
  player: {
    controlsSuspended: false,
    isMoving: false,
    isSprinting: false,
    stamina: 100,
    resetCounter: 0,
  },
  interaction: {
    activeInteractionId: null,
    activeInteractionPrompt: null,
  },
  studyRoom: initialStudyRoom,

  setPointerLocked: (pointerLocked) => set({ pointerLocked }),
  setControlsSuspended: (controlsSuspended) =>
    set((state) => ({
      player: { ...state.player, controlsSuspended },
    })),
  setPlayerMovement: (isMoving, isSprinting) =>
    set((state) => {
      if (
        state.player.isMoving === isMoving &&
        state.player.isSprinting === isSprinting
      ) {
        return state;
      }

      return {
        player: { ...state.player, isMoving, isSprinting },
      };
    }),
  setStamina: (stamina) =>
    set((state) => ({
      player: { ...state.player, stamina: clampStamina(stamina) },
    })),
  setActiveInteraction: (id, prompt) =>
    set({
      interaction: {
        activeInteractionId: id,
        activeInteractionPrompt: prompt,
      },
    }),
  addInventoryItem: (item) =>
    set((state) => ({
      inventory: addUniqueInventoryItem(state.inventory, item),
    })),
  hasInventoryItem: (id) => get().inventory.some((item) => item.id === id),

  collectMainKey: () =>
    set((state) => ({
      objective: "Unlock the corridor door",
      inventory: addUniqueInventoryItem(state.inventory, {
        id: "corridorKey",
        label: "Corridor Key",
      }),
      progression: { ...state.progression, hasMainKey: true },
    })),
  openCorridorDoor: () =>
    set((state) => ({
      objective: "Find the study",
      progression: { ...state.progression, corridorDoorOpened: true },
    })),
  unlockStudyDoor: () =>
    set((state) => ({
      objective: "Restore electricity",
      progression: { ...state.progression, studyDoorUnlocked: true },
    })),
  releaseStorageLatch: () =>
    set((state) => ({
      progression: { ...state.progression, storageLatchReleased: true },
    })),
  openStorage: () =>
    set((state) => ({
      objective: "Restore electricity",
      progression: { ...state.progression, storageOpened: true },
    })),
  readElectricalMemo: () =>
    set((state) => ({
      progression: { ...state.progression, hasReadElectricalMemo: true },
    })),
  openFuseBox: () =>
    set((state) => ({
      progression: { ...state.progression, fuseBoxOpened: true },
    })),
  restoreElectricity: () =>
    set((state) => ({
      objective: "Find the safe code",
      progression: { ...state.progression, electricityRestored: true },
    })),
  solveBookPuzzle: () =>
    set((state) => ({
      objective: "Open the office safe",
      progression: {
        ...state.progression,
        bookPuzzleSolved: true,
        safeCodeDiscovered: true,
      },
    })),
  discoverSafeCode: () =>
    set((state) => ({
      objective: "Open the office safe",
      progression: { ...state.progression, safeCodeDiscovered: true },
    })),
  openSafe: () =>
    set((state) => ({
      objective: "Unlock the basement access",
      inventory: addUniqueInventoryItem(state.inventory, {
        id: "basementKey",
        label: "Basement Key",
      }),
      progression: { ...state.progression, safeOpened: true },
    })),
  openBasementDoor: () =>
    set((state) => ({
      objective: "Align the escape mechanism",
      progression: { ...state.progression, basementDoorOpened: true },
    })),
  alignValve: () =>
    set((state) => ({
      progression: { ...state.progression, valveAligned: true },
    })),
  setPressurePlateActive: (pressurePlateActive) =>
    set((state) => ({
      progression: { ...state.progression, pressurePlateActive },
    })),
  alignEscapeMechanism: () =>
    set((state) => ({
      objective: "Find a way out",
      progression: { ...state.progression, escapeMechanismAligned: true },
    })),
  startStudyEvent: () =>
    set((state) =>
      state.progression.studyEventStarted
        ? state
        : {
            progression: { ...state.progression, studyEventStarted: true },
          },
    ),
  completeStudyEvent: () =>
    set((state) => ({
      objective: state.progression.electricityRestored
        ? "Find the safe code"
        : "Restore electricity",
      progression: { ...state.progression, studyEventCompleted: true },
    })),
  setStudyDoorClosed: (studyDoorClosed) =>
    set((state) => ({
      studyRoom: { ...state.studyRoom, studyDoorClosed },
    })),
  setStudyDoorInteractionDisabled: (studyDoorInteractionDisabled) =>
    set((state) => ({
      studyRoom: { ...state.studyRoom, studyDoorInteractionDisabled },
    })),
  setStudyLightIntensity: (studyLightIntensity) =>
    set((state) => ({
      studyRoom: { ...state.studyRoom, studyLightIntensity },
    })),
  enterFinalRoom: () =>
    set((state) => ({
      objective: state.progression.escapeMechanismAligned
        ? "Find a way out"
        : state.progression.basementDoorOpened
          ? "Align the escape mechanism"
          : state.objective,
      progression: { ...state.progression, finalRoomReached: true },
    })),
  completeGame: () =>
    set((state) => ({
      objective: "You escaped the mansion",
      progression: { ...state.progression, gameCompleted: true },
      player: {
        ...state.player,
        controlsSuspended: true,
        isMoving: false,
        isSprinting: false,
      },
    })),
  setObjective: (objective) => set({ objective }),
  toggleFlashlight: () =>
    set((state) => ({
      flashlightEnabled: !state.flashlightEnabled,
      flashlightHintVisible: false,
    })),
  dismissFlashlightHint: () => set({ flashlightHintVisible: false }),
  openDocument: (content) =>
    set((state) => ({
      documentContent: content,
      player: { ...state.player, controlsSuspended: true },
    })),
  closeDocument: () =>
    set((state) => ({
      documentContent: null,
      player: { ...state.player, controlsSuspended: false },
    })),
  restartGame: () =>
    set((state) => ({
      pointerLocked: false,
      flashlightEnabled: false,
      flashlightHintVisible: true,
      objective: initialObjective,
      documentContent: null,
      inventory: [],
      progression: initialProgression,
      interaction: { activeInteractionId: null, activeInteractionPrompt: null },
      studyRoom: initialStudyRoom,
      player: {
        controlsSuspended: false,
        isMoving: false,
        isSprinting: false,
        stamina: 100,
        resetCounter: state.player.resetCounter + 1,
      },
    })),
}));
