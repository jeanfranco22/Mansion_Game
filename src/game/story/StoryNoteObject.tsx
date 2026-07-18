"use client";

import { ReadableNote } from "../objects/ReadableNote";
import { useGameStore } from "../store/useGameStore";
import type { StoryNoteConfig } from "./story";

type StoryNoteObjectProps = {
  note: StoryNoteConfig;
};

export function StoryNoteObject({ note }: StoryNoteObjectProps) {
  const readStoryNote = useGameStore((state) => state.readStoryNote);

  return (
    <ReadableNote
      content={note.content}
      id={note.id}
      onRead={() => readStoryNote(note.id)}
      position={note.position}
      prompt={note.prompt}
      rotationY={note.rotationY}
    />
  );
}
