import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useModalContext } from "../../../context/ModalContext";

const MecanismeImage = styled.div`
  position: absolute;
  top: ${({ positiony, getup }) => (getup ? `calc(${positiony} - 1%)` : positiony)};
  left: ${({ positionx }) => positionx};
  transform: translate(-50%, -50%);
  width: ${({ dimension }) => dimension};
  height: ${({ dimension }) => dimension};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ index }) => index};
  transition: all 0.5s ease;
`;

const CancelZone = styled.div`
  position: absolute;
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
  cursor: pointer;
  pointer-events: auto;
  top: ${({ positiony }) => positiony};
  left: ${({ positionx }) => positionx};
  transform: translate(-50%, -50%);
`;

const CancelImage = styled.img`
  width: 1.2rem !important;
  height: 1.2rem;
  border-radius: 40%;
  backdrop-filter: blur(2px);
  opacity: ${({ hovered }) => (hovered ? 1 : 0)};
  visibility: ${({ hovered }) => (hovered ? "visible" : "hidden")};
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;

const Mecanisme = ({ src, positionY, positionX, dimension, item, type }) => {
  const [isHovered, setHovered] = useState(false);
  const [index, setIndex] = useState(1000);
  const [cancelPosition, setCancelPosition] = useState({ x: positionX, y: positionY });
  const { openModal } = useModalContext();

  const getUp = item.id.includes("TV");

  useEffect(() => {
    if (item.id.includes("LI-")) {
      const x = `${parseFloat(positionX) - 10}%`;
      const y = `${parseFloat(positionY) - 20}%`;
      setCancelPosition({ x, y });
      setIndex(2000);
    } else {
      setCancelPosition({ x: positionX, y: positionY });
    }
  }, [item, positionX, positionY]);

  return (
    <div>
      <CancelZone
        positiony={cancelPosition.y}
        positionx={cancelPosition.x}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <CancelImage
          hovered={isHovered && type !== "mobilePreview"}
          onClick={() => openModal({ type: "preview", data: item })}
          src="/cancel.svg"
          alt="Suppression de l'item"
        />
      </CancelZone>
      <MecanismeImage positiony={positionY} positionx={positionX} dimension={dimension} getup={getUp} index={index}>
        <img src={src} alt="Image du mécanisme" />
      </MecanismeImage>
    </div>
  );
};

export default Mecanisme;
