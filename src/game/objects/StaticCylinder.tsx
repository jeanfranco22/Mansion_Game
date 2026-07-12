import { RigidBody } from "@react-three/rapier";
import type { ThreeElements } from "@react-three/fiber";

type StaticCylinderProps = {
  color: string;
  position: ThreeElements["mesh"]["position"];
  scale: ThreeElements["mesh"]["scale"];
};

export function StaticCylinder({ color, position, scale }: StaticCylinderProps) {
  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <mesh castShadow receiveShadow scale={scale}>
        <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
    </RigidBody>
  );
}
