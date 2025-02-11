import Checkout from "./Checkout";
import styled from "@emotion/styled";
import Resume from "../configuration/render-side/Resume";
import ResumeSummary from "../utils/ResumeSummary";
import React, { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { TitleStyle } from "../utils/SharedStyle";
import { useLocation } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useAnimationContext } from "../../context/AnimationContext";
import { useMediaQueries } from "../../config/config";

const CartContainer = styled.div`
  background-color: black;
  position: fixed;
  z-index: 999999999;
  color: white;
  bottom: 0;
  overflow: ${({ checkoutAnimation }) => (checkoutAnimation ? "auto" : "visible")};
  left: 0;
  width: 100%;
  height: ${({ showCart, isMobile, checkoutAnimation }) =>
    checkoutAnimation ? "100vh" : showCart ? (isMobile ? "105vh" : "75vh") : "1.3rem"};
  cursor: ${({ showCart }) => (showCart ? "default" : "pointer")};
  transition: all 0.75s ease;
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease;

  &:hover {
    height: ${({ showCart, checkoutAnimation }) => (!checkoutAnimation && !showCart ? "3rem" : "")};

    ${({ showCart, checkoutAnimation }) =>
      !showCart &&
      !checkoutAnimation &&
      `
      .cart-title {
        opacity: 1;
        transform: translateY(15px);
      }
    `}
  }

  &::-webkit-scrollbar-thumb {
    background: white;
    border-radius: 4px;
  }
`;

const CartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const CartContent = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: white;
    border-radius: 3px;
  }
`;

const CartIcon = styled.div`
  position: absolute;
  left: 50%;
  top: -1.25rem;
  transform: translate(-50%, 0);
  background-color: black;
  width: 3.25rem;
  height: 2.5rem;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${({ checkoutAnimation }) => (checkoutAnimation ? "0" : "1")};
  transition: all 0.5s ease;
  z-index: 9999999999999 !important;

  img {
    width: 1.25rem;
    height: 1.25rem;
    transition: all 0.5s ease;

    &:hover {
      transform: ${({ showCart, checkoutAnimation }) => (!checkoutAnimation && showCart ? "translateY(4px)" : "")};
    }
  }
`;

const EmptyCartMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  height: 90%;
`;

const CartHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: black;
  z-index: 1000001;
  padding-top: ${({ showCart }) => (showCart ? "1rem" : "0")};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const CartTitle = styled(TitleStyle)`
  opacity: ${({ checkoutAnimation, showCart }) => (checkoutAnimation ? "0" : showCart ? "1" : "0")};
  transition: all 0.5s ease;
  background-color: black;
  text-align: center;
  position: relative;
  transform: translateY(${({ showCart }) => (showCart ? "10px" : "0px")});
  font-size: clamp(0.7rem, 2vw, 1rem) !important;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    transform: translateY(0px);
    margin: 1rem 0;
  }
`;

const ResumeContainer = styled.div`
  color: ${({ checkoutAnimation }) => (checkoutAnimation ? "#333" : "#d8d8d8")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 0 1rem;
  transform: translateY(${({ checkoutAnimation }) => (checkoutAnimation ? "-20px" : "0")});

  @media screen and (max-width: 767px) {
    margin-top: 1rem;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media screen and (max-width: 767px) {
    flex-direction: column;

    div {
      padding: 0px;
    }
  }

  .imagePreview {
    height: 13rem;
    width: 13rem;
    border-radius: 5px;
  }
`;

const ResumeSection = styled.div`
  width: ${({ checkoutAnimation }) => (checkoutAnimation ? "100%" : "40%")};

  @media screen and (max-width: 767px) {
    width: 90%;
  }
`;

const FinalCheckoutContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  width: 100%;
  margin-bottom: 1rem;

  &::before {
    content: "";
    height: 8rem;
    width: 12rem;
  }

  .container {
    padding-right: 1rem;
    width: 40%;
  }

  @media screen and (max-width: 767px) {
    margin-bottom: 5rem;
    .container {
      width: 90%;
      padding: 0px;
    }

    &::before {
      display: none;
    }
  }
`;

const CloseButton = styled.p`
  position: absolute;
  top: -15%;
  right: -50px;
  z-index: 9999999999999999;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export default function CartInformations() {
  const { entryAnimation, checkoutAnimation, setCheckoutAnimation, cartImageAnimation, setActiveTab } =
    useAnimationContext();
  const { showCart, setShowCart } = useCartContext();
  const { calculateConfigTotal } = useCartContext();
  const [cartAnimation, setCartAnimation] = useState(false);
  const { IS_MOBILE } = useMediaQueries();

  const configurations = JSON.parse(localStorage.getItem("configurations")) || {};
  const isMobile = useMediaQuery(useTheme().breakpoints.between("xs", "sm"));
  const location = useLocation();
  const priceHT = parseFloat(
    Object.values(configurations)
      .reduce((sum, config) => sum + calculateConfigTotal(config) / 1.2, 0)
      .toFixed(2)
  );

  // --- USE EFFECT ---

  useEffect(() => {
    if (!entryAnimation) {
      setCartAnimation(true);
    }
  }, [entryAnimation]);

  useEffect(() => {
    if (location.pathname === "/paiement" && !checkoutAnimation) {
      setCheckoutAnimation(true);
    }
  }, [checkoutAnimation]);

  // --- HANDLERS ---

  function handleCloseCart() {
    setShowCart(false);
    setActiveTab(0);
  }

  return (
    <CartContainer
      cartAnimation={cartAnimation}
      showCart={showCart}
      checkoutAnimation={checkoutAnimation}
      isMobile={isMobile}
      onClick={!showCart ? () => setShowCart(true) : undefined}>
      <CartWrapper>
        <CartIcon
          showCart={showCart}
          checkoutAnimation={checkoutAnimation}
          onClick={(e) => {
            e.stopPropagation();
            !checkoutAnimation && setShowCart(!showCart);
          }}>
          <img
            ref={cartImageAnimation}
            src={showCart ? "/arrow_down_white.svg" : "/shoppingbag.svg"}
            alt="Icône du panier"
          />
        </CartIcon>

        {!checkoutAnimation ? (
          <>
            <CartHeader showCart={showCart}>
              <CartTitle
                className="cart-title"
                checkoutAnimation={checkoutAnimation}
                showCart={showCart}
                color="white"
                fontSize="0.75rem">
                RÉSUMÉ DE VOTRE PANIER
                {IS_MOBILE && showCart && (
                  <CloseButton onClick={handleCloseCart}>
                    <img src="/cancel.svg" alt="" />
                  </CloseButton>
                )}
              </CartTitle>
            </CartHeader>

            <CartContent>
              {Object.keys(configurations).length === 0 ? (
                <EmptyCartMessage>
                  <p>Votre panier est vide.</p>
                </EmptyCartMessage>
              ) : (
                <ResumeContainer checkoutAnimation={checkoutAnimation}>
                  {Object.entries(configurations).map(([configKey, configuration]) => (
                    <ItemContainer key={configKey}>
                      <img className="imagePreview" src={configuration.image} alt="Visualisation de la configuration" />
                      <ResumeSection checkoutAnimation={checkoutAnimation}>
                        <Resume type="cart" configuration={configuration} itemIndex={configKey.slice(-1)} />
                      </ResumeSection>
                    </ItemContainer>
                  ))}

                  <FinalCheckoutContainer>
                    <div className="container">
                      <ResumeSummary type="final_cart" priceHT={priceHT} />
                    </div>
                  </FinalCheckoutContainer>
                </ResumeContainer>
              )}
            </CartContent>
          </>
        ) : (
          <Checkout
            configurations={configurations}
            priceHT={priceHT}
            setCheckoutAnimation={setCheckoutAnimation}
            setShowCart={setShowCart}
          />
        )}
      </CartWrapper>
    </CartContainer>
  );
}
