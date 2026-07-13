import type {
  MobileInputState,
  Objective,
  ProgressionState,
  SettingsState,
  StudyRoomState,
} from "./gameStoreTypes";

export const initialObjective: Objective = "Find the corridor key";

export const initialProgression: ProgressionState = {
  hasMainKey: false,
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

export const initialStudyRoom: StudyRoomState = {
  studyDoorClosed: true,
  studyDoorInteractionDisabled: false,
  studyLightIntensity: 0.75,
};

export const initialSettings: SettingsState = {
  fullscreen: false,
  graphicsQuality: "high",
  mouseSensitivity: 1,
  masterVolume: 0.85,
  musicVolume: 0.35,
  sfxVolume: 0.85,
};

export const initialMobileInput: MobileInputState = {
  moveX: 0,
  moveY: 0,
  lookX: 0,
  lookY: 0,
  sprint: false,
};

export const playerSpawnPosition: [number, number, number] = [0, 0.95, 3];
