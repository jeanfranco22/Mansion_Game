import type { ThreeElements } from "@react-three/fiber";

type WindowPanelProps = {
  position: ThreeElements["mesh"]["position"];
  rotation?: ThreeElements["mesh"]["rotation"];
  scale: ThreeElements["mesh"]["scale"];
};

export function WindowPanel({ position, rotation, scale }: WindowPanelProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial
        color="#05070b"
        opacity={0.58}
        roughness={0.25}
        transparent
      />
    </mesh>
  );
}
