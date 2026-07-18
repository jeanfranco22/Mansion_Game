import type { InventoryItem, MainRoomId, Objective } from "../store/gameStoreTypes";

export const CHAPTER_INTRO_TEXT =
  "Bienvenida, estás a punto de entrar a la casa de nuestros recuerdos de un año, repartidos en 7 días, 7 puertas que te acompañarán en tu viaje, amor.";

export const STORY_NOTES = {
  note1:
    "En esta casa nos conoceremos más, recordaremos, jugaremos y serán las cosas que tenemos tú y yo juntos, así que te iré acompañando cada día poco a poco, ¿sí amor?",
  note2:
    'La primera pista: "Amor, deberás encontrar una llave, esta abrirá la puerta 1, no sabrás cuál es, así que deberás buscarla... mucha suerte".',
  note3: "C & J Eternity",
} as const;

export type StoryNoteId = keyof typeof STORY_NOTES;

export type StoryNoteConfig = {
  id: StoryNoteId;
  content: string;
  imageSrc?: string;
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
  position: [6.72, 0.16, 3.06],
};

export const ROOM_ONE_MEMORY_NOTE = {
  id: "room1-memory-note",
  content:
    'Hace 1 año, empezó nuestra historia, un evento que no tenía principio ni fin, algo que ninguno de los 2 pensó o imaginó que seguiría este rumbo, pero hoy estamos aquí, estamos cruzando el primero de muchos años que tendremos juntos y que siendo honesto, solo quiero pasar a tu lado amor... Cada día tendrás una nueva pista, pero por hoy será lo único que te daré; las demás puertas se abrirán con un código que te iré dando, así que descuida. Este viaje a Marruecos también estará acompañado de aventuras conmigo, amor. Te amo.',
  imageSrc: "/dia1.jpg",
  prompt: "Presiona E para leer el recuerdo del Día 1",
  position: [8, 0.05, 5.2] as [number, number, number],
  rotationY: 0,
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
    position: [-0.8, 0.825, 4.35],
    rotationY: -0.1,
  },
  {
    id: "note2",
    content: STORY_NOTES.note2,
    prompt: "Presiona E para leer la Nota 2",
    position: [1.72, 0.045, 2.85],
    rotationY: 0.35,
  },
  {
    id: "note3",
    content: STORY_NOTES.note3,
    prompt: "Presiona E para leer la Nota 3",
    position: [5.58, 0.045, 2.78],
    rotationY: -0.2,
  },
];
