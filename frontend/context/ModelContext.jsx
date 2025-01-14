// ModelContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ModelContext = createContext();

export function ModelProvider({ children }) {
  const [models, setModels] = useState({});

  useEffect(() => {
    const loader = new GLTFLoader();
    const colors = ["Noir", "CanonDeFusil", "Acier", "Bronze", "Laiton", "BlancMat"];

    // Charge tous les modèles une seule fois au démarrage de l'app
    Promise.all(colors.map((color) => loader.loadAsync(`/models/${color}.glb`).then((model) => [color, model]))).then(
      (loadedModels) => {
        const modelMap = Object.fromEntries(loadedModels);
        setModels(modelMap);
      }
    );
  }, []);

  return <ModelContext.Provider value={models}>{children}</ModelContext.Provider>;
}

export function useModels() {
  return useContext(ModelContext);
}

// Modifiez votre Model3D.jsx
function Model3D({ color, ...props }) {
  const models = useModels();

  if (!models[color]) return null;

  return (
    <Canvas {...props}>
      <mesh>
        <primitive object={models[color].scene.clone()} />
      </mesh>
    </Canvas>
  );
}

export default Model3D;
