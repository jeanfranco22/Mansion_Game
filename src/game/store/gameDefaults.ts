import type {
  LoadingState,
  MainRoomsState,
  MobileInputState,
  Objective,
  ProgressionState,
  SettingsState,
  StudyRoomState,
} from "./gameStoreTypes";

export const initialObjective: Objective = "Explora la mansión.";

export const initialProgression: ProgressionState = {
  hasMainKey: false,
  storyNotesRead: {},
  corridorDoorOpened: false,
  studyDoorUnlocked: false,
  storageLatchReleased: false,
  storageOpened: false,
  hasReadElectricalMemo: false,
  fuseBoxOpened: false,
  electricityRestored: false,
  bookPuzzleSolved: false,
  safeCodeDiscovered: false,
  safeOpened: false,
  basementDoorOpened: false,
  valveAligned: false,
  pressurePlateActive: false,
  escapeMechanismAligned: false,
  studyEventStarted: false,
  studyEventCompleted: false,
  finalRoomReached: false,
  gameCompleted: false,
};

export const initialMainRooms: MainRoomsState = {
  room1: { id: "room1", locked: true, doorOpen: false },
  room2: { id: "room2", locked: true, doorOpen: false },
  room3: { id: "room3", locked: true, doorOpen: false },
  room4: { id: "room4", locked: true, doorOpen: false },
  room5: { id: "room5", locked: true, doorOpen: false },
  room6: { id: "room6", locked: true, doorOpen: false },
  room7: { id: "room7", locked: true, doorOpen: false },
};

export const initialStudyRoom: StudyRoomState = {
  studyDoorClosed: true,
  studyDoorInteractionDisabled: false,
  studyLightIntensity: 0.75,
};

export const initialSettings: SettingsState = {
  fullscreen: false,
  graphicsQuality: "medium",
  mouseSensitivity: 1,
  masterVolume: 0.85,
  musicVolume: 0.35,
  sfxVolume: 0.85,
};

export const initialLoading: LoadingState = {
  assetErrors: 0,
  assetsReady: false,
  fatalError: null,
  playerReady: false,
  rendererReady: false,
  settingsHydrated: false,
  worldReady: false,
};

export const initialMobileInput: MobileInputState = {
  moveX: 0,
  moveY: 0,
  lookX: 0,
  lookY: 0,
  sprint: false,
};

export const playerSpawnPosition: [number, number, number] = [0, 1.05, 3];
