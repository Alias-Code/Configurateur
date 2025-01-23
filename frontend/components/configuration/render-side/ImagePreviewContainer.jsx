import styled from "@emotion/styled";
import Mecanisme from "./Mecanisme";
import React, { useRef, useState } from "react";
import { keyframes, css } from "@emotion/react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useChoicesContext } from "../../../context/ChoicesContext";
import { useCartContext } from "../../../context/CartContext";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;

  img {
    width: 100%;
  }
`;

const glowFilter = (glowColor) => keyframes`
  0% {
    filter: 
      drop-shadow(0px 0px 1px rgba(${glowColor}, 0.4))
      drop-shadow(0px 1px 1px rgba(${glowColor}, 0.4))
      drop-shadow(1px 0px 1px rgba(${glowColor}, 0.4))
      drop-shadow(-1px 0px 1px rgba(${glowColor}, 0.4));
  }
  50% {
    filter: 
      drop-shadow(0px 0px 2px rgba(${glowColor}, 0.8))
      drop-shadow(0px 2px 2px rgba(${glowColor}, 0.8))
      drop-shadow(2px 0px 2px rgba(${glowColor}, 0.8))
      drop-shadow(-2px 0px 2px rgba(${glowColor}, 0.8));
  }
  100% {
    filter: 
      drop-shadow(0px 0px 1px rgba(${glowColor}, 0.4))
      drop-shadow(0px 1px 1px rgba(${glowColor}, 0.4))
      drop-shadow(1px 0px 1px rgba(${glowColor}, 0.4))
      drop-shadow(-1px 0px 1px rgba(${glowColor}, 0.4));
  }
`;

const ArrowContainer = styled.div`
  cursor: pointer;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  top: ${({ positiony }) => `${positiony}`};
  left: ${({ positionx }) => `${positionx}`};
  transform: ${({ rotateValue, facadeOrientation }) =>
    `translate(${facadeOrientation === "verticale" ? "0%" : "-50%"}, ${
      facadeOrientation === "verticale" ? "-50%" : "-15%"
    }) rotate(${rotateValue})`};
  height: 60%;
  width: 30%;
  transition: all 0.4s ease;
`;

const Arrow = styled.img`
  position: absolute;
  width: clamp(1rem, 1.2vw, 1.5rem) !important;
  height: clamp(1rem, 1.2vw, 1.5rem);
  top: ${({ positiony }) => `${positiony}`};
  left: ${({ positionx }) => `${positionx}`};
  transform: ${({ rotateValue }) => `translate(-160%, -50%) rotate(${rotateValue})`};
  transition: all 0.4s ease;

  ${({ isSelected, glowColor }) =>
    isSelected &&
    css`
      animation: ${glowFilter(glowColor)} 2.5s infinite;
    `}

  &:hover {
    transform: ${({ rotateValue }) => `translate(-160%, -50%) rotate(${rotateValue}) translateY(3px)`};
  }
`;

const CloseButton = styled.p`
  position: absolute;
  top: 3%;
  right: 3%;
  z-index: 99999;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export default function ImagePreviewContainer({ type, renderRef }) {
  const { choices, selectedFacade, setSelectedFacade, renderImage, menu, setMenu, idToImageName } = useChoicesContext();
  const { calculateTotalItems } = useCartContext();
  const { setNotifications } = useNotificationsContext();

  const numberOfFacade = parseInt(choices.facade.id.slice(-1));

  const [mecanismeRenderPosition, setMecanismeRenderPosition] = useState({
    simple: {
      neutre: {
        unemplacement: {
          1: { positionY: "49%", positionX: "50.25%" },
        },
        deuxemplacements: {
          1: { positionY: "49.5%", positionX: "44%" },
          2: { positionY: "48.75%", positionX: "56.5%" },
        },
      },
    },

    double: {
      horizontale: {
        unemplacement: {
          1: { positionY: "50%", positionX: "35%" },
          2: { positionY: "48%", positionX: "65%" },
        },
        deuxemplacements: {
          1: { positionY: "50%", positionX: "30%" },
          2: { positionY: "49.5%", positionX: "42%" },
          3: { positionY: "49%", positionX: "59%" },
          4: { positionY: "48.5%", positionX: "71%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "37%", positionX: "48.5%" },
          2: { positionY: "63%", positionX: "51.5%" },
        },
        deuxemplacements: {
          1: { positionY: "37%", positionX: "42%" },
          2: { positionY: "36.5%", positionX: "54%" },
          3: { positionY: "63%", positionX: "46%" },
          4: { positionY: "62.3%", positionX: "58%" },
        },
      },
    },

    triple: {
      horizontale: {
        unemplacement: {
          1: { positionY: "51%", positionX: "21.5%" },
          2: { positionY: "49%", positionX: "50%" },
          3: { positionY: "47%", positionX: "78%" },
        },
        deuxemplacements: {
          1: { positionY: "51%", positionX: "17%" },
          2: { positionY: "50.5%", positionX: "29%" },
          3: { positionY: "49.5%", positionX: "44%" },
          4: { positionY: "49%", positionX: "56%" },
          5: { positionY: "48%", positionX: "71%" },
          6: { positionY: "47.5%", positionX: "83%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "23%", positionX: "47%" },
          2: { positionY: "49.5%", positionX: "50.5%" },
          3: { positionY: "76%", positionX: "54%" },
        },
        deuxemplacements: {
          1: { positionY: "22%", positionX: "41%" },
          2: { positionY: "21.5%", positionX: "53%" },
          3: { positionY: "48%", positionX: "44%" },
          4: { positionY: "47.3%", positionX: "56%" },
          5: { positionY: "76%", positionX: "48%" },
          6: { positionY: "75%", positionX: "60%" },
        },
      },
    },
    images: [],
  });

  // --- HANDLERS ---

  function handleClick(number) {
    setNotifications({ content: `Vous avez sélectionné la plaque N°${number}`, type: "success" });
    setSelectedFacade(number);
  }

  return (
    <ImageContainer ref={renderRef} data-render-container="true">
      {/* IMAGE DYNAMIQUE DES PLAQUES */}
      <img src={renderImage} alt="Rendu de la configuration" />
      {menu && (
        <CloseButton className="no-screenshot" onClick={() => setMenu(false)}>
          <img src="/cancel.svg" alt="" />
        </CloseButton>
      )}
      {/* ZONES DROPPABLE */}
      {/* {Array.from({ length: numberOfFacade }).map((_, index) => {
              const facadeType = choices.facade.name.split(" ")[1].toLowerCase();
              const facadeOrientation = choices.facade.name.split(" ")[2].toLowerCase();
              const position = mecanismeRenderPosition[facadeType][facadeOrientation]["unemplacement"][index + 1];
    
              return (
                <DroppableZone key={index} index={index} positionx={position.positionX} positiony={position.positionY} />
              );
            })} */}
      {/* FLECHES */}
      {type !== "mobilePreview" &&
        choices.facade.id &&
        Array.from({ length: numberOfFacade }).map((_, index) => {
          const facadeType = choices.facade.name.split(" ")[1].toLowerCase();
          const facadeOrientation = choices.facade.name.split(" ")[2].toLowerCase();
          const position = mecanismeRenderPosition[facadeType][facadeOrientation]["unemplacement"][index + 1];

          // Utilisation des variables "unemplacement" avec un ajout de 30 pour toujours être au milieu de chaque emplacement

          const positionX =
            facadeOrientation === "verticale" ? parseInt(position.positionX) - 16 - index + "%" : position.positionX;

          const positionY =
            facadeOrientation === "horizontale" || facadeOrientation === "neutre"
              ? parseInt(position.positionY) - 27 + index + "%"
              : position.positionY;

          // Rotation selon l'orientation verticale ou horizontale
          const rotateValue = facadeOrientation === "verticale" ? "-90deg" : "-5deg";

          const currentFacade = choices.facades[index];
          const mecanismeQuantity = calculateTotalItems(currentFacade);
          const hasCourantPrise = currentFacade.prises.some((p) => p.id.includes("P-C"));

          let glowColor = "207, 170, 96";

          if ((hasCourantPrise && mecanismeQuantity >= 1) || (!hasCourantPrise && mecanismeQuantity >= 2)) {
            glowColor = "179, 56, 43";
          }

          let arrowColor = selectedFacade === index + 1 ? "white" : "black";

          return (
            <>
              <ArrowContainer
                onClick={() => handleClick(index + 1)}
                positionx={positionX}
                positiony={positionY}
                rotateValue={rotateValue}
                facadeOrientation={facadeOrientation}
                key={index}
              />
              <Arrow
                src={`/arrow_down_` + arrowColor + ".svg"}
                alt="Flèche de sélection de la plaque"
                className="no-screenshot"
                isSelected={selectedFacade === index + 1}
                glowColor={glowColor}
                positionx={positionX}
                positiony={positionY}
                rotateValue={rotateValue}
              />
            </>
          );
        })}
      {/* LOGIQUE D'EMPLACEMENT DES MECANISMES */}
      {choices.facade.id &&
        choices.facades.map((facade, index) => {
          const facadeId = facade.id;
          const facadeType = choices.facade.name.split(" ")[1].toLowerCase();
          const facadeOrientation = choices.facade.name.split(" ")[2].toLowerCase();

          const numberOfMecanisme =
            facade.prises.reduce((sum, prise) => sum + prise.quantity, 0) +
            facade.retros.reduce((sum, retro) => sum + retro.quantity, 0) +
            facade.cylindres.reduce((sum, cylindre) => sum + cylindre.quantity, 0);

          const emplacementType = numberOfMecanisme === 1 ? "unemplacement" : "deuxemplacements";

          // MECANISMES DE CHAQUE FACADE

          const allMecanismes = [
            ...facade.prises.map((m) => ({ ...m, type: "prise" })),
            ...facade.retros.map((m) => ({ ...m, type: "retro" })),
            ...facade.cylindres.map((m) => ({ ...m, type: "cylindre" })),
          ];

          return (
            <React.Fragment key={index}>
              {allMecanismes.map((mecanisme, mecanismeIndex) => {
                // --- CALCULE A QUEL EMPLACEMENT COMMENCER POUR RECUPERER LES POSITIONS ---

                const emplacementNumber = () => {
                  if (emplacementType === "unemplacement") {
                    return facadeId;
                  }

                  if (emplacementType === "deuxemplacements") {
                    if (facadeId === 2) {
                      return 3;
                    }
                    if (facadeId === 3) {
                      return 5;
                    }
                  }

                  return 1;
                };

                // --- CALCULE LA TAILLE DE L'IMAGE SELON SON TYPE ---

                const sizeOfMecanisme = () => {
                  if (mecanisme.name.includes("Courant")) {
                    if (facadeOrientation === "verticale") {
                      return "17%";
                    } else {
                      return "21%";
                    }
                  } else {
                    return "20%";
                  }
                };

                // --- RECUPERE LA BONNE POSITION ---

                const position =
                  mecanismeRenderPosition[facadeType][facadeOrientation][emplacementType][emplacementNumber()];

                // --- RECUPERATION DU MECANISME EN IMAGE ---

                const imageSrc = "mecanismes/" + idToImageName(mecanisme.id + "_" + choices.couleur.id) + ".png";

                const mecanismes = [
                  <Mecanisme
                    key={`${facadeId}-${mecanismeIndex}`}
                    item={{ ...mecanisme, facadeId }}
                    src={imageSrc}
                    positionY={position?.positionY || "50%"}
                    positionX={position?.positionX || "50%"}
                    dimension={sizeOfMecanisme()}
                    type={type}
                  />,
                ];

                if (emplacementType === "deuxemplacements") {
                  const position2 =
                    mecanismeRenderPosition[facadeType][facadeOrientation][emplacementType][emplacementNumber() + 1];

                  mecanismes.push(
                    <Mecanisme
                      key={`${facadeId}-${mecanismeIndex}-2`}
                      item={{ ...mecanisme, facadeId }}
                      src={imageSrc}
                      positionY={position2?.positionY || "50%"}
                      positionX={position2?.positionX || "50%"}
                      dimension={sizeOfMecanisme()}
                      type={type}
                    />
                  );
                }

                return mecanismes;
              })}
            </React.Fragment>
          );
        })}{" "}
    </ImageContainer>
  );
}
