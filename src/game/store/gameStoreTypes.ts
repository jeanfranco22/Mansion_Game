export type Objective =
  | "Find the corridor key"
  | "Find the study"
  | "Restore electricity"
  | "Find the safe code"
  | "Open the office safe"
  | "Unlock the basement access"
  | "Align the escape mechanism"
  | "Unlock the corridor door"
  | "Investigate the noise in the final room"
  | "Find a way out"
  | "You escaped the mansion";

export type InventoryItemId =
  | "corridorKey"
  | "screwdriver"
  | "fuse"
  | "batteries"
  | "crowbar"
  | "basementKey"
  | "architectReport";

export type InventoryItem = {
  id: InventoryItemId;
  label: string;
};

export type MainRoomId =
  | "room1"
  | "room2"
  | "room3"
  | "room4"
  | "room5"
  | "room6"
  | "room7";

export type MainRoomState = {
  id: MainRoomId;
  locked: boolean;
  doorOpen: boolean;
};

export type MainRoomsState = Record<MainRoomId, MainRoomState>;

export type GameStatus =
  | "loading"
  | "mainMenu"
  | "playing"
  | "paused"
  | "settings"
  | "victory";

export type GraphicsQuality = "low" | "medium" | "high";

export type SettingsState = {
  mouseSensitivity: number;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  graphicsQuality: GraphicsQuality;
  fullscreen: boolean;
};

export type MobileInputState = {
  moveX: number;
  moveY: number;
  lookX: number;
  lookY: number;
  sprint: boolean;
};

export type ProgressionState = {
  hasMainKey: boolean;
  corridorDoorOpened: boolean;
  studyDoorUnlocked: boolean;
  storageLatchReleased: boolean;
  storageOpened: boolean;
  hasReadElectricalMemo: boolean;
  fuseBoxOpened: boolean;
  electricityRestored: boolean;
  bookPuzzleSolved: boolean;
  safeCodeDiscovered: boolean;
  safeOpened: boolean;
  basementDoorOpened: boolean;
  valveAligned: boolean;
  pressurePlateActive: boolean;
  escapeMechanismAligned: boolean;
  studyEventStarted: boolean;
  studyEventCompleted: boolean;
  finalRoomReached: boolean;
  gameCompleted: boolean;
};

export type LoadingState = {
  assetErrors: number;
  assetsReady: boolean;
  fatalError: string | null;
  playerReady: boolean;
  rendererReady: boolean;
  settingsHydrated: boolean;
  worldReady: boolean;
};

export type PlayerRuntimeState = {
  controlsSuspended: boolean;
  isMoving: boolean;
  isSprinting: boolean;
  stamina: number;
  resetCounter: number;
};

export type InteractionState = {
  activeInteractionId: string | null;
  activeInteractionPrompt: string | null;
};

export type StudyRoomState = {
  studyDoorClosed: boolean;
  studyDoorInteractionDisabled: boolean;
  studyLightIntensity: number;
};
