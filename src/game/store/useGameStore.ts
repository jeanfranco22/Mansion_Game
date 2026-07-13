import { create } from "zustand";
import {
  initialMobileInput,
  initialObjective,
  initialProgression,
  initialSettings,
  initialStudyRoom,
} from "./gameDefaults";
import type {
  GraphicsQuality,
  GameStatus,
  InteractionState,
  InventoryItem,
  InventoryItemId,
  MobileInputState,
  Objective,
  PlayerRuntimeState,
  ProgressionState,
  SettingsState,
  StudyRoomState,
} from "./gameStoreTypes";

type GameActions = {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  setPointerLocked: (pointerLocked: boolean) => void;
  setControlsSuspended: (controlsSuspended: boolean) => void;
  setPlayerMovement: (isMoving: boolean, isSprinting: boolean) => void;
  setStamina: (stamina: number) => void;
  setActiveInteraction: (id: string | null, prompt: string | null) => void;
  setMobileMove: (moveX: number, moveY: number) => void;
  setMobileLook: (lookX: number, lookY: number) => void;
  setMobileSprint: (sprint: boolean) => void;
  resetMobileInput: () => void;
  updateSettings: (settings: Partial<SettingsState>) => void;
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
  gameStatus: GameStatus;
  lastGameStatus: GameStatus;
  pointerLocked: boolean;
  flashlightEnabled: boolean;
  flashlightHintVisible: boolean;
  objective: Objective;
  documentContent: string | null;
  inventory: InventoryItem[];
  settings: SettingsState;
  mobileInput: MobileInputState;
  progression: ProgressionState;
  player: PlayerRuntimeState;
  interaction: InteractionState;
  studyRoom: StudyRoomState;
} & GameActions;

const clampStamina = (stamina: number) => Math.min(100, Math.max(0, stamina));
const SETTINGS_STORAGE_KEY = "vale-house-settings-v1";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const clampSensitivity = (value: number) => Math.min(1.8, Math.max(0.45, value));
const graphicsQualities = new Set<GraphicsQuality>(["low", "medium", "high"]);

function normalizeSettings(settings: Partial<SettingsState>) {
  const normalized: Partial<SettingsState> = {};

  if (typeof settings.fullscreen === "boolean") {
    normalized.fullscreen = settings.fullscreen;
  }

  if (
    typeof settings.graphicsQuality === "string" &&
    graphicsQualities.has(settings.graphicsQuality as GraphicsQuality)
  ) {
    normalized.graphicsQuality = settings.graphicsQuality as GraphicsQuality;
  }

  if (typeof settings.mouseSensitivity === "number") {
    normalized.mouseSensitivity = clampSensitivity(settings.mouseSensitivity);
  }

  if (typeof settings.masterVolume === "number") {
    normalized.masterVolume = clamp01(settings.masterVolume);
  }

  if (typeof settings.musicVolume === "number") {
    normalized.musicVolume = clamp01(settings.musicVolume);
  }

  if (typeof settings.sfxVolume === "number") {
    normalized.sfxVolume = clamp01(settings.sfxVolume);
  }

  return normalized;
}

function loadPersistedSettings(): SettingsState {
  if (typeof window === "undefined") {
    return initialSettings;
  }

  try {
    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return initialSettings;
    }

    return {
      ...initialSettings,
      ...normalizeSettings(JSON.parse(storedSettings) as Partial<SettingsState>),
    };
  } catch {
    return initialSettings;
  }
}

function persistSettings(settings: SettingsState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings still apply in memory if storage is unavailable.
  }
}

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
  gameStatus: "menu",
  lastGameStatus: "menu",
  pointerLocked: false,
  flashlightEnabled: false,
  flashlightHintVisible: true,
  objective: initialObjective,
  documentContent: null,
  inventory: [],
  settings: loadPersistedSettings(),
  mobileInput: initialMobileInput,
  progression: initialProgression,
  player: {
    controlsSuspended: true,
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

  startGame: () =>
    set((state) => ({
      gameStatus: "playing",
      lastGameStatus: "playing",
      player: { ...state.player, controlsSuspended: false },
    })),
  pauseGame: () =>
    set((state) =>
      state.gameStatus !== "playing"
        ? state
        : {
            gameStatus: "paused",
            lastGameStatus: "playing",
            pointerLocked: false,
            mobileInput: initialMobileInput,
            player: {
              ...state.player,
              controlsSuspended: true,
              isMoving: false,
              isSprinting: false,
            },
          },
    ),
  resumeGame: () =>
    set((state) => ({
      gameStatus: "playing",
      lastGameStatus: "playing",
      player: { ...state.player, controlsSuspended: false },
    })),
  openSettings: () =>
    set((state) => ({
      gameStatus: "settings",
      lastGameStatus: state.gameStatus === "settings" ? state.lastGameStatus : state.gameStatus,
      pointerLocked: false,
      mobileInput: initialMobileInput,
      player: {
        ...state.player,
        controlsSuspended: true,
        isMoving: false,
        isSprinting: false,
      },
    })),
  closeSettings: () =>
    set((state) => {
      const nextStatus =
        state.lastGameStatus === "playing" ||
        state.lastGameStatus === "paused" ||
        state.lastGameStatus === "victory"
          ? state.lastGameStatus
          : "menu";

      return {
        gameStatus: nextStatus,
        player: {
          ...state.player,
          controlsSuspended: nextStatus !== "playing",
        },
      };
    }),
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
    set((state) => {
      const nextStamina = clampStamina(stamina);

      if (Math.abs(state.player.stamina - nextStamina) < 0.05) {
        return state;
      }

      return {
        player: { ...state.player, stamina: nextStamina },
      };
    }),
  setActiveInteraction: (id, prompt) =>
    set((state) =>
      state.interaction.activeInteractionId === id &&
      state.interaction.activeInteractionPrompt === prompt
        ? state
        : {
            interaction: {
              activeInteractionId: id,
              activeInteractionPrompt: prompt,
            },
          },
    ),
  setMobileMove: (moveX, moveY) =>
    set((state) =>
      state.mobileInput.moveX === moveX && state.mobileInput.moveY === moveY
        ? state
        : {
            mobileInput: { ...state.mobileInput, moveX, moveY },
          },
    ),
  setMobileLook: (lookX, lookY) =>
    set((state) =>
      state.mobileInput.lookX === lookX && state.mobileInput.lookY === lookY
        ? state
        : {
            mobileInput: { ...state.mobileInput, lookX, lookY },
          },
    ),
  setMobileSprint: (sprint) =>
    set((state) =>
      state.mobileInput.sprint === sprint
        ? state
        : {
            mobileInput: { ...state.mobileInput, sprint },
          },
    ),
  resetMobileInput: () => set({ mobileInput: initialMobileInput }),
  updateSettings: (settings) =>
    set((state) => {
      const nextSettings = {
        ...state.settings,
        ...normalizeSettings(settings),
      };

      persistSettings(nextSettings);

      return { settings: nextSettings };
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
      gameStatus: "victory",
      lastGameStatus: "victory",
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
    set((state) => {
      const isPlaying = state.gameStatus === "playing";

      return {
        documentContent: null,
        player: { ...state.player, controlsSuspended: !isPlaying },
      };
    }),
  restartGame: () =>
    set((state) => ({
      gameStatus: "playing",
      lastGameStatus: "playing",
      pointerLocked: false,
      flashlightEnabled: false,
      flashlightHintVisible: true,
      objective: initialObjective,
      documentContent: null,
      inventory: [],
      mobileInput: initialMobileInput,
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
