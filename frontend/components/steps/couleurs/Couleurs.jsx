/** @jsxImportSource @emotion/react */
import Steps from "../../configuration/config-side/StepContainer.jsx";
import Model3D from "./Model3D.jsx";
import productInformations from "../../../config/productInformations.js";
import { useState, useCallback, useRef, useEffect } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useAnimationContext } from "../../../Context/AnimationContext.jsx";

productInformations.Couleurs.forEach((item) => {
  const colorName = item.name.replace("Couleur ", "").replace(/\s+/g, "");
  useLoader.preload(GLTFLoader, `/models/${colorName}.glb`);
});

export default function Couleurs() {
  // --- ÉTATS ET RÉFÉRENCES ---
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hoverCopy, setHoverCopy] = useState(false);

  const { animation, setAnimationStarted, orbitControls, setOrbitControls } = useAnimationContext();

  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const upXl = useMediaQuery(theme.breakpoints.up("xl"));
  const upXXL = useMediaQuery((theme) => theme.breakpoints.up("xxl"));

  // --- FIX MODEL WIDTH ---

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    updateWidth();
  }, []);

  // --- RESPONSIVE ADJUSTMENT ---

  const getAdjustedMoveValue = (moveValue) => {
    if (isXs) return moveValue / 1;
    if (isSm) return moveValue * 1.4;
    if (isMd) return moveValue * 1;
    if (upXl) return moveValue * 1.2;
    if (upXXL) return moveValue * 1.5;
    return moveValue;
  };

  const handleModelClick = useCallback(
    (color) => {
      setAnimationStarted(color);
    },
    [setAnimationStarted]
  );

  // --- RENDER ---

  return (
    <Grid
      ref={containerRef}
      container
      css={{
        padding: animation ? (isXs ? "0 0 7rem 0" : upXXL ? "0 0 25rem 0" : "0 0 15rem 0") : "0",
        transition: "padding 0.5s ease",
      }}>
      <Steps
        name="NOS COULEURS"
        description="Vous pouvez réaliser des coloris sur-mesure selon vos projets, avec des quantités minimales."
        category="couleurs"
        width={width}>
        {productInformations.Couleurs.map((item, index) => {
          const colorName = item.name.replace("Couleur ", "").replace(/\s+/g, "");

          return (
            <Grid
              css={{
                position: "relative",
                left: `-${getAdjustedMoveValue(item.value)}%`,
                transform: "translateX(90%)",
              }}
              item
              xs={2}
              sm={2}
              md={2}
              lg={2}
              key={item.id}
              id={item.id}
              name={item.name}>
              <Model3D
                color={colorName}
                key={item.id}
                width={width}
                animation={animation}
                onClick={() => handleModelClick(colorName)}
                setOrbitControls={setOrbitControls}
                orbitControls={orbitControls}
                isHovered={hoverCopy}
                setHoverCopy={setHoverCopy}
              />
            </Grid>
          );
        })}
      </Steps>
    </Grid>
  );
}
