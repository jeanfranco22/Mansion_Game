import { StaticBox } from "./StaticBox";

type DoorFrameProps = {
  position: [number, number, number];
  rotationY?: number;
};

export function DoorFrame({ position, rotationY = 0 }: DoorFrameProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <StaticBox color="#3a2a1f" position={[-0.72, 1.25, 0]} scale={[0.16, 2.5, 0.18]} />
      <StaticBox color="#3a2a1f" position={[0.72, 1.25, 0]} scale={[0.16, 2.5, 0.18]} />
      <StaticBox color="#3a2a1f" position={[0, 2.55, 0]} scale={[1.6, 0.16, 0.18]} />
    </group>
  );
}
