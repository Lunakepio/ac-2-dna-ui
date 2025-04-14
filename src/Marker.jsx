import { Billboard } from "@react-three/drei";

export const Marker = ({shouldBeRed}) => {
  const color = shouldBeRed ? "#700b03" : "#787878";
    return (
        <group>
          <Billboard>
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <planeGeometry args={[0.3, 0.3]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <mesh position-y={-0.8}>
                <planeGeometry args={[0.05, 0.8]} />
                <meshBasicMaterial color={color} />
            </mesh>
          </Billboard>
        </group>
    );
};
