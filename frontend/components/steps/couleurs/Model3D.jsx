/** @jsxImportSource @emotion/react */
import gsap from "gsap/dist/gsap";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import InstructionAnimation from "../../common/animation/InstructionAnimation.jsx";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { useMediaQueries } from "../../../config/config.js";

// --- STYLES DE CANVAS ---

const canvasStyle = (isXs, upXXL, size, color, animation, calculationMiddle, isHovered) => css`
  overflow: visible;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200%;
  transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);

  canvas {
    width: ${animation ? "1000px" : size.width} !important;
    height: "25vh" !important;
    transition: none !important;
  }

  ${animation === color
    ? `
    transform: translate(${calculationMiddle()}px, ${isXs ? "190px" : upXXL ? "350px" : "250px"}) scale(1.7);
    transition: all 0.8s cubic-bezier(0.60, 0.2, 0.05, 1);
    z-index: 1000;
    cursor: grab;
    `
    : isHovered === color
    ? `
    transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
    transform: translateX(-15px) scale(1.1); 
    `
    : ``}
`;

// --- COMPOSANT MODEL ---

function Model({ scale, color, animation, instructionAnimation, setInstructionAnimation, hasBeenMoved }) {
  const { scene } = useLoader(GLTFLoader, `/models/${color}.glb`);
  const mesh = useRef();
  const timeline = useRef();
  const initialRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (
      !sessionStorage.getItem("instructionShown") &&
      animation === color &&
      instructionAnimation &&
      !hasBeenMoved &&
      mesh.current
    ) {
      initialRotation.current = {
        x: mesh.current.rotation.x,
        y: mesh.current.rotation.y,
        z: mesh.current.rotation.z,
      };

      timeline.current = gsap.timeline({
        onComplete: () => {
          if (mesh.current) {
            gsap.to(mesh.current.rotation, {
              x: initialRotation.current.x,
              y: initialRotation.current.y,
              z: initialRotation.current.z,
              duration: 0.2,
              ease: "power2.inOut",
              onComplete: () => setInstructionAnimation(false),
            });
          }
        },
      });

      timeline.current
        .to(mesh.current.rotation, { y: -0.4, duration: 0.8, ease: "power2.inOut" })
        .to(mesh.current.rotation, { y: 0.4, duration: 0.8, ease: "power2.inOut" })
        .to(mesh.current.rotation, { y: 0, duration: 0.8, ease: "power2.inOut" });

      return () => {
        if (timeline.current) timeline.current.kill();
      };
    }
  }, [animation, color, instructionAnimation, hasBeenMoved, setInstructionAnimation]);

  useEffect(() => {
    if (mesh.current && animation !== color) {
      gsap.to(mesh.current.rotation, {
        x: 0,
        y: Math.PI / 5,
        z: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [animation, color]);

  // Nettoyage des ressources Three.js
  useEffect(() => {
    return () => {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    };
  }, [scene]);

  return (
    <mesh
      ref={mesh}
      scale={[scale, scale, scale]}
      position={animation === color ? [0, -2.3, 0] : [0, -2.2, 0]}
      rotation={animation === color ? [0, 0, 0] : [0, Math.PI / 5, 0]}>
      <primitive object={scene} />
    </mesh>
  );
}

// --- COMPOSANT PRINCIPAL OPTIMISÉ ---

function Model3D({ color, width, animation, setOrbitControls, orbitControls, isHovered }) {
  const { IS_XS, IS_SM, IS_MD, UP_XL, UP_XXL, IS_MOBILE } = useMediaQueries();
  const [instructionAnimation, setInstructionAnimation] = useState(false);
  const [resetRotation, setResetRotation] = useState(false);
  const [size, setSize] = useState({});
  const [hasBeenMoved, setHasBeenMoved] = useState(false);
  const [camera, setCamera] = useState(null);

  const inactivityTimeout = useRef(null);
  const instructionTimeout = useRef(null);
  const canvasRef = useRef(null);

  // Gestion des événements OrbitControls
  function handleOrbitControlsStart() {
    if (!hasBeenMoved) setHasBeenMoved(true);
    clearTimeout(inactivityTimeout.current);
  }

  function handleOrbitControlsEnd() {
    clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(() => {
      if (orbitControls) {
        gsap.to(orbitControls.object.position, {
          duration: 1,
          x: 0,
          y: 0,
          z: 5,
          ease: "power2.inOut",
          onComplete: () => {
            setResetRotation(true);
            orbitControls.update();
          },
        });
      }
    }, 750);
  }

  useEffect(() => {
    if (animation === color && orbitControls) {
      orbitControls.addEventListener("start", handleOrbitControlsStart);
      orbitControls.addEventListener("end", handleOrbitControlsEnd);
    }
    return () => {
      if (orbitControls) {
        orbitControls.removeEventListener("start", handleOrbitControlsStart);
        orbitControls.removeEventListener("end", handleOrbitControlsEnd);
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [animation, color, orbitControls]);

  // Ajustement de la taille du Canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && camera) {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (orbitControls) orbitControls.update();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, orbitControls]);

  // Reset OrbitControls si une autre plaque est sélectionnée
  useEffect(() => {
    if (orbitControls) orbitControls.reset();
  }, [animation, orbitControls]);

  // Animation d'instruction
  useEffect(() => {
    if (animation === color && !instructionAnimation) {
      instructionTimeout.current = setTimeout(() => {
        setInstructionAnimation(true);
      }, 1000);
    }
    return () => {
      if (instructionTimeout.current) clearTimeout(instructionTimeout.current);
      setInstructionAnimation(false);
    };
  }, [animation, color]);

  // Fonctions responsive
  function getModelScale() {
    let size = IS_XS ? 45 : IS_SM ? 48 : IS_MD ? 50 : UP_XXL ? 55 : 50;
    return animation === color ? size * 1.07 : size;
  }

  function getAdjustedMoveValue(moveValue) {
    const isPositive = moveValue >= 0;
    if (IS_XS) return isPositive ? moveValue * 1.25 : moveValue / 0.95;
    if (IS_SM) return isPositive ? moveValue * 1 : moveValue / 1.4;
    if (IS_MD) return isPositive ? moveValue * 1.2 : moveValue / 1.5;
    if (UP_XL) return isPositive ? moveValue * 1 : moveValue / 1.175;
    if (UP_XXL) return isPositive ? moveValue * 2 : moveValue / 1.1;
    return moveValue;
  }

  function calculationMiddle() {
    let defaultWidth = width / 4;
    switch (color) {
      case "Noir":
        return getAdjustedMoveValue(defaultWidth / 1);
      case "CanonDeFusil":
        return getAdjustedMoveValue(defaultWidth / 1.7);
      case "Acier":
        return getAdjustedMoveValue(defaultWidth / 6);
      case "Bronze":
        return getAdjustedMoveValue(-defaultWidth / 3.5);
      case "Laiton":
        return getAdjustedMoveValue(-defaultWidth / 1.25);
      case "BlancMat":
        return getAdjustedMoveValue(-defaultWidth / 0.75);
      default:
        return 0;
    }
  }

  return (
    <>
      {instructionAnimation && !hasBeenMoved && !sessionStorage.getItem("instructionShown") && (
        <InstructionAnimation calculationMiddle={calculationMiddle} isXs={IS_XS} upXXL={UP_XXL} />
      )}
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
          toneMappingExposure: color === "BlancMat" ? 0.3 : animation === color ? 0.7 : 0.5,
          powerPreference: "low-power",
          antialias: !IS_MOBILE,
        }}
        dpr={IS_MOBILE ? 1 : Math.min(window.devicePixelRatio, 2)} // Limite DPR pour perf
        ref={canvasRef}
        css={() => canvasStyle(IS_XS, UP_XXL, size, color, animation, calculationMiddle, isHovered)}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={({ camera }) => setCamera(camera)}>
        <Environment
          files={color === "Acier" ? "/overcast_soil_puresky_1k.hdr" : "/aristea_wreck_puresky_1k.hdr"}
          environmentRotation={animation === color ? [0, Math.PI / 8, 12] : [1, Math.PI / 6, 7]}
          environmentIntensity={
            color !== animation && color === "BlancMat"
              ? 3
              : color !== animation
              ? 1
              : color === "Bronze"
              ? 2.5
              : color === "Noir"
              ? 4.5
              : color === "CanonDeFusil"
              ? 2.5
              : color === "BlancMat"
              ? 3.5
              : 1.5
          }
        />
        <Model
          scale={getModelScale()}
          color={color}
          hasBeenMoved={hasBeenMoved}
          animation={animation}
          instructionAnimation={instructionAnimation}
          setInstructionAnimation={setInstructionAnimation}
        />
        {animation === color && (
          <OrbitControls
            ref={(ref) => setOrbitControls(ref)}
            enableZoom={false}
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
          />
        )}
      </Canvas>
    </>
  );
}

export default Model3D;
