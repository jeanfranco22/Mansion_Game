import { StaticBox } from "../world/StaticBox";

type CabinetProps = {
  position: [number, number, number];
};

export function Cabinet({ position }: CabinetProps) {
  const [x, y, z] = position;

  return (
    <group>
      <StaticBox color="#433024" position={[x, y + 0.6, z]} scale={[1.15, 1.2, 0.5]} />
      <StaticBox color="#2a1e17" position={[x, y + 0.62, z - 0.27]} scale={[0.03, 0.92, 0.06]} />
      <StaticBox color="#b59a5b" position={[x - 0.18, y + 0.65, z - 0.54]} scale={[0.06, 0.06, 0.04]} />
      <StaticBox color="#b59a5b" position={[x + 0.18, y + 0.65, z - 0.54]} scale={[0.06, 0.06, 0.04]} />
    </group>
  );
}
