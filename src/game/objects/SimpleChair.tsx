import { StaticBox } from "../world/StaticBox";

type SimpleChairProps = {
  position: [number, number, number];
  rotationY?: number;
};

export function SimpleChair({ position, rotationY = 0 }: SimpleChairProps) {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      <StaticBox color="#3d2a1d" position={[0, 0.42, 0]} scale={[0.55, 0.12, 0.55]} />
      <StaticBox color="#2b1d15" position={[0, 0.88, 0.24]} scale={[0.55, 0.82, 0.12]} />
      <StaticBox color="#2b1d15" position={[-0.21, 0.21, -0.2]} scale={[0.08, 0.42, 0.08]} />
      <StaticBox color="#2b1d15" position={[0.21, 0.21, -0.2]} scale={[0.08, 0.42, 0.08]} />
    </group>
  );
}
