import styled from "@emotion/styled";
import Mecanisme from "./Mecanisme";
import Resume from "./Resume";
import DroppableZone from "./DroppableZone";
import React, { useRef, useState } from "react";
import { keyframes, css } from "@emotion/react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useChoicesContext } from "../../../context/ChoicesContext";
import { useCartContext } from "../../../context/CartContext";

const RenderSideContainer = styled.div`
  width: 45%;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    background: black;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  @media (max-width: 900px) {
    position: absolute;
    bottom: 0;
    z-index: 1001;
    transition: left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
    left: ${({ menu }) => (menu ? "0%" : "100%")};
    width: 100%;
    height: 89vh;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;

  img {
    width: 100%;
  }

  .testt {
    position: absolute;
    top: 80%;
    left: 30%;
  }
`;

const glowFilter = keyframes`
  0% {
    filter: drop-shadow(0 3px 2px rgba(255, 255, 255, 0.5));
    -webkit-filter: drop-shadow(0 3px 2px rgba(255, 255, 255, 0.5));
  }
  50% {
    filter: drop-shadow(0 3px 1px rgba(255, 255, 255, 0.9));
    -webkit-filter: drop-shadow(0 3px 1px rgba(255, 255, 255, 0.9));
  }
  100% {
    filter: drop-shadow(0 3px 2px rgba(255, 255, 255, 0.5));
    -webkit-filter: drop-shadow(0 3px 2px rgba(255, 255, 255, 0.5));
  }
`;

const Arrow = styled.img`
  cursor: pointer;
  position: absolute;
  z-index: 99;
  top: ${({ positiony }) => `${positiony}`};
  left: ${({ positionx }) => `${positionx}`};
  transform: ${({ rotateValue }) => `translate(-160%, -50%) rotate(${rotateValue})`};
  width: 1.5rem !important;
  height: 1.5rem;
  border-radius: 50%;
  transition: transform 0.4s ease;
  will-change: filter;

  ${({ isSelected }) =>
    isSelected &&
    css`
      animation: ${glowFilter} 2s infinite;
    `}

  &:hover {
    transform: ${({ rotateValue }) => `translate(-160%, -50%) rotate(${rotateValue}) translateY(3px)`};
  }
`;

export default function RenderSide() {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { choices, selectedFacade, setSelectedFacade, renderImage } = useChoicesContext();
  const { calculateTotalItems } = useCartContext();
  const { setNotifications } = useNotificationsContext();

  const renderRef = useRef(null);
  const numberOfFacade = parseInt(choices.facade.id.slice(-1));
  const menu = true;

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

  // --- RETURN ---

  return (
    <RenderSideContainer menu={menu}>
      <ImageContainer ref={renderRef} data-render-container="true">
        {/* IMAGE DYNAMIQUE DES PLAQUES */}

        <img src={renderImage} alt="Rendu de la configuration" />

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

        {choices.facade.id &&
          Array.from({ length: numberOfFacade }).map((_, index) => {
            const facadeType = choices.facade.name.split(" ")[1].toLowerCase();
            const facadeOrientation = choices.facade.name.split(" ")[2].toLowerCase();
            const position = mecanismeRenderPosition[facadeType][facadeOrientation]["unemplacement"][index + 1];

            // Utilisation des variables "unemplacement" avec un ajout de 30 pour toujours être au milieu de chaque emplacement

            const positionX =
              facadeOrientation === "verticale" ? parseInt(position.positionX) - 16 - index + "%" : position.positionX;

            const positionY =
              facadeOrientation === "horizontale" || facadeOrientation === "neutre"
                ? parseInt(position.positionY) - 26 + index + "%"
                : position.positionY;

            // Rotation selon l'orientation verticale ou horizontale
            const rotateValue = facadeOrientation === "verticale" ? "-90deg" : "-5deg";

            const currentFacade = choices.facades[index];
            const mecanismeQuantity = calculateTotalItems(currentFacade);
            const hasCourantPrise = currentFacade.prises.some((p) => p.id.includes("P-C"));

            let color = "vert";

            if ((hasCourantPrise && mecanismeQuantity >= 1) || (!hasCourantPrise && mecanismeQuantity >= 2)) {
              color = "rouge";
            }

            return (
              <Arrow
                src={`/arrow_down_plaque_${color}` + ".svg"}
                alt="Flèche de sélection de la plaque"
                key={index}
                positionx={positionX}
                positiony={positionY}
                rotateValue={rotateValue}
                onClick={() => handleClick(index + 1)}
                isSelected={selectedFacade === index + 1}
                className="no-screenshot"
              />
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
                      return "9%";
                    }
                  };

                  // --- RECUPERE LA BONNE POSITION ---

                  const position =
                    mecanismeRenderPosition[facadeType][facadeOrientation][emplacementType][emplacementNumber()];

                  // --- RENDU DE UN OU PLUSIEURS IMAGE ---

                  const imageSrc = "mecanismes/" + mecanisme.id + "_" + choices.couleur.id + ".svg";

                  const mecanismes = [
                    <Mecanisme
                      key={`${facadeId}-${mecanismeIndex}`}
                      item={{ ...mecanisme, facadeId }}
                      src={imageSrc}
                      positionY={position?.positionY || "50%"}
                      positionX={position?.positionX || "50%"}
                      dimension={sizeOfMecanisme()}
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
                      />
                    );
                  }

                  return mecanismes;
                })}
              </React.Fragment>
            );
          })}
      </ImageContainer>
      <Resume renderRef={renderRef} type="resume" className="renderSide" />
    </RenderSideContainer>
  );
}
