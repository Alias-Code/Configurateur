/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { useMediaQuery, useTheme } from "@mui/material";
import { useFrame } from "@react-three/fiber";
import InstructionAnimation from "./InstructionAnimation";

// --- STYLES DE CANVAS ---

const canvasStyle = (isXs, upXXL, size, color, animation, hoverCopy, calculationMiddle, isIcon) => css`
  ${size.width > 0 &&
  size.height > 0 &&
  `
  canvas {
    max-width: ${size.width}px;
    max-height: ${size.height}px;
    }
  `}

  ${!isIcon &&
  `
    height: 25vh !important;
    cursor: pointer;
  `}

  ${hoverCopy === color &&
  `
    transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
    transform: translateX(-20px) scale(1.1);
  `}

  ${animation && animation === color
    ? `
    transform: translate(${calculationMiddle()}px, ${isXs ? "150px" : upXXL ? "350px" : "250px"}) scale(1.7);
    
    transition: transform 0.75s cubic-bezier(0.60, 0.2, 0.05, 1);
    z-index: 1000;
    cursor: grab;
  `
    : `
    transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), 
                filter 0.6s cubic-bezier(0.25, 0.1, 0.25, 1); 
    
    &:hover {
      transform: translateX(-20px) scale(1.1);
    }
  `}
`;

// --- COMPOSANT MODEL ---

function Model({
  scale,
  color,
  animation,
  instructionAnimation,
  setInstructionAnimation,
  resetRotation,
  setResetRotation,
  orbitControls,
}) {
  const { scene } = useLoader(GLTFLoader, `/models/${color}.glb`);
  const mesh = useRef();
  const elapsedRef = useRef(0);
  const shouldAnimate = useRef(false);

  // ACTIVATION & RESET DE L'ANIMATION

  useEffect(() => {
    if (animation === color && instructionAnimation) {
      shouldAnimate.current = true;
    }
  }, [animation, color, instructionAnimation]);

  // ANIMATION PLAQUE INSTRUCTION

  useFrame((state, delta) => {
    const OPACITY_TIME = 0.4;
    const TOTAL_ANIMATION_TIME = 4 - OPACITY_TIME;
    const ROTATION_RIGHT = -0.7;
    const ROTATION_LEFT = 0.7;
    const STAGE_DURATION = TOTAL_ANIMATION_TIME / 3;

    if (mesh.current && shouldAnimate.current) {
      if (elapsedRef.current < TOTAL_ANIMATION_TIME && animation === color) {
        // INCREMENTATION DU TEMPS
        elapsedRef.current += delta;

        if (elapsedRef.current < STAGE_DURATION) {
          // ETAPE 1

          const progress = elapsedRef.current / STAGE_DURATION;
          mesh.current.rotation.y = (0 + ROTATION_RIGHT) * progress;
        } else if (elapsedRef.current < 2 * STAGE_DURATION) {
          // ETAPE 2

          const progress = (elapsedRef.current - STAGE_DURATION) / STAGE_DURATION;
          mesh.current.rotation.y = ROTATION_RIGHT + (ROTATION_LEFT - ROTATION_RIGHT) * progress;
        } else if (elapsedRef.current < TOTAL_ANIMATION_TIME) {
          // ETAPE 3

          const progress = (elapsedRef.current - 2 * STAGE_DURATION) / STAGE_DURATION;
          mesh.current.rotation.y = ROTATION_LEFT - ROTATION_LEFT * progress;
        }
      } else {
        setInstructionAnimation(false);
        shouldAnimate.current = false;
      }
    }
  });

  // --- RESET AFTER 3 SECONDS WITHOUT MOVEMENT ---

  useFrame(() => {
    if (animation && animation === color && resetRotation && !shouldAnimate.current) {
      if (orbitControls) {
        orbitControls.reset();
      }

      setResetRotation(false);
    }
  });

  return (
    <mesh
      ref={mesh}
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
      rotation={animation === color ? [0, 0, 0] : [0, Math.PI / 5, 0]}>
      <primitive object={scene} />
    </mesh>
  );
}

function Model3D({ color, width, animation, onClick, setOrbitControls, orbitControls, hoverCopy, setHoverCopy }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const [instructionAnimation, setInstructionAnimation] = useState(false);
  const [resetRotation, setResetRotation] = useState(false);
  const [size, setSize] = useState({});

  const inactivityTimeout = useRef(null);
  const canvasRef = useRef(null);
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const upXXL = useMediaQuery((theme) => theme.breakpoints.up("xxl"));

  // --- RESET AFTER 3 SECONDS WITHOUT MOVEMENT ---

  function handleOrbitControlsUpdate() {
    clearTimeout(inactivityTimeout.current);

    inactivityTimeout.current = setTimeout(() => {
      setResetRotation(true);
    }, 2000);
  }

  useEffect(() => {
    if (orbitControls) {
      orbitControls.addEventListener("change", handleOrbitControlsUpdate);
    }

    return () => {
      if (orbitControls) {
        orbitControls.removeEventListener("change", handleOrbitControlsUpdate);
      }
    };
  }, [orbitControls]);

  // --- ADJUST PLAQUE SIZE ---

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(() => {
        setSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }, 2000);
    }
  }, []);

  // --- RESET ORBIT CONTROL IF SELECTED OTHER PLAQUE ---

  useEffect(() => {
    if (orbitControls) {
      orbitControls.reset();
    }
  }, [animation, orbitControls]);

  // --- START INSTRUCTION AFTER SELECTION ---

  useEffect(() => {
    if (animation === color && !instructionAnimation) {
      // ATTENDRE L'ANIMATION DE LA PLAQUE

      setTimeout(() => {
        setInstructionAnimation(true);
      }, 2000);
    }

    return () => {
      setInstructionAnimation(false);
    };
  }, [animation, color]);

  // --- HANDLERS ---

  function handleMouseEnter(color) {
    setHoverCopy(`${color}_duplicate`);
  }

  function handleMouseLeave() {
    setHoverCopy(null);
  }

  // --- FONCTIONS UTILES ---

  function getModelScale() {
    if (isXs) return 0.03;
    if (isSm) return 0.035;
    if (isMd) return 0.05;
    return 0.05;
  }

  function calculationMiddle() {
    let defaultWidth = width / 3.8;
    switch (color) {
      case "Noir":
        return defaultWidth;
      case "CanonDeFusil":
        return defaultWidth / 1.6;
      case "Acier":
        return defaultWidth / 5;
      case "Bronze":
        return -defaultWidth / 5;
      case "Laiton":
        return -defaultWidth / 1.6;
      case "BlancMat":
        return -defaultWidth;
      default:
        return null;
    }
  }

  // --- RENDU DU CANVAS ---

  return (
    <>
      {/* INSTRUCTIONS */}

      {instructionAnimation && <InstructionAnimation calculationMiddle={calculationMiddle} isXs={isXs} upXXL={upXXL} />}

      {/* CANVA */}

      <Canvas
        ref={canvasRef}
        css={() => canvasStyle(isXs, upXXL, size, color, animation, hoverCopy, calculationMiddle, false)}
        onClick={onClick}
        onMouseEnter={() => handleMouseEnter(color)}
        onMouseLeave={handleMouseLeave}>
        {/* LIGHTS */}

        <ambientLight intensity={1.8} />
        <spotLight position={[10, 10, 10]} intensity={1} castShadow />

        {/* MODEL 3D */}

        <Model
          scale={getModelScale()}
          color={color}
          animation={animation}
          instructionAnimation={instructionAnimation}
          setInstructionAnimation={setInstructionAnimation}
          resetRotation={resetRotation}
          setResetRotation={setResetRotation}
          orbitControls={orbitControls}
        />

        {/* MOVEMENT SYSTEM */}

        {!instructionAnimation && animation === color && (
          <OrbitControls
            ref={(ref) => setOrbitControls(ref)}
            enableZoom={false}
            enablePan={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI - Math.PI / 2}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
          />
        )}
      </Canvas>
    </>
  );
}

export default Model3D;
