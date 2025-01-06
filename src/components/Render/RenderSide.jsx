import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import Resume from "./Resume";

import { useNotificationsContext } from "../../Context/NotificationsContext";
import { useChoicesContext } from "../../Context/ChoicesContext";
import { keyframes, css } from "@emotion/react";
import Mecanisme from "./Mecanisme";

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
`;

const glow = keyframes`
  0% {
    opacity: 1;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.8);
  }
  50% {
    opacity: 1;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1);
  }
  100% {
    opacity: 1;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.8);
  }
`;

const Facade = styled.div`
  cursor: pointer;
  position: absolute;
  top: ${({ topPosition }) => `${topPosition}%`};
  left: ${({ leftPosition }) => `${leftPosition}%`};
  width: 25px;
  height: 25px;
  border-radius: 40%;
  background: rgba(255, 255, 255, 0.5);

  ${({ isSelected }) =>
    isSelected &&
    css`
      animation: ${glow} 2s infinite;
    `}
`;

export default function RenderSide() {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { choices, selectedFacade, setSelectedFacade, renderImage } = useChoicesContext();
  const { setNotifications } = useNotificationsContext();
  const renderRef = useRef(null);
  const menu = true;

  const [mecanismeRenderPosition, setMecanismeRenderPosition] = useState({
    simple: {
      neutre: {
        unemplacement: {
          1: { positionY: "49%", positionX: "50.5%" },
        },
        deuxemplacements: {
          1: { positionY: "49%", positionX: "50%" },
          1: { positionY: "49%", positionX: "50%" },
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
          1: { positionY: "30%", positionX: "48%" },
          2: { positionY: "42%", positionX: "49.5%" },
          3: { positionY: "58%", positionX: "52%" },
          4: { positionY: "70%", positionX: "53.5%" },
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
          1: { positionY: "18%", positionX: "47%" },
          2: { positionY: "30%", positionX: "48.5%" },
          3: { positionY: "44%", positionX: "50%" },
          4: { positionY: "56%", positionX: "51.5%" },
          5: { positionY: "69%", positionX: "52.5%" },
          6: { positionY: "81%", positionX: "54%" },
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
        <img src={renderImage} alt="Rendu de la configuration" />
        <Facade leftPosition={4} topPosition={2} onClick={() => handleClick(1)} isSelected={selectedFacade === 1} />
        <Facade leftPosition={8} topPosition={2} onClick={() => handleClick(2)} isSelected={selectedFacade === 2} />
        <Facade leftPosition={12} topPosition={2} onClick={() => handleClick(3)} isSelected={selectedFacade === 3} />
        {choices.facades.map((facade, index) => {
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

                const mecanismes = [
                  <Mecanisme
                    key={`${facadeId}-${mecanismeIndex}`}
                    src={mecanisme.id + ".svg"}
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
                      src={mecanisme.id + ".svg"}
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
      <Resume renderRef={renderRef} type="render" className="renderSide" />
    </RenderSideContainer>
  );
}
