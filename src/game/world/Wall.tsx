import type { ThreeElements } from "@react-three/fiber";
import { StaticBox } from "./StaticBox";

type WallProps = {
  color?: string;
  position: ThreeElements["mesh"]["position"];
  scale: ThreeElements["mesh"]["scale"];
};

export function Wall({ color = "#777068", position, scale }: WallProps) {
  return <StaticBox color={color} position={position} scale={scale} />;
}
