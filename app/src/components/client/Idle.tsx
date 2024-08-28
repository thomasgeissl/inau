import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import {
  Clouds,
  Cloud,
  CameraControls,
  Sky as SkyImpl,
  StatsGl,
} from "@react-three/drei";

interface IdleProps {}
function Sky() {
  const ref = useRef<any>();
  const cloud0 = useRef<any>();
  useFrame((state, delta) => {
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime)/10000;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime)/10000;
    cloud0.current.rotation.y -= delta/10;
  });

  return (
    <>
      <SkyImpl></SkyImpl>
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400}>
          <Cloud ref={cloud0} color={"ffff88"} />
          <Cloud
            concentrate="outside"
            growth={100}
            color="#ffccdd"
            opacity={0.7}
            seed={0.3}
            bounds={200}
            volume={200}
          />
        </Clouds>
      </group>
    </>
  );
}

const Idle: React.FC<IdleProps> = () => {
  return (
    <Canvas style={{opacity:0.2}}>
     {/* 1000 <CameraControls></CameraControls> */}
      <ambientLight intensity={Math.PI / 8} />
      {/* <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      /> */}
      {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
      <Sky></Sky>
    </Canvas>
  );
};

export default Idle;
