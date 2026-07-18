import type { ThreeElements } from "@react-three/fiber";

type GalleryFrameProps = {
  image?: string;
  placeholderColor?: string;
  position: ThreeElements["group"]["position"];
  rotation?: ThreeElements["group"]["rotation"];
};

export function GalleryFrame({
  image,
  placeholderColor = "#8a8781",
  position,
  rotation,
}: GalleryFrameProps) {
  return (
    <group position={position} rotation={rotation} userData={{ image }}>
      <mesh castShadow receiveShadow scale={[1.35, 0.92, 0.06]}>
        <boxGeometry />
        <meshStandardMaterial color="#2d2118" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, -0.04]} scale={[1.12, 0.72, 0.035]}>
        <boxGeometry />
        <meshStandardMaterial
          color={placeholderColor}
          emissive={placeholderColor}
          emissiveIntensity={0.04}
          roughness={0.88}
        />
      </mesh>
      <mesh position={[0, 0.55, -0.035]} scale={[1.25, 0.08, 0.04]}>
        <boxGeometry />
        <meshStandardMaterial color="#1d1712" roughness={0.65} />
      </mesh>
    </group>
  );
}
