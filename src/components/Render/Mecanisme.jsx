import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// Composant stylisé pour la gestion du positionnement
const MecanismeImage = styled.div`
  position: absolute;
  top: ${({ positionY }) => positionY};
  left: ${({ positionX }) => positionX};
  transform: translate(-50%, -50%) rotate(-1deg);
  width: ${({ dimension }) => dimension};
  height: ${({ dimension }) => dimension};
`;

// UTILISATION D'UN FETCH NATIF QUI RÉCUPÈRE LES SVG PLUTÔT QUE DE LES RÉCUPÉRER AUTOMATIQUEMENT VIA UNE REQUÊTE HTTP QUI SERA BLOQUÉE PAR LES CORS

const Mecanisme = ({ src, positionY, positionX, dimension }) => {
  const [svgElement, setSvgElement] = useState(null);
  const svgContainerRef = useRef(null);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(src, {
          method: "GET",
          headers: {
            "Content-Type": "image/svg+xml",
            "Cross-Origin": "anonymous",
          },
        });
        const svgText = await response.text();

        // CONVERTIR SVG EN TEXTE

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        setSvgElement(svgElement); // Stocker l'élément SVG dans le state
      } catch (error) {
        console.error("Erreur lors du chargement du SVG:", error);
      }
    };

    loadSvg();
  }, [src]);

  // VIDAGE POUR CHAQUE BOUCLE

  useEffect(() => {
    if (svgElement && svgContainerRef.current) {
      svgContainerRef.current.innerHTML = "";
      svgContainerRef.current.appendChild(svgElement);
    }
  }, [svgElement]);

  return <MecanismeImage ref={svgContainerRef} positionY={positionY} positionX={positionX} dimension={dimension} />;
};

export default Mecanisme;
