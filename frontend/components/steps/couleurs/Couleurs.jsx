/** @jsxImportSource @emotion/react */
import Step from "../../configuration/config-side/Step.jsx";
import Model3D from "./Model3D.jsx";
import styled from "@emotion/styled";
import productInformations from "../../../config/productInformations.js";
import { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useAnimationContext } from "../../../Context/AnimationContext.jsx";
import { useMediaQueries } from "../../../config/config.js";

productInformations.Couleurs.forEach((item) => {
  const colorName = item.name.replace("Couleur ", "").replace(/\s+/g, "");
  useLoader.preload(GLTFLoader, `/models/${colorName}.glb`);
});

const GridStyled = styled(Grid)`
  position: relative;
  left: ${({ left }) => `-${left}%`};
  height: 25vh;
  width: 100%;
  overflow: visible;
`;

const ClickBlock = styled.div`
  content: "";
  z-index: 99999999999999;
  width: 80%;
  height: 20vh;
  position: absolute;
  top: 50%;
  pointer-events: auto;
  transform: translate(65%, -50%);
  cursor: pointer;
`;

export default function Couleurs() {
  // --- ÉTATS ET RÉFÉRENCES ---
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { animation, setAnimationStarted, orbitControls, setOrbitControls } = useAnimationContext();
  const { IS_XS, IS_SM, IS_MD, UP_XL, UP_XXL } = useMediaQueries();

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
    if (IS_XS) return moveValue / 1.4;
    if (IS_SM) return moveValue * 1.4;
    if (IS_MD) return moveValue * 1;
    if (UP_XL) return moveValue * 1.2;
    if (UP_XXL) return moveValue * 1.5;
    return moveValue;
  };

  function handleModelClick(colorName) {
    setAnimationStarted(colorName);
  }

  // --- RENDER ---

  return (
    <Grid
      ref={containerRef}
      container
      css={{
        // PADDING POUR QUE LE MODEL PUISSE DESCENDRE LORSQUE L'ANIMATION COMMENCE
        padding: animation ? (IS_XS ? "0 0 12rem 0" : UP_XXL ? "0 0 25rem 0" : "0 0 15rem 0") : "0",
        transition: "padding 0.5s ease",
      }}>
      <Step
        name="NOS COULEURS"
        description="Vous pouvez réaliser des coloris sur-mesure selon vos projets, avec des quantités minimales."
        category="couleurs"
        width={width}>
        {productInformations.Couleurs.map((item) => {
          const colorName = item.name.replace("Couleur ", "").replace(/\s+/g, "");

          return (
            <GridStyled item lg={2} key={item.id} id={item.id} name={item.name} left={getAdjustedMoveValue(item.value)}>
              <ClickBlock
                onClick={() => handleModelClick(colorName)}
                onMouseEnter={() => setIsHovered(colorName)}
                onMouseLeave={() => setIsHovered(false)}
              />
              <Model3D
                key={item.id}
                color={colorName}
                width={width}
                animation={animation}
                setOrbitControls={setOrbitControls}
                orbitControls={orbitControls}
                isHovered={isHovered}
              />
            </GridStyled>
          );
        })}
      </Step>
    </Grid>
  );
}
