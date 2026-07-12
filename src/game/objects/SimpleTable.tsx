import { StaticBox } from "../world/StaticBox";
import { StaticCylinder } from "./StaticCylinder";

type SimpleTableProps = {
  position: [number, number, number];
};

export function SimpleTable({ position }: SimpleTableProps) {
  const [x, y, z] = position;

  return (
    <group>
      <StaticBox color="#4c3324" position={[x, y + 0.75, z]} scale={[1.45, 0.14, 0.86]} />
      <StaticCylinder color="#342219" position={[x - 0.55, y + 0.36, z - 0.28]} scale={[0.08, 0.72, 0.08]} />
      <StaticCylinder color="#342219" position={[x + 0.55, y + 0.36, z - 0.28]} scale={[0.08, 0.72, 0.08]} />
      <StaticCylinder color="#342219" position={[x - 0.55, y + 0.36, z + 0.28]} scale={[0.08, 0.72, 0.08]} />
      <StaticCylinder color="#342219" position={[x + 0.55, y + 0.36, z + 0.28]} scale={[0.08, 0.72, 0.08]} />
    </group>
  );
}
