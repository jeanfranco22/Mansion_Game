import { RigidBody } from "@react-three/rapier";
import type { ThreeElements } from "@react-three/fiber";

type StaticBoxProps = {
  color: string;
  collider?: boolean;
  position: ThreeElements["mesh"]["position"];
  rotation?: ThreeElements["mesh"]["rotation"];
  scale: ThreeElements["mesh"]["scale"];
  visible?: boolean;
};

export function StaticBox({
  color,
  collider = true,
  position,
  rotation,
  scale,
  visible = true,
}: StaticBoxProps) {
  const mesh = (
    <mesh castShadow receiveShadow scale={scale} visible={visible}>
      <boxGeometry />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.12}
        roughness={0.8}
      />
    </mesh>
  );

  if (!collider) {
    return (
      <group position={position} rotation={rotation}>
        {mesh}
      </group>
    );
  }

  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={position}
      rotation={rotation}
    >
      {mesh}
    </RigidBody>
  );
}
