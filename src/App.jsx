import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Experience } from "./Experience";
import { Ui } from "./Ui";
import { Perf } from "r3f-perf";


function App() {

  return (
    <>
    <div className="canvas-container">
      <Canvas camera={{position:[-12,-1,10]}}>
        <color attach="background" args={["#C1C1C1"]} />
        <Experience/>
        <OrbitControls/>
        <Perf/>
      </Canvas>
      <Ui/>
    </div>
    </>
  )
}

export default App
