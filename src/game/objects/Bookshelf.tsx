import { StaticBox } from "../world/StaticBox";

type BookshelfProps = {
  position: [number, number, number];
};

export function Bookshelf({ position }: BookshelfProps) {
  const [x, y, z] = position;

  return (
    <group>
      <StaticBox color="#3b271c" position={[x, y + 1.0, z]} scale={[1.35, 2, 0.34]} />
      <StaticBox color="#1d1410" position={[x, y + 0.58, z - 0.19]} scale={[1.15, 0.08, 0.08]} />
      <StaticBox color="#1d1410" position={[x, y + 1.1, z - 0.19]} scale={[1.15, 0.08, 0.08]} />
      <StaticBox color="#1d1410" position={[x, y + 1.62, z - 0.19]} scale={[1.15, 0.08, 0.08]} />
      <StaticBox color="#6b2830" position={[x - 0.36, y + 1.34, z - 0.38]} scale={[0.18, 0.38, 0.12]} />
      <StaticBox color="#284568" position={[x - 0.08, y + 1.34, z - 0.38]} scale={[0.16, 0.42, 0.12]} />
      <StaticBox color="#5b4b22" position={[x + 0.22, y + 1.34, z - 0.38]} scale={[0.2, 0.34, 0.12]} />
    </group>
  );
}
