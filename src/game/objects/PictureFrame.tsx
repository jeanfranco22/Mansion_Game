import type { ThreeElements } from "@react-three/fiber";

type PictureFrameProps = {
  position: ThreeElements["mesh"]["position"];
  rotation?: ThreeElements["mesh"]["rotation"];
  color?: string;
};

export function PictureFrame({
  position,
  rotation,
  color = "#3f4656",
}: PictureFrameProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={[0.75, 0.48, 0.04]}>
        <boxGeometry />
        <meshStandardMaterial color="#2d1e16" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, -0.03]} scale={[0.58, 0.34, 0.02]}>
        <boxGeometry />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}
