export type Objective =
  | "Explora la mansión."
  | "Encuentra una pista."
  | "Sigue las notas."
  | "Busca la llave."
  | "Abre la primera habitación."
  | "Entra a la primera habitación."
  | "Encuentra el estudio."
  | "Restaura la electricidad."
  | "Encuentra el código de la caja fuerte."
  | "Abre la caja fuerte del despacho."
  | "Desbloquea el acceso al sótano."
  | "Alinea el mecanismo de escape."
  | "Desbloquea la puerta del pasillo."
  | "Investiga el ruido en la sala final."
  | "Encuentra una salida."
  | "Escapaste de la mansión.";

export type InventoryItemId =
  | "corridorKey"
  | "room1Key"
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
  storyNotesRead: Partial<Record<string, boolean>>;
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
