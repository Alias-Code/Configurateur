/** @jsxImportSource @emotion/react */
import gsap from "gsap";
import InstructionAnimation from "../../common/animation/InstructionAnimation.jsx";
import React, { useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
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

  // --- ANIMATION D'INSTRUCTION ---

  useEffect(() => {
    if (
      !sessionStorage.getItem("instructionShown") &&
      animation === color &&
      instructionAnimation &&
      !hasBeenMoved &&
      mesh.current
    ) {
      // Sauvegarde de la rotation initiale
      initialRotation.current = {
        x: mesh.current.rotation.x,
        y: mesh.current.rotation.y,
        z: mesh.current.rotation.z,
      };

      timeline.current = gsap.timeline({
        onComplete: () => {
          if (mesh.current) {
            gsap.to(mesh.current.rotation, {
              onComplete: () => {
                setInstructionAnimation(false);
              },
            });
          }
        },
      });

      // ÉTAPE DES ANIMATIONS

      timeline.current
        .to(mesh.current.rotation, {
          y: -0.4,
          duration: 0.8,
          ease: "power2.inOut",
        })
        .to(mesh.current.rotation, {
          y: 0.4,
          duration: 0.8,
          ease: "power2.inOut",
        })
        .to(mesh.current.rotation, {
          y: 0,
          duration: 0.8,
          ease: "power2.inOut",
        });
    }

    // SI L'ANIMATION EST INTERROMPUE / TERMINÉE

    return () => {
      if (timeline.current) {
        timeline.current.kill();

        // REINITIALISE L'AXE 0

        if (mesh.current) {
          gsap.to(mesh.current.rotation, {
            x: initialRotation.current.x,
            y: initialRotation.current.y,
            z: initialRotation.current.z,
            duration: 0.2,
            ease: "power2.inOut",
            onComplete: () => {
              setInstructionAnimation(false);
              sessionStorage.setItem("instructionShown", "true");
            },
          });
        }
      }
    };
  }, [animation, color, instructionAnimation, hasBeenMoved]);

  // --- RETOUR DE LA PLAQUE EN DIAGONALE SI ELLE N'EST PLUS SELECTIONNÉE ---

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

function Model3D({ color, width, animation, setOrbitControls, orbitControls, isHovered }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { IS_XS, IS_SM, IS_MD, UP_XL, UP_XXL } = useMediaQueries();
  const [instructionAnimation, setInstructionAnimation] = useState(false);
  const [resetRotation, setResetRotation] = useState(false);
  const [size, setSize] = useState({});
  const [hasBeenMoved, setHasBeenMoved] = useState(false);
  const [camera, setCamera] = useState(null);

  const inactivityTimeout = useRef(null);
  const instructionTimeout = useRef(null);
  const canvasRef = useRef(null);

  // --- RESET LE TIMER SI IL BOUGE LE MODELE + CHECK SI IL A ETE TOUCHE POUR ANNULER L'ANIMATION D'INSTRUCTION ---

  function handleOrbitControlsStart() {
    if (!hasBeenMoved) {
      setHasBeenMoved(true);
    }

    clearTimeout(inactivityTimeout.current);
  }

  // --- DEMARRE UN TIMER A LA FIN DU CONTROL ---

  function handleOrbitControlsEnd() {
    clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(() => {
      // SI LE TEMPS EST ECOULE SANS BOUGER LE MODELE

      if (orbitControls) {
        const duration = 1;

        gsap.to(orbitControls.object.position, {
          duration,
          x: 0,
          y: 0,
          z: 5, // POSITION DE LA CAMERA
          ease: "power2.inOut",
          onComplete: () => {
            setResetRotation(true);
            orbitControls.update();
          },
        });
      }
    }, 500);
  }

  // --- EVENT START & END ORBIT CONTROL ---

  useEffect(() => {
    if (animation === color && orbitControls) {
      orbitControls.addEventListener("start", handleOrbitControlsStart);
      orbitControls.addEventListener("end", handleOrbitControlsEnd);
    }

    return () => {
      if (orbitControls) {
        orbitControls.removeEventListener("start", handleOrbitControlsStart);
        orbitControls.removeEventListener("end", handleOrbitControlsEnd);
      }
    };
  }, [orbitControls]);

  // --- ADJUST PLAQUE SIZE ---

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && camera) {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        if (orbitControls) {
          orbitControls.update();
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, orbitControls]);

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

      instructionTimeout.current = setTimeout(() => {
        setInstructionAnimation(true);
      }, 1000);
    }

    return () => {
      if (instructionTimeout.current) {
        clearTimeout(instructionTimeout.current);
        instructionTimeout.current = null;
      }
      setInstructionAnimation(false);
    };
  }, [animation, color]);

  // --- RESPONSIVE FUNCTIONS ---

  function getModelScale() {
    if (IS_XS) return 0.045;
    if (IS_SM) return 0.048;
    if (IS_MD) return 0.05;
    return 0.05;
  }

  const getAdjustedMoveValue = (moveValue) => {
    const isPositive = moveValue < 0 ? false : true;

    if (IS_XS) return isPositive ? moveValue * 1.25 : moveValue / 0.95;
    if (IS_SM) return isPositive ? moveValue * 1 : moveValue / 1.4;
    if (IS_MD) return isPositive ? moveValue * 1.2 : moveValue / 1.5;
    if (UP_XL) return isPositive ? moveValue * 1 : moveValue / 1.175;
    if (UP_XXL) return isPositive ? moveValue * 2 : moveValue / 1.1;
    return moveValue;
  };

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
        return null;
    }
  }

  // --- RENDU DU CANVAS ---

  return (
    <>
      {/* INSTRUCTIONS */}

      {instructionAnimation && !hasBeenMoved && !sessionStorage.getItem("instructionShown") && (
        <InstructionAnimation calculationMiddle={calculationMiddle} isXs={IS_XS} upXXL={UP_XXL} />
      )}

      {/* CANVA */}

      <Canvas
        ref={canvasRef}
        css={() => canvasStyle(IS_XS, UP_XXL, size, color, animation, calculationMiddle, isHovered)}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={({ camera }) => setCamera(camera)}>
        {/* LIGHTS */}

        <ambientLight intensity={1.8} />
        <spotLight position={[10, 10, 10]} intensity={1} castShadow />

        {/* MODEL 3D */}

        <Model
          scale={getModelScale()}
          color={color}
          hasBeenMoved={hasBeenMoved}
          animation={animation}
          instructionAnimation={instructionAnimation}
          setInstructionAnimation={setInstructionAnimation}
          resetRotation={resetRotation}
          setResetRotation={setResetRotation}
          orbitControls={orbitControls}
        />

        {/* MOVEMENT SYSTEM */}

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
