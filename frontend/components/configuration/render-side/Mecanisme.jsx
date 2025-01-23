import styled from "@emotion/styled";
import React, { useState, useEffect, useRef } from "react";
import { useModalContext } from "../../../context/ModalContext";

const MecanismeImage = styled.div`
  position: absolute;
  top: ${({ positiony }) => positiony};
  left: ${({ positionx }) => positionx};
  transform: translate(-50%, -50%) rotate(-1deg);
  width: ${({ dimension }) => dimension};
  height: ${({ dimension }) => dimension};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999;
  transition: all 0.5s ease;
`;

const CrossImage = styled.img`
  width: 1.2rem !important;
  height: 1.2rem;
  z-index: 99999999;
  position: absolute;
  border-radius: 40%;
  backdrop-filter: blur(3px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease;
  cursor: pointer;

  ${({ hovered }) =>
    hovered &&
    `
    opacity: 1;
    visibility: visible;
  `}

  &:hover {
    transform: scale(1.2);
  }
`;

const Mecanisme = ({ src, positionY, positionX, dimension, item, type }) => {
  const { openModal } = useModalContext();
  const [svgElement, setSvgElement] = useState(null);
  const [isHovered, setHovered] = useState(false);
  const svgContainerRef = useRef(null);

  const handleMouseEnter = () => {
    setTimeout(() => {
      setHovered(true);
    }, 10);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setHovered(false);
    }, 10);
  };

  // useEffect(() => {
  //   const loadSvg = async () => {
  //     try {
  //       const response = await fetch(src, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "image/svg+xml",
  //           "Cross-Origin": "anonymous",
  //         },
  //       });
  //       const svgText = await response.text();
  //       const parser = new DOMParser();
  //       const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  //       const svgElement = svgDoc.documentElement;
  //       setSvgElement(svgElement);
  //     } catch (error) {
  //       console.error("Erreur lors du chargement du SVG:", error);
  //     }
  //   };

  //   loadSvg();
  // }, [src]);

  // useEffect(() => {
  //   if (svgElement && svgContainerRef.current) {
  //     svgContainerRef.current.innerHTML = "";
  //     svgContainerRef.current.appendChild(svgElement);
  //   }
  // }, [svgElement]);

  return (
    <MecanismeImage
      ref={svgContainerRef}
      positiony={positionY}
      positionx={positionX}
      dimension={dimension}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <img src={src} alt="" />
      {isHovered && type !== "mobilePreview" && (
        <CrossImage
          hovered={isHovered}
          onClick={() => openModal({ type: "preview", data: item })}
          src="/cancel.svg"
          alt="Suppression de l'item"
        />
      )}
    </MecanismeImage>
  );
};

export default Mecanisme;
