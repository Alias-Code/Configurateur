import React, { useState, useEffect } from "react";
import { TitleStyle } from "../../Global/SharedStyle";
import styled from "@emotion/styled";
import GravureEmplacement from "./GravuresSteps/GravureEmplacement";
import GravureSettings from "./GravuresSteps/GravureSettings";
import GravureRender from "./GravuresSteps/GravureRender";
import GravureSettingsSelection from "./GravuresSteps/GravureSettingsSelection";

const ModalBackground = styled.div`
  position: fixed;
  z-index: 999999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease-in-out;

  &.open {
    opacity: 1;
  }

  &.close {
    opacity: 0;
  }
`;

const ModalContent = styled.div`
  width: 80%;
  height: 80%;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  padding: 40px;
  transition: opacity 0.5s ease-in-out;

  hr {
    border: 0.5px solid black;
    opacity: 1;
    width: 100%;
    margin: 1.5rem auto;
  }

  &.open {
    opacity: 1;
  }

  &.close {
    opacity: 0;
  }
`;

const GravureHeader = styled.div`
  position: relative;
  img {
    position: absolute;
    z-index: 99999;
    right: -0.5%;
    top: 50%;
    width: 2rem;
    height: 2rem;
    padding-right: 0px;
    transform: translateY(-50%);
  }
`;

const GravureMain = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
  height: fit-content !important;

  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    padding-right: 0px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  > button {
    margin-top: auto !important;
    margin: 0 auto;
  }
`;

const RightSide = styled.div`
  flex: 1;
`;

const ValidateButton = styled.button`
  background-color: rgb(36, 94, 36, 0.85) !important;
  border-radius: 8px;
  width: 90%;
  padding: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;

  img {
    width: 1.4rem;
    height: auto;
    filter: invert(1);
  }

  p {
    color: black;
    font-weight: bold;
  }
`;

export default function GravureModal({ onClose }) {
  const [animationState, setAnimationState] = useState("close");

  const [emplacements, setEmplacements] = useState({
    emplacement1: {
      enable: false,
    },
    emplacement2: {
      enable: false,
    },
    selected: "",
  });

  // --- TOGLE ENABLE & SELECTION ---

  const handleToggleEmplacement = (key) => {
    setEmplacements((prev) => ({
      ...prev,
      selected: key,
      [key]: {
        ...prev[key],
        enable: true,
      },
    }));
  };

  // --- OPEN & CLOSE ANIMATION ---

  useEffect(() => {
    const timer = setTimeout(() => setAnimationState("open"), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimatedClose = () => {
    setAnimationState("close");
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <ModalBackground className={animationState}>
      <ModalContent className={animationState} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <GravureHeader>
          <TitleStyle>Configurez Votre Gravure</TitleStyle>
          <img src="/close.svg" alt="Fermer la fenêtre de gravure" onClick={handleAnimatedClose} />
        </GravureHeader>

        <hr />

        {/* MAIN */}

        <GravureMain>
          <LeftSide>
            {/* GRAVURES EMPLACEMENT */}
            <GravureEmplacement emplacements={emplacements} handleToggleEmplacement={handleToggleEmplacement} />

            {/* GRAVURE SETTINGS */}
            <GravureSettings />

            {/* GRAVURE SETTING SELECTION */}
            <GravureSettingsSelection />

            {/* VALIDATE GRAVURE */}
            <ValidateButton>
              <img src="checkout.svg" alt="" />
              <p>AJOUTER LA GRAVURE</p>
            </ValidateButton>
          </LeftSide>

          <RightSide>
            {/* GRAVURES RENDER */}
            <GravureRender />
          </RightSide>
        </GravureMain>
      </ModalContent>
    </ModalBackground>
  );
}
