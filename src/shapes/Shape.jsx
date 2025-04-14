import { extend, useFrame, useLoader } from "@react-three/fiber";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import { useMemo, useRef, useEffect } from "react";
import { useDNAStore } from "../store/store";
import {
  Color,
  ShaderMaterial,
  TextureLoader,
  PlaneGeometry,
  LinearFilter,
} from "three";
import { data } from "../data";
import { memo } from "react";
import { lerp } from "three/src/math/MathUtils.js";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

extend({ InstancedMesh2 });

const interpolateColor = (color1, color2, factor) => {
  return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
};

const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

export const Shape = () => {
  const ref = useRef();

  const texture = useLoader(TextureLoader, "./texture.png");
  texture.magFilter = LinearFilter;
texture.minFilter = LinearFilter;
texture.generateMipmaps = false;

  const geometry = useMemo(() => new PlaneGeometry(1, 1, 1, 1), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { 
          uSelected: { value: 0 },
          redColor: { value: new Color(0x700b03) },
          uTexture: { value: texture },
          baseColor: { value: new Color(0xffffff) },
          shouldBeRed: { value: false }
        },        
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        defines: {
          USE_INSTANCING: true,
          USE_INSTANCING_INDIRECT: true,
        },
      }),
    [texture]
  );

  const startColor = [212, 212, 212];
  const endColor = [0, 0, 0];

  const getFactor = (index) => index / data.length;

  useEffect(() => {
    if (ref.current) {
      ref.current.initUniformsPerInstance({ fragment: { baseColor: "vec3", shouldBeRed: "float" } });
    }
  }, []);

  const sequenceSize = 9;
const spacing = 0.8;
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    const { hoveredSequence, selectedSequence, selectedIndex } = useDNAStore.getState();

    if (ref.current.instancesCount < data.length - 1) {
      ref.current.addInstances(1, (obj, index) => {
        obj.position.set(
          0,
          data[data.length - index - 1].y * 3,
          index * 0.4 - (data.length / 2) * 0.3
        );
        obj.baseZ = obj.position.z;
        obj.baseY = obj.position.y;
        obj.targetY = obj.position.y + 1.5;
        obj.rotateY(-1);
        obj.rotateZ(-0.12 * index);
        obj.sequence = Math.floor(index / sequenceSize) + 1;
        obj.indexInSequence = index % sequenceSize;
        const scale = 4 + Math.abs(Math.sin(index / data.length));
        obj.scaleTarget = scale;
        obj.scale.set(0, 0, 0);
        obj.scaleTarget = (scale, scale, scale);
        const color = new Color(
          rgbToHex(...interpolateColor(startColor, endColor, getFactor(index)))
        );


        obj.setUniform('baseColor', color)
        obj.setUniform('shouldBeRed', 0.0);
        obj.shouldBeRed = 0.0;

      });
    }

    const transformSpeed = 4;
    ref.current.updateInstances((obj) => {
      obj.rotateZ(-0.001);
      
      const current = obj.shouldBeRed;
      const target = obj.sequence === hoveredSequence ? 1. : 0.;
      obj.shouldBeRed = lerp(current, target, 12 * delta)
      obj.setUniform('shouldBeRed', obj.shouldBeRed);
    
      let targetZ = obj.baseZ;
      let targetY = selectedIndex === obj.indexInSequence && obj.sequence === selectedSequence ? obj.targetY : obj.baseY;
    
      if (obj.sequence === selectedSequence) {
        targetZ = obj.baseZ + spacing + obj.indexInSequence * spacing;
      } else if (obj.sequence > selectedSequence) {
        targetZ = obj.baseZ + sequenceSize * spacing;
      }
    
  
      obj.position.z = lerp(obj.position.z, targetZ, transformSpeed * delta);
      obj.position.y = lerp(obj.position.y, targetY, transformSpeed * delta);

      if(obj.scale.x < obj.scaleTarget){
        obj.scale.x = lerp(obj.scale.x, obj.scaleTarget, (transformSpeed / 2) * delta);
        obj.scale.y = lerp(obj.scale.y, obj.scaleTarget, (transformSpeed / 2) * delta);
        obj.scale.z = lerp(obj.scale.z, obj.scaleTarget, (transformSpeed / 2) * delta);
      }
    
    });
  });

  return (
    <instancedMesh2
      ref={ref}
      args={[geometry, material, { createEntities: true }]}
    />
  );
};

export default memo(Shape);
