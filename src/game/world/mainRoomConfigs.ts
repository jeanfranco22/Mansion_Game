import type { MainRoomId } from "../store/gameStoreTypes";

export type GalleryFrameConfig = {
  id: string;
  image?: string;
  offsetX: number;
  placeholderColor: string;
};

export type MainRoomConfig = {
  id: MainRoomId;
  center: [number, number];
  floorColor: string;
  galleryFrames: GalleryFrameConfig[];
  side: "north" | "south";
  size: [number, number];
  wallColor: string;
};

const roomSize: [number, number] = [4.5, 5.4];
const northRoomZ = 6.05;
const southRoomZ = -2.05;

export const mainRoomConfigs: MainRoomConfig[] = [
  {
    id: "room1",
    center: [8, northRoomZ],
    floorColor: "#46413d",
    galleryFrames: [
      { id: "room1-frame1", offsetX: -1.45, placeholderColor: "#827d75" },
      { id: "room1-frame2", offsetX: -0.72, placeholderColor: "#777a79" },
      { id: "room1-frame3", offsetX: 0, placeholderColor: "#8a8580" },
      { id: "room1-frame4", offsetX: 0.72, placeholderColor: "#73787f" },
      { id: "room1-frame5", offsetX: 1.45, placeholderColor: "#858079" },
    ],
    side: "north",
    size: roomSize,
    wallColor: "#69635c",
  },
  {
    id: "room2",
    center: [13, southRoomZ],
    floorColor: "#423d3a",
    galleryFrames: [
      { id: "room2-frame1", offsetX: -1.15, placeholderColor: "#7d7a73" },
      { id: "room2-frame2", offsetX: 0, placeholderColor: "#88837b" },
      { id: "room2-frame3", offsetX: 1.15, placeholderColor: "#74787b" },
    ],
    side: "south",
    size: roomSize,
    wallColor: "#615b55",
  },
  {
    id: "room3",
    center: [18, northRoomZ],
    floorColor: "#45403b",
    galleryFrames: [
      { id: "room3-frame1", offsetX: -1.35, placeholderColor: "#858179" },
      { id: "room3-frame2", offsetX: -0.45, placeholderColor: "#777b7a" },
      { id: "room3-frame3", offsetX: 0.45, placeholderColor: "#86807a" },
      { id: "room3-frame4", offsetX: 1.35, placeholderColor: "#747982" },
    ],
    side: "north",
    size: roomSize,
    wallColor: "#665f58",
  },
  {
    id: "room4",
    center: [23, southRoomZ],
    floorColor: "#403d3d",
    galleryFrames: [
      { id: "room4-frame1", offsetX: -1.45, placeholderColor: "#7e7a73" },
      { id: "room4-frame2", offsetX: -0.48, placeholderColor: "#89847c" },
      { id: "room4-frame3", offsetX: 0.48, placeholderColor: "#72787e" },
      { id: "room4-frame4", offsetX: 1.45, placeholderColor: "#807d78" },
    ],
    side: "south",
    size: roomSize,
    wallColor: "#5d5854",
  },
  {
    id: "room5",
    center: [28, northRoomZ],
    floorColor: "#46423d",
    galleryFrames: [
      { id: "room5-frame1", offsetX: -1.2, placeholderColor: "#868079" },
      { id: "room5-frame2", offsetX: 0, placeholderColor: "#777b80" },
      { id: "room5-frame3", offsetX: 1.2, placeholderColor: "#827f79" },
    ],
    side: "north",
    size: roomSize,
    wallColor: "#675f58",
  },
  {
    id: "room6",
    center: [33, southRoomZ],
    floorColor: "#413d39",
    galleryFrames: [
      { id: "room6-frame1", offsetX: -1.35, placeholderColor: "#797b78" },
      { id: "room6-frame2", offsetX: -0.45, placeholderColor: "#858178" },
      { id: "room6-frame3", offsetX: 0.45, placeholderColor: "#747982" },
      { id: "room6-frame4", offsetX: 1.35, placeholderColor: "#8a837a" },
    ],
    side: "south",
    size: roomSize,
    wallColor: "#5f5a54",
  },
  {
    id: "room7",
    center: [38, northRoomZ],
    floorColor: "#44403c",
    galleryFrames: [
      { id: "room7-frame1", offsetX: -1.45, placeholderColor: "#827d76" },
      { id: "room7-frame2", offsetX: -0.72, placeholderColor: "#737981" },
      { id: "room7-frame3", offsetX: 0, placeholderColor: "#88827b" },
      { id: "room7-frame4", offsetX: 0.72, placeholderColor: "#777b79" },
      { id: "room7-frame5", offsetX: 1.45, placeholderColor: "#85807a" },
    ],
    side: "north",
    size: roomSize,
    wallColor: "#665f59",
  },
];
