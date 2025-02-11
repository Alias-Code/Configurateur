import styled from "@emotion/styled";
import Mecanisme from "./Mecanisme";
import React, { useState } from "react";
import { keyframes, css } from "@emotion/react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useChoicesContext } from "../../../context/ChoicesContext";
import { useCartContext } from "../../../context/CartContext";
import { useAnimationContext } from "../../../context/AnimationContext";
import { useMediaQueries } from "../../../config/config";
import { ITEM_CATEGORYS } from "../../../config/config";

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

const moveToCart = (cartRef) => keyframes`
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }

  100% {
    transform: translate(
      ${cartRef.getBoundingClientRect().x - window.innerWidth + 225}px,
      ${cartRef.getBoundingClientRect().y - 200}px
    ) scale(0);
    opacity: 0.5;
  }
`;

const AnimatedImage = styled.img`
  position: fixed;
  top: 0%;
  right: 0%;
  height: auto;
  animation: ${(props) => moveToCart(props.cartRef)} 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  width: 25% !important;
  z-index: 9999999999999999999999 !important;
`;

export default function ImagePreviewContainer({ type, renderRef }) {
  const { choices, selectedFacade, setSelectedFacade, renderImage, menu, setMenu, idToImageName } = useChoicesContext();
  const { cartImageAnimation, imageAnimation, setImageAnimation, setActiveTab } = useAnimationContext();
  const { setNotifications } = useNotificationsContext();
  const { emplacementIsFull } = useCartContext();
  const { IS_MOBILE } = useMediaQueries();

  const numberOfFacade = parseInt(choices.facade.id.slice(-1));

  const [mecanismeRenderPosition, setMecanismeRenderPosition] = useState({
    simple: {
      neutre: {
        unemplacement: {
          1: { positionY: "49.25%", positionX: "50%" },
        },
        deuxemplacements: {
          1: { positionY: "49.25%", positionX: "44.5%" },
          2: { positionY: "48.75%", positionX: "54.5%" },
        },
      },
    },

    double: {
      horizontale: {
        unemplacement: {
          1: { positionY: "50%", positionX: "37%" },
          2: { positionY: "48.5%", positionX: "63%" },
        },
        deuxemplacements: {
          1: { positionY: "50%", positionX: "31%" },
          2: { positionY: "49.4%", positionX: "41%" },
          3: { positionY: "49%", positionX: "57%" },
          4: { positionY: "48.5%", positionX: "67%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "37%", positionX: "48.5%" },
          2: { positionY: "63%", positionX: "51.5%" },
        },
        deuxemplacements: {
          1: { positionY: "37%", positionX: "44%" },
          2: { positionY: "36.5%", positionX: "54%" },
          3: { positionY: "63%", positionX: "47%" },
          4: { positionY: "62.3%", positionX: "57%" },
        },
      },
    },

    triple: {
      horizontale: {
        unemplacement: {
          1: { positionY: "51%", positionX: "25.5%" },
          2: { positionY: "49.5%", positionX: "50%" },
          3: { positionY: "48%", positionX: "74%" },
        },
        deuxemplacements: {
          1: { positionY: "51%", positionX: "21%" },
          2: { positionY: "50.5%", positionX: "31%" },
          3: { positionY: "49.5%", positionX: "44%" },
          4: { positionY: "49%", positionX: "54%" },
          5: { positionY: "48%", positionX: "68%" },
          6: { positionY: "47.5%", positionX: "78%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "23%", positionX: "47%" },
          2: { positionY: "49.5%", positionX: "50.5%" },
          3: { positionY: "76%", positionX: "54%" },
        },
        deuxemplacements: {
          1: { positionY: "22%", positionX: "42%" },
          2: { positionY: "21.5%", positionX: "52%" },
          3: { positionY: "48.5%", positionX: "45.5%" },
          4: { positionY: "48%", positionX: "55.5%" },
          5: { positionY: "75.5%", positionX: "49%" },
          6: { positionY: "75%", positionX: "59%" },
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

  function handleCloseMenu() {
    setMenu(false);
    setActiveTab(0);
  }

  return (
    <ImageContainer ref={renderRef} data-render-container="true">
      {/* IMAGE DYNAMIQUE DES PLAQUES */}

      <img src={renderImage} alt="Rendu de la configuration" />

      {menu && (
        <CloseButton className="no-screenshot" onClick={handleCloseMenu}>
          <img src="/cancel.svg" alt="" />
        </CloseButton>
      )}

      {/* ANIMATION IMAGE ADD TO CART */}

      {imageAnimation && !IS_MOBILE && (
        <AnimatedImage
          src={imageAnimation}
          alt="Produit ajouté au panier"
          cartRef={cartImageAnimation.current}
          onAnimationEnd={() => setImageAnimation(false)}
        />
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

          // AJUSTEMENT DES FLECHES SELON PLUSIEURS FACTEURS POUR UN RENDU PARFAIT VU QUE LA PLAQUE EST EN PERSPECTIVE

          const adjustArrowVerticale = index !== 0 && index - 1;
          const adjustArrowHorizontale = index === 2 ? index - 1 : index;

          const positionX =
            facadeOrientation === "verticale"
              ? parseInt(position.positionX) - 16 - adjustArrowVerticale + "%"
              : position.positionX;

          const positionY =
            facadeOrientation === "horizontale" || facadeOrientation === "neutre"
              ? parseInt(position.positionY) - 21 + adjustArrowHorizontale + "%"
              : position.positionY;

          // ROTATION DE LA FLECHE SELON L'ORIENTATION

          const rotateValue = facadeOrientation === "verticale" ? "-90deg" : "-5deg";

          const currentFacade = choices.facades[index];

          let glowColor = "207, 170, 96";

          // SI L'EMPLACEMENT EST PLEIN, LA FLECHE DEVIENT ROUGE

          if (emplacementIsFull(currentFacade)) {
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
        choices.facades.map((facade) => {
          const facadeId = facade.id;
          const facadeType = choices.facade.name.split(" ")[1].toLowerCase();
          const facadeOrientation = choices.facade.name.split(" ")[2].toLowerCase();

          const numberOfMecanisme =
            (facade?.prises?.reduce((sum, prise) => sum + prise.quantity, 0) || 0) +
            (facade?.retros?.reduce((sum, retro) => sum + retro.quantity, 0) || 0) +
            (facade?.cylindres?.reduce((sum, cylindre) => sum + cylindre.quantity, 0) || 0) +
            (facade?.variateurs?.reduce((sum, variateur) => sum + variateur.quantity, 0) || 0) +
            (facade?.liseuses?.reduce((sum, liseuses) => sum + liseuses.quantity, 0) || 0);

          const emplacementType = numberOfMecanisme === 1 ? "unemplacement" : "deuxemplacements";

          const allMecanismes = ITEM_CATEGORYS.filter((category) => category !== "gravures").flatMap((category) =>
            (facade?.[category] || []).map((m) => ({ ...m, type: category }))
          );

          // --- Initialise un compteur spécifique à chaque façade ---
          let currentPositionIndex = 0;

          return (
            <React.Fragment key={facadeId}>
              {allMecanismes.map((mecanisme, mecanismeIndex) => {
                const positionBase = mecanismeRenderPosition[facadeType][facadeOrientation][emplacementType];

                // --- TAILLE DES MECANISMES SELON LE TYPE ---

                let size;

                switch (true) {
                  case mecanisme.name.includes("Courant"):
                    size = 18;
                    break;

                  case mecanisme.name.includes("TV"):
                    size = 19;
                    break;

                  case mecanisme.name.includes("Variateur"):
                    size = 20;
                    break;

                  case mecanisme.name.includes("Liseuse"):
                    size = 50;
                    break;

                  default:
                    size = 20;
                    break;
                }

                // --- COEF QUI AJUSTE LA TAILLE SELON l'ECRAN ---

                const sizeOfMecanisme = size + "%";

                return Array.from({ length: mecanisme.quantity }).map((_, quantityIndex) => {
                  // --- CALCUL DE L'EMPLACEMENT A CHOISIR SELON L'OBJET MECANISM RENDER POSITION ---

                  const emplacementNumber = () => {
                    if (emplacementType === "unemplacement") {
                      return facadeId;
                    }

                    if (emplacementType === "deuxemplacements") {
                      if (facadeId === 1) {
                        return 1;
                      }
                      if (facadeId === 2) {
                        return 3;
                      }
                      if (facadeId === 3) {
                        return 5;
                      }
                    }
                  };

                  const position = positionBase[emplacementNumber() + currentPositionIndex];

                  currentPositionIndex += 1;

                  // --- RENDU DE L'IMAGE DU MECANISME ---

                  const imageSrc = `/mecanismes/${idToImageName(mecanisme.id + "_" + choices.couleur.id)}.png`;

                  let adjustedXPosition = parseFloat(position?.positionX) || 50;
                  let adjustedYPosition = parseFloat(position?.positionY) || 50;

                  // RAPPROCHEMENT DES INTERRUPTEURS CYLINDRES ET RETROS

                  if (mecanisme.id.includes("R-") || mecanisme.id.includes("C-")) {
                    if (allMecanismes.length === 1 && mecanisme.quantity === 1) {
                      adjustedXPosition += 1;
                    } else if (currentPositionIndex === 1) {
                      adjustedXPosition += facadeOrientation === "verticale" ? 2 : 2.5;
                    } else {
                      adjustedXPosition -= facadeOrientation === "verticale" ? 1.5 : 0.5;
                    }
                  }

                  // AJUSTEMENT POSITION LISEUSE CAR SA TAILLE A GRANDEMENT CHANGEE

                  if (mecanisme.id.includes("LI")) {
                    adjustedYPosition += 19.5;
                    adjustedXPosition += 10.5;
                  }

                  return (
                    <Mecanisme
                      key={`${facadeId}-${currentPositionIndex}-${quantityIndex}`}
                      item={{ ...mecanisme, facadeId }}
                      src={imageSrc}
                      positionY={`${adjustedYPosition}%`}
                      positionX={`${adjustedXPosition}%`}
                      dimension={sizeOfMecanisme}
                      type={type}
                    />
                  );
                });
              })}
            </React.Fragment>
          );
        })}
    </ImageContainer>
  );
}
