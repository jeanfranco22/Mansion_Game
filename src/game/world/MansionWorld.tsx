import { useEffect } from "react";
import { Bookshelf } from "../objects/Bookshelf";
import { Cabinet } from "../objects/Cabinet";
import { CollectibleItem } from "../objects/CollectibleItem";
import { CorridorDoor } from "../objects/CorridorDoor";
import {
  BrokenFurniture,
  CableTrail,
  CrateStack,
  DeskLamp,
  PaperScatter,
  PipeRun,
  Rug,
  WallDamage,
} from "../objects/EnvironmentProps";
import { FinalExitDoor } from "../objects/FinalExitDoor";
import { MainKey } from "../objects/MainKey";
import { PictureFrame } from "../objects/PictureFrame";
import {
  BasementAccessDoor,
  BookOrderPuzzle,
  EscapeLever,
  FuseBox,
  HiddenWallSwitch,
  OfficeSafe,
  PressurePlate,
  StorageDoor,
  ValveWheel,
} from "../objects/PuzzleObjects";
import { SimpleChair } from "../objects/SimpleChair";
import { SimpleTable } from "../objects/SimpleTable";
import { StudyDoor } from "../objects/StudyDoor";
import { FinalRoomTrigger } from "../triggers/FinalRoomTrigger";
import { LightFlickerTrigger } from "../triggers/LightFlickerTrigger";
import { DoorCloseTrigger } from "../triggers/DoorCloseTrigger";
import { StudyRoomEventController } from "../scripted-events/StudyRoomEventController";
import {
  CHAPTER_ONE_KEY,
  CHAPTER_ONE_NOTES,
  ROOM_ONE_MEMORY_NOTE,
  STORY_NOTE_ORDER,
} from "../story/story";
import { StoryNoteObject } from "../story/StoryNoteObject";
import { useGameStore } from "../store/useGameStore";
import { ReadableNote } from "../objects/ReadableNote";
import { Corridor } from "./Corridor";
import { DoorFrame } from "./DoorFrame";
import { FlickeringLight } from "./FlickeringLight";
import { MainRoomWing } from "./MainRoomWing";
import { Room } from "./Room";
import { StaticBox } from "./StaticBox";
import { Wall } from "./Wall";
import { WindowPanel } from "./WindowPanel";

const wallHeight = 2.8;
const wallThickness = 0.28;

function WallColumn({ position }: { position: [number, number, number] }) {
  return <StaticBox color="#4a433d" position={position} scale={[0.22, 2.6, 0.22]} />;
}

export function MansionWorld() {
  const setWorldReady = useGameStore((state) => state.setWorldReady);
  const studyLightIntensity = useGameStore(
    (state) => state.studyRoom.studyLightIntensity,
  );
  const electricityRestored = useGameStore(
    (state) => state.progression.electricityRestored,
  );
  const storyNotesRead = useGameStore(
    (state) => state.progression.storyNotesRead,
  );
  const visibleStoryNotes = CHAPTER_ONE_NOTES.filter((note) => {
    const noteIndex = STORY_NOTE_ORDER.indexOf(note.id);

    return noteIndex === 0 || storyNotesRead[STORY_NOTE_ORDER[noteIndex - 1]];
  });
  const roomOneKeyAvailable = storyNotesRead.note3;

  useEffect(() => {
    setWorldReady();
  }, [setWorldReady]);

  return (
    <>
      <ambientLight intensity={electricityRestored ? 0.28 : 0.2} />
      <hemisphereLight
        color="#f7e7c5"
        groundColor="#4e535c"
        intensity={electricityRestored ? 0.34 : 0.24}
      />
      <FlickeringLight color="#d9a85f" intensity={electricityRestored ? 72 : 54} position={[0, 2.6, 2]} speed={1.4} />
      <FlickeringLight color="#6f8fb8" intensity={electricityRestored ? 46 : 30} position={[0, 2.25, -6.5]} speed={2.1} />
      <FlickeringLight color="#d1b078" intensity={studyLightIntensity * (electricityRestored ? 108 : 72)} position={[4.2, 2.5, -8.2]} speed={1.8} />
      <pointLight color="#8fd0ff" intensity={electricityRestored ? 44 : 18} position={[-5.8, 2.25, -5.8]} />
      <pointLight color="#97a7c9" intensity={electricityRestored ? 42 : 24} position={[0, 2.3, -17]} />
      <pointLight color="#f0d6a0" distance={7} intensity={18} position={[8, 2.45, 5.2]} />

      <Room center={[0, 2]} floorColor="#4d4944" size={[8, 8]} walls={false} />
      <Room center={[-4.15, -6]} floorColor="#463f38" size={[6, 5]} walls={false} />
      <Room center={[4.15, -8]} floorColor="#3f3832" size={[6, 5]} walls={false} />
      <Room center={[0, -17]} floorColor="#383739" size={[6, 5]} walls={false} />
      <Corridor center={[0, -8]} length={12} walls={false} width={2.3} />

      <Wall position={[-4, wallHeight / 2, 2]} scale={[wallThickness, wallHeight, 8]} />
      <Wall position={[4, wallHeight / 2, -0.68]} scale={[wallThickness, wallHeight, 2.64]} />
      <Wall position={[4, wallHeight / 2, 4.68]} scale={[wallThickness, wallHeight, 2.64]} />
      <Wall position={[0, wallHeight / 2, 6]} scale={[8, wallHeight, wallThickness]} />
      <Wall position={[-2.58, wallHeight / 2, -2]} scale={[2.85, wallHeight, wallThickness]} />
      <Wall position={[2.58, wallHeight / 2, -2]} scale={[2.85, wallHeight, wallThickness]} />

      <Wall color="#5d5a56" position={[-1.15, wallHeight / 2, -3.2]} scale={[wallThickness, wallHeight, 2.4]} />
      <Wall color="#5d5a56" position={[-1.15, wallHeight / 2, -10.8]} scale={[wallThickness, wallHeight, 6.4]} />
      <Wall color="#5d5a56" position={[1.15, wallHeight / 2, -4.3]} scale={[wallThickness, wallHeight, 4.6]} />
      <Wall color="#5d5a56" position={[1.15, wallHeight / 2, -12.05]} scale={[wallThickness, wallHeight, 3.9]} />

      <Wall color="#6f665e" position={[-7.15, wallHeight / 2, -6]} scale={[wallThickness, wallHeight, 5]} />
      <Wall color="#6f665e" position={[-4.15, wallHeight / 2, -3.5]} scale={[6, wallHeight, wallThickness]} />
      <Wall color="#6f665e" position={[-4.15, wallHeight / 2, -8.5]} scale={[6, wallHeight, wallThickness]} />
      <Wall color="#6f665e" position={[-1.15, wallHeight / 2, -4.45]} scale={[wallThickness, wallHeight, 1.9]} />
      <Wall color="#6f665e" position={[-1.15, wallHeight / 2, -7.55]} scale={[wallThickness, wallHeight, 1.9]} />

      <Wall color="#695f58" position={[7.15, wallHeight / 2, -8]} scale={[wallThickness, wallHeight, 5]} />
      <Wall color="#695f58" position={[4.15, wallHeight / 2, -5.5]} scale={[6, wallHeight, wallThickness]} />
      <Wall color="#695f58" position={[4.15, wallHeight / 2, -10.5]} scale={[6, wallHeight, wallThickness]} />
      <Wall color="#695f58" position={[1.15, wallHeight / 2, -6.65]} scale={[wallThickness, wallHeight, 2.3]} />
      <Wall color="#695f58" position={[1.15, wallHeight / 2, -9.35]} scale={[wallThickness, wallHeight, 2.3]} />

      <Wall color="#545359" position={[-3, wallHeight / 2, -17]} scale={[wallThickness, wallHeight, 5]} />
      <Wall color="#545359" position={[3, wallHeight / 2, -17]} scale={[wallThickness, wallHeight, 5]} />
      <Wall color="#545359" position={[-2.05, wallHeight / 2, -14.5]} scale={[1.9, wallHeight, wallThickness]} />
      <Wall color="#545359" position={[2.05, wallHeight / 2, -14.5]} scale={[1.9, wallHeight, wallThickness]} />
      <Wall color="#545359" position={[-2.1, wallHeight / 2, -19.5]} scale={[1.8, wallHeight, wallThickness]} />
      <Wall color="#545359" position={[2.1, wallHeight / 2, -19.5]} scale={[1.8, wallHeight, wallThickness]} />

      <DoorFrame position={[0, 0, -2]} />
      <DoorFrame position={[-1.15, 0, -6]} rotationY={Math.PI / 2} />
      <DoorFrame position={[1.15, 0, -8]} rotationY={Math.PI / 2} />
      <DoorFrame position={[0, 0, -11.45]} />
      <DoorFrame position={[0, 0, -14.5]} />
      <DoorFrame position={[0, 0, -19.5]} />

      <MainRoomWing />

      <WallColumn position={[-3.85, 1.3, -1.6]} />
      <WallColumn position={[3.85, 1.3, -1.6]} />
      <WallColumn position={[-1.05, 1.3, -11.45]} />
      <WallColumn position={[1.05, 1.3, -11.45]} />
      <WallColumn position={[6.95, 1.3, -5.8]} />
      <WallColumn position={[6.95, 1.3, -10.2]} />

      <WindowPanel position={[-4.02, 1.55, 3.6]} rotation={[0, Math.PI / 2, 0]} scale={[1.2, 0.85, 0.04]} />
      <WindowPanel position={[-7.17, 1.55, -6]} rotation={[0, Math.PI / 2, 0]} scale={[1.2, 0.85, 0.04]} />
      <WindowPanel position={[7.17, 1.55, -8]} rotation={[0, Math.PI / 2, 0]} scale={[1.2, 0.85, 0.04]} />

      <Rug color="#493634" position={[0, 0.012, 2.1]} scale={[2.8, 0.02, 4.4]} />
      <Rug color="#2f3236" position={[0, 0.014, -8.1]} scale={[1.35, 0.02, 7.2]} />
      <Rug color="#3b3b44" position={[0, 0.014, -17]} scale={[2.7, 0.02, 3.5]} />
      <WallDamage position={[1.25, 1.85, 5.84]} />
      <WallDamage position={[-4.02, 1.15, 0.2]} rotationY={Math.PI / 2} />
      <WallDamage position={[7.0, 1.2, -7.35]} rotationY={Math.PI / 2} />
      <WallDamage position={[-2.3, 1.6, -19.34]} />
      <PaperScatter position={[-0.9, 0.035, 3.4]} />
      <PaperScatter position={[4.9, 0.035, -6.5]} />
      <PaperScatter position={[-5.55, 0.035, -4.7]} />
      <CableTrail position={[-5.9, 0.05, -6.8]} />
      <PipeRun position={[-7.02, 2.1, -6.2]} />
      <BrokenFurniture position={[-2.6, 0, 4.9]} />
      <CrateStack position={[-5.55, 0, -6.5]} />
      <CrateStack position={[-4.2, 0, -4.6]} />

      <SimpleTable position={[4.15, 0, -8.2]} />
      <SimpleChair position={[3.2, 0, -7.45]} rotationY={0.35} />
      <SimpleChair position={[5.15, 0, -8.95]} rotationY={-2.6} />
      <SimpleTable position={[-0.8, 0, 4.35]} />
      <SimpleChair position={[-1.7, 0, 4.35]} rotationY={1.25} />
      <Bookshelf position={[5.85, 0, -10.08]} />
      <Bookshelf position={[4.95, 0, -10.08]} />
      <Cabinet position={[-5.75, 0, -7.85]} />
      <Cabinet position={[3.0, 0, -9.88]} />
      <DeskLamp active={electricityRestored} position={[4.18, 0.83, -8.18]} />
      <PictureFrame position={[0, 1.55, 5.84]} />
      <PictureFrame color="#574037" position={[-3.9, 1.55, 0.8]} rotation={[0, Math.PI / 2, 0]} />
      <PictureFrame color="#263b35" position={[6.98, 1.55, -8.85]} rotation={[0, Math.PI / 2, 0]} />
      <PictureFrame color="#303650" position={[0.9, 1.55, -19.34]} />

      <HiddenWallSwitch id="storage-latch-switch" mode="storage" position={[-3.88, 1.08, 0.2]} rotationY={Math.PI / 2} />
      <HiddenWallSwitch id="study-unlock-switch" mode="study" position={[1.05, 1.1, -4.25]} rotationY={-Math.PI / 2} />
      <StorageDoor />
      <MainKey
        available={roomOneKeyAvailable}
        position={CHAPTER_ONE_KEY.position}
      />
      <CollectibleItem
        color="#8f9b9f"
        id="screwdriver"
        item={{ id: "screwdriver", label: "Destornillador" }}
        position={[-4.7, 0.74, -5.1]}
        rotationY={0.6}
        shape="cylinder"
      />
      <CollectibleItem
        color="#7b8795"
        id="replacement-fuse"
        item={{ id: "fuse", label: "Fusible de repuesto" }}
        position={[-5.95, 1.2, -6.45]}
        shape="cylinder"
      />
      <CollectibleItem
        color="#2f343b"
        id="flashlight-batteries"
        item={{ id: "batteries", label: "Baterías" }}
        position={[-5.2, 0.72, -7.35]}
        shape="box"
      />
      <CollectibleItem
        color="#4d5156"
        id="crowbar"
        item={{ id: "crowbar", label: "Palanca" }}
        position={[-4.25, 0.3, -7.65]}
        rotationY={0.4}
        shape="cylinder"
      />
      {visibleStoryNotes.map((note) => (
        <StoryNoteObject key={note.id} note={note} />
      ))}
      <ReadableNote
        content={ROOM_ONE_MEMORY_NOTE.content}
        id={ROOM_ONE_MEMORY_NOTE.id}
        imageSrc={ROOM_ONE_MEMORY_NOTE.imageSrc}
        position={ROOM_ONE_MEMORY_NOTE.position}
        prompt={ROOM_ONE_MEMORY_NOTE.prompt}
        rotationY={ROOM_ONE_MEMORY_NOTE.rotationY}
      />
      <FuseBox />
      <BookOrderPuzzle />
      <OfficeSafe />
      <CorridorDoor />
      <StudyDoor />
      <BasementAccessDoor />
      <PressurePlate />
      <ValveWheel />
      <EscapeLever />
      <FinalExitDoor />

      <LightFlickerTrigger />
      <DoorCloseTrigger />
      <FinalRoomTrigger />
      <StudyRoomEventController />
    </>
  );
}
