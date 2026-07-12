import { StaticBox } from "../world/StaticBox";
import { StaticCylinder } from "./StaticCylinder";

export function Rug({
  color,
  position,
  scale,
}: {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh receiveShadow position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  );
}

export function PaperScatter({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group>
      <Rug color="#cfc4ad" position={[x, y, z]} scale={[0.34, 0.01, 0.22]} />
      <Rug color="#bdb29d" position={[x + 0.22, y + 0.002, z - 0.12]} scale={[0.26, 0.01, 0.18]} />
      <Rug color="#d7ccb5" position={[x - 0.18, y + 0.004, z + 0.18]} scale={[0.22, 0.01, 0.16]} />
    </group>
  );
}

export function CrateStack({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group>
      <StaticBox color="#4b3728" position={[x, y + 0.32, z]} scale={[0.72, 0.64, 0.72]} />
      <StaticBox color="#5a432f" position={[x + 0.38, y + 0.92, z - 0.18]} scale={[0.56, 0.52, 0.56]} />
      <StaticBox color="#2f251e" position={[x - 0.03, y + 0.64, z - 0.37]} scale={[0.76, 0.08, 0.06]} />
    </group>
  );
}

export function PipeRun({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <StaticCylinder color="#343a3e" position={[x, y, z]} scale={[0.06, 2.2, 0.06]} />
      <StaticCylinder color="#2a2f32" position={[x, y + 0.5, z - 0.6]} scale={[0.04, 1.0, 0.04]} />
    </group>
  );
}

export function WallDamage({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh scale={[0.65, 0.34, 0.015]}>
        <boxGeometry />
        <meshStandardMaterial color="#2b2927" opacity={0.58} roughness={1} transparent />
      </mesh>
      <mesh position={[0.18, -0.24, -0.002]} scale={[0.22, 0.18, 0.012]}>
        <boxGeometry />
        <meshStandardMaterial color="#181716" opacity={0.5} roughness={1} transparent />
      </mesh>
    </group>
  );
}

export function DeskLamp({
  position,
  active,
}: {
  position: [number, number, number];
  active: boolean;
}) {
  const [x, y, z] = position;

  return (
    <group>
      <StaticCylinder color="#2d2924" position={[x, y + 0.1, z]} scale={[0.1, 0.06, 0.1]} />
      <StaticCylinder color="#2d2924" position={[x, y + 0.3, z]} scale={[0.035, 0.4, 0.035]} />
      <mesh position={[x, y + 0.55, z]} scale={[0.22, 0.14, 0.22]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial
          color={active ? "#d9b772" : "#5d4d37"}
          emissive={active ? "#d9b772" : "#000000"}
          emissiveIntensity={active ? 0.65 : 0}
          roughness={0.5}
        />
      </mesh>
      {active ? (
        <pointLight color="#e4bd78" distance={4} intensity={34} position={[x, y + 0.75, z]} />
      ) : null}
    </group>
  );
}

export function BrokenFurniture({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group rotation={[0, -0.35, 0]}>
      <StaticBox color="#3d2a1d" position={[x, y + 0.24, z]} scale={[0.72, 0.12, 0.45]} />
      <StaticBox color="#2b1d15" position={[x - 0.26, y + 0.08, z - 0.12]} scale={[0.08, 0.34, 0.08]} />
      <StaticBox color="#2b1d15" position={[x + 0.18, y + 0.14, z + 0.18]} scale={[0.08, 0.46, 0.08]} />
      <StaticBox color="#2b1d15" position={[x + 0.45, y + 0.14, z - 0.34]} scale={[0.42, 0.07, 0.07]} />
    </group>
  );
}

export function CableTrail({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group>
      <StaticBox color="#101010" collider={false} position={[x, y, z]} scale={[1.4, 0.025, 0.035]} />
      <StaticBox color="#101010" collider={false} position={[x + 0.68, y, z - 0.36]} scale={[0.035, 0.025, 0.72]} />
      <StaticBox color="#101010" collider={false} position={[x + 0.18, y, z - 0.72]} scale={[1.0, 0.025, 0.035]} />
    </group>
  );
}
