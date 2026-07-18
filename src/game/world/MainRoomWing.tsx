import { GalleryFrame } from "../objects/GalleryFrame";
import { MainRoomDoor } from "../objects/MainRoomDoor";
import { DoorFrame } from "./DoorFrame";
import { mainRoomConfigs, type MainRoomConfig } from "./mainRoomConfigs";
import { Room } from "./Room";
import { StaticBox } from "./StaticBox";
import { Wall } from "./Wall";
import { useGameStore } from "../store/useGameStore";

const wallHeight = 2.8;
const wallThickness = 0.28;
const doorGap = 1.7;
const corridorMinX = 4;
const corridorMaxX = 41;
const corridorZ = 2;
const corridorWidth = 2.7;
const corridorNorthWallZ = corridorZ + corridorWidth / 2;
const corridorSouthWallZ = corridorZ - corridorWidth / 2;

function RoomDoorWall({ room }: { room: MainRoomConfig }) {
  const [x, z] = room.center;
  const [width, depth] = room.size;
  const wallZ =
    room.side === "north" ? z - depth / 2 : z + depth / 2;
  const minX = x - width / 2;
  const maxX = x + width / 2;
  const leftWidth = x - doorGap / 2 - minX;
  const rightWidth = maxX - (x + doorGap / 2);

  return (
    <>
      <Wall
        color={room.wallColor}
        position={[minX + leftWidth / 2, wallHeight / 2, wallZ]}
        scale={[leftWidth, wallHeight, wallThickness]}
      />
      <Wall
        color={room.wallColor}
        position={[x + doorGap / 2 + rightWidth / 2, wallHeight / 2, wallZ]}
        scale={[rightWidth, wallHeight, wallThickness]}
      />
      <DoorFrame position={[x, 0, wallZ]} />
    </>
  );
}

function MainRoomShell({ room }: { room: MainRoomConfig }) {
  const [x, z] = room.center;
  const [width, depth] = room.size;
  const galleryWallZ =
    room.side === "north" ? z + depth / 2 : z - depth / 2;

  return (
    <>
      <Room
        center={room.center}
        floorColor={room.floorColor}
        size={room.size}
        walls={false}
      />
      <Wall
        color={room.wallColor}
        position={[x - width / 2, wallHeight / 2, z]}
        scale={[wallThickness, wallHeight, depth]}
      />
      <Wall
        color={room.wallColor}
        position={[x + width / 2, wallHeight / 2, z]}
        scale={[wallThickness, wallHeight, depth]}
      />
      <Wall
        color={room.wallColor}
        position={[x, wallHeight / 2, galleryWallZ]}
        scale={[width, wallHeight, wallThickness]}
      />
      <RoomDoorWall room={room} />
    </>
  );
}

function MainRoomGallery({
  room,
  showLights,
}: {
  room: MainRoomConfig;
  showLights: boolean;
}) {
  const [x, z] = room.center;
  const [, depth] = room.size;
  const galleryWallZ =
    room.side === "north" ? z + depth / 2 - 0.18 : z - depth / 2 + 0.18;
  const lightZ = room.side === "north" ? galleryWallZ - 0.42 : galleryWallZ + 0.42;

  return (
    <>
      {room.galleryFrames.map((frame) => {
        const frameX = x + frame.offsetX;

        return (
          <group key={frame.id}>
            <GalleryFrame
              image={frame.image}
              placeholderColor={frame.placeholderColor}
              position={[frameX, 1.48, galleryWallZ]}
            />
            {showLights ? (
              <pointLight
                color="#f0d6a0"
                distance={3}
                intensity={1.15}
                position={[frameX, 2.28, lightZ]}
              />
            ) : null}
            <mesh position={[frameX, 2.2, lightZ]} scale={[0.34, 0.08, 0.12]}>
              <boxGeometry />
              <meshStandardMaterial
                color="#4b3626"
                emissive="#8a6238"
                emissiveIntensity={0.2}
                roughness={0.55}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function CorridorWallSegments({
  doorXs,
  z,
}: {
  doorXs: number[];
  z: number;
}) {
  const segments: Array<[number, number]> = [];
  let cursor = corridorMinX;

  for (const doorX of [...doorXs].sort((a, b) => a - b)) {
    const start = doorX - doorGap / 2;
    const end = doorX + doorGap / 2;

    if (start > cursor) {
      segments.push([cursor, start]);
    }

    cursor = Math.max(cursor, end);
  }

  if (cursor < corridorMaxX) {
    segments.push([cursor, corridorMaxX]);
  }

  return (
    <>
      {segments.map(([start, end]) => (
        <Wall
          key={`${z}-${start}-${end}`}
          color="#56514d"
          position={[(start + end) / 2, wallHeight / 2, z]}
          scale={[end - start, wallHeight, wallThickness]}
        />
      ))}
    </>
  );
}

function GalleryCorridor() {
  const northDoorXs = mainRoomConfigs
    .filter((room) => room.side === "north")
    .map((room) => room.center[0]);
  const southDoorXs = mainRoomConfigs
    .filter((room) => room.side === "south")
    .map((room) => room.center[0]);

  return (
    <>
      <StaticBox
        color="#403d3a"
        position={[(corridorMinX + corridorMaxX) / 2, -0.055, corridorZ]}
        scale={[corridorMaxX - corridorMinX, 0.11, corridorWidth]}
      />
      <CorridorWallSegments doorXs={northDoorXs} z={corridorNorthWallZ} />
      <CorridorWallSegments doorXs={southDoorXs} z={corridorSouthWallZ} />
      <Wall
        color="#56514d"
        position={[corridorMaxX, wallHeight / 2, corridorZ]}
        scale={[wallThickness, wallHeight, corridorWidth]}
      />
      <DoorFrame position={[corridorMinX, 0, corridorZ]} rotationY={Math.PI / 2} />
    </>
  );
}

export function MainRoomWing() {
  const graphicsQuality = useGameStore((state) => state.settings.graphicsQuality);
  const showGalleryLights = graphicsQuality !== "low";

  return (
    <>
      <GalleryCorridor />
      {mainRoomConfigs.map((room) => {
        const [x, z] = room.center;
        const [, depth] = room.size;
        const doorZ =
          room.side === "north" ? z - depth / 2 : z + depth / 2;

        return (
          <group key={room.id}>
            <MainRoomShell room={room} />
            <MainRoomGallery room={room} showLights={showGalleryLights} />
            <MainRoomDoor roomId={room.id} position={[x, 0, doorZ]} />
          </group>
        );
      })}
    </>
  );
}
