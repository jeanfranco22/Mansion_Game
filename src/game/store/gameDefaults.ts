import type { Objective, ProgressionState, StudyRoomState } from "./gameStoreTypes";

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

export const playerSpawnPosition: [number, number, number] = [0, 0.95, 3];
