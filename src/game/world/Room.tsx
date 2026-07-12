import type { ReactNode } from "react";
import { StaticBox } from "./StaticBox";
import { Wall } from "./Wall";

type RoomProps = {
  center: [number, number];
  size: [number, number];
  children?: ReactNode;
  floorColor?: string;
  walls?: boolean;
  wallColor?: string;
};

const wallHeight = 2.8;
const wallThickness = 0.28;

export function Room({
  center,
  size,
  children,
  floorColor = "#4a4640",
  walls = true,
  wallColor = "#777068",
}: RoomProps) {
  const [x, z] = center;
  const [width, depth] = size;

  return (
    <>
      <StaticBox
        color={floorColor}
        position={[x, -0.06, z]}
        scale={[width, 0.12, depth]}
      />
      {walls ? (
        <>
          <Wall
            color={wallColor}
            position={[x - width / 2, wallHeight / 2, z]}
            scale={[wallThickness, wallHeight, depth]}
          />
          <Wall
            color={wallColor}
            position={[x + width / 2, wallHeight / 2, z]}
            scale={[wallThickness, wallHeight, depth]}
          />
          <Wall
            color={wallColor}
            position={[x, wallHeight / 2, z + depth / 2]}
            scale={[width, wallHeight, wallThickness]}
          />
          <Wall
            color={wallColor}
            position={[x, wallHeight / 2, z - depth / 2]}
            scale={[width, wallHeight, wallThickness]}
          />
        </>
      ) : null}
      {children}
    </>
  );
}
