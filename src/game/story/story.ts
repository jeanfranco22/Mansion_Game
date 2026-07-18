import type { InventoryItem, MainRoomId, Objective } from "../store/gameStoreTypes";

export const STORY_NOTES = {
  note1: "NOTA TEMPORAL 1",
  note2: "NOTA TEMPORAL 2",
  note3: "NOTA TEMPORAL 3",
} as const;

export type StoryNoteId = keyof typeof STORY_NOTES;

export type StoryNoteConfig = {
  id: StoryNoteId;
  content: string;
  prompt: string;
  position: [number, number, number];
  rotationY?: number;
};

export const STORY_NOTE_ORDER: StoryNoteId[] = ["note1", "note2", "note3"];

export const CHAPTER_ONE_OBJECTIVES = {
  explore: "Explora la mansión.",
  findClue: "Encuentra una pista.",
  followNotes: "Sigue las notas.",
  findKey: "Busca la llave.",
  openRoomOne: "Abre la primera habitación.",
  enterRoomOne: "Entra a la primera habitación.",
} as const satisfies Record<string, Objective>;

export const CHAPTER_ONE_KEY: InventoryItem & {
  prompt: string;
  position: [number, number, number];
} = {
  id: "room1Key",
  label: "Llave de la Habitación 1",
  prompt: "Presiona E para recoger la llave",
  position: [6.25, 0.82, 2.2],
};

export const CHAPTER_ONE_ROOM: {
  roomId: MainRoomId;
  lockedPrompt: string;
  openPrompt: string;
  closePrompt: string;
} = {
  roomId: "room1",
  lockedPrompt: "La puerta está cerrada.",
  openPrompt: "Presiona E para abrir la Habitación 1",
  closePrompt: "Presiona E para cerrar la Habitación 1",
};

export const CHAPTER_ONE_NOTES: StoryNoteConfig[] = [
  {
    id: "note1",
    content: STORY_NOTES.note1,
    prompt: "Presiona E para leer la Nota 1",
    position: [-0.8, 0.86, 4.35],
    rotationY: -0.1,
  },
  {
    id: "note2",
    content: STORY_NOTES.note2,
    prompt: "Presiona E para leer la Nota 2",
    position: [2.85, 0.86, 1.25],
    rotationY: 0.15,
  },
  {
    id: "note3",
    content: STORY_NOTES.note3,
    prompt: "Presiona E para leer la Nota 3",
    position: [5.45, 0.86, 2.35],
    rotationY: -0.1,
  },
];
