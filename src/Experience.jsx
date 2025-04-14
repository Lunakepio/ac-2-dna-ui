import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { useDNAStore } from './store/store';
import { useEffect } from 'react';
import { MathUtils, TextureLoader } from 'three';
import { useRef } from 'react';
import { data } from './data';
import Shape from './shapes/Shape';


export const Experience = () => {
  const texture = useLoader(TextureLoader, "/white.png");
  const length = data.length;
  const shapeArray = Array.from({ length }, (_, index) => ({
    position: [0, data[length - index - 1].y * 3, index * 0.4 - ((length / 2) * 0.3)],
    delay: index * 0.05,
    scale: 1 + Math.abs(Math.sin(index / length)),
    index,
  }));

  const { hoveredSequence, selectedSequence, selectedIndex, setHoveredSequence, setSelectedSequence, setSelectedIndex } = useDNAStore();

  const groupRef = useRef();
  const scaleRef = useRef(1);
  const { camera } = useThree();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.key === 'q' || event.key === 'Q' || event.key === 'ArrowLeft') {
        if(!selectedSequence && hoveredSequence > 4){
          setHoveredSequence(hoveredSequence - 1);
        } else {
          if(selectedIndex > 0 && selectedSequence){
            setSelectedIndex(selectedIndex - 1)
          }
        }
      } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
        if(!selectedSequence && hoveredSequence < 8){
          setHoveredSequence(hoveredSequence + 1);
        } else {
          if(selectedIndex < 8 && selectedSequence){
            setSelectedIndex(selectedIndex + 1)
          }
        }
      }
      if(event.key === 'Enter') {
        if(selectedSequence === undefined){
          setSelectedSequence(hoveredSequence);
        } 
      }
      if(event.key === 'Escape') {
        setSelectedSequence(undefined);
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hoveredSequence, setHoveredSequence, selectedSequence, setSelectedSequence, selectedIndex, setSelectedIndex, length]);
  
  useFrame((state) => {
      if (!groupRef.current) return;
  
      const clock = state.clock.getElapsedTime();
      groupRef.current.position.z = 0.3 + MathUtils.lerp(
          groupRef.current.position.z,
          -(hoveredSequence * 2 + selectedIndex * 0.5),
          0.05
      );
  
      if (Math.floor(clock / 5) % 2 === 0) {
          scaleRef.current = MathUtils.lerp(scaleRef.current, 1.02, 0.005);
      } else {
          scaleRef.current = MathUtils.lerp(scaleRef.current, 1, 0.005);
      }
  
      groupRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      
      camera.position.y = -1 + Math.sin(clock * 0.5) * 0.3;
  });

  return (
    <>
      <group ref={groupRef}>
        <Shape/>
        {/* {shapeArray.map((shape, index) => (
          <Shape key={index} {...shape} />
        ))} */}
      </group>
    </>
  );
};
