import React, { useState } from "react";
import styled from "@emotion/styled";
import ImagePreviewContainer from "./ImagePreviewContainer";
import { useChoicesContext } from "../../../context/ChoicesContext";
import QuantityButton from "../../utils/QuantityButton";
import { Button } from "../../utils/SharedStyle";
import { useCartContext } from "../../../context/CartContext";
import { useAddToCart } from "../../utils/AddToCart";

const MobileRenderPreviewContainer = styled.div`
  width: ${({ isExpanded }) => (isExpanded ? "20rem" : "10rem")};
  height: ${({ isExpanded }) => (isExpanded ? "20rem" : "10rem")};
  transform: ${({ menu }) => (menu ? "translateX(350px)" : "translateX(0)")};
  opacity: ${({ isShown }) => (isShown ? "1" : "0")};
  transition: all 0.4s ease-in-out, opacity 1s ease;
  overflow: hidden;
  position: fixed;
  z-index: 99999;
  right: 0;
  top: 0;

  .menuContainer {
    position: relative;
    width: 100%;
    height: 100%;

    .container {
      position: absolute;
      right: 0;
      z-index: 99999999999999999;
      display: flex;
      transform: translateY(-100%);

      div {
        margin-right: 0px;
        border-radius: 0px;
        border-top-left-radius: 5px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(6px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }

    .cartButton {
      border-radius: 0px;
      margin-right: 0px;

      img {
      }
    }
  }

  img {
    border-bottom-left-radius: 5px;
  }
`;

const ResizeButton = styled.div`
  position: fixed;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  transition: all 0.3s ease;
  transform: translateY(-100%);

  &:hover {
    background: white;
  }
`;

const DetailsButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  font-size: 8px;
  font-weight: 500;
  opacity: ${({ isExpanded }) => (isExpanded ? "1" : "0")};
  transition: all 0.3s ease;

  p {
    font-weight: bold;
    transform: translateY(1px);
  }

  &:hover {
    background: white;
  }
`;

export default function MobileRenderPreview() {
  const { menu, setMenu, choices } = useChoicesContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const addToCart = useAddToCart();
  const [choicesQuantity, setChoicesQuantity] = useState(choices.quantity);

  const handleMenu = () => setMenu((prev) => !prev);

  const handleResize = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const hasColorAndFacade = choices?.couleur?.id && choices?.facade?.id;

  return (
    <MobileRenderPreviewContainer
      isShown={hasColorAndFacade}
      menu={menu}
      isExpanded={isExpanded}
      onClick={handleResize}>
      <div className="menuContainer">
        <ImagePreviewContainer type="mobilePreview" />

        <ResizeButton>{isExpanded ? <img src="/home.svg" alt="" /> : <img src="/home.svg" alt="" />}</ResizeButton>

        <DetailsButton isExpanded={isExpanded} onClick={handleMenu}>
          <p>VOIR DETAILS</p>
          <img src="/home.svg" alt="" />
        </DetailsButton>

        {isExpanded && (
          <div className="container" onClick={(e) => e.stopPropagation()}>
            <QuantityButton number={choicesQuantity} setNumber={setChoicesQuantity} type="resume" itemIndex={null} />
            <Button
              className="cartButton"
              bgColor={"white"}
              borderColor={"rgba(255, 255, 255, 0.9)"}
              bgColorHover={"transparent"}
              onClick={() => {
                setTimeout(() => {
                  setIsExpanded(false);
                }, 10000);
                addToCart(choicesQuantity, setChoicesQuantity, "mobilePreview");
              }}>
              <img src="/cart.svg" alt="Icone d'ajout au panier" />{" "}
            </Button>
          </div>
        )}
      </div>
    </MobileRenderPreviewContainer>
  );
}
