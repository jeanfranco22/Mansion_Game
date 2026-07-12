import { StaticBox } from "./StaticBox";
import { Wall } from "./Wall";

type CorridorProps = {
  center: [number, number];
  length: number;
  walls?: boolean;
  width: number;
};

const wallHeight = 2.8;
const wallThickness = 0.28;

export function Corridor({ center, length, walls = true, width }: CorridorProps) {
  const [x, z] = center;

  return (
    <>
      <StaticBox
        color="#403d3a"
        position={[x, -0.055, z]}
        scale={[width, 0.11, length]}
      />
      {walls ? (
        <>
          <Wall
            color="#5d5a56"
            position={[x - width / 2, wallHeight / 2, z]}
            scale={[wallThickness, wallHeight, length]}
          />
          <Wall
            color="#5d5a56"
            position={[x + width / 2, wallHeight / 2, z]}
            scale={[wallThickness, wallHeight, length]}
          />
        </>
      ) : null}
    </>
  );
}
