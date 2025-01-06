import React, { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { TitleStyle } from "../Global/SharedStyle";
import { useCartContext } from "../../Context/CartContext";
import { useAnimationContext } from "../../Context/AnimationContext";
import { useLocation } from "react-router-dom";
import Checkout from "./Checkout/Checkout";
import styled from "@emotion/styled";
import Resume from "../Render/Resume";
import ResumeSummary from "../Render/ResumeSummary";

const CartContainer = styled.div`
  background-color: black;
  /* transform: ${({ cartAnimation }) => (cartAnimation ? "translateY(0px)" : "translateY(50px)")}; */
  position: absolute;
  z-index: 100;
  overflow: ${({ checkoutAnimation }) => (checkoutAnimation ? "auto" : "visible")};
  bottom: 0;
  color: white;
  left: 0;
  width: 100%;
  height: ${({ showCart, isMobile, checkoutAnimation }) =>
    checkoutAnimation ? "100vh" : showCart ? (isMobile ? "89vh" : "75vh") : "1.3rem"};
  cursor: ${({ showCart }) => (showCart ? "default" : "pointer")};
  transition: all 0.75s ease;

  &::-webkit-scrollbar {
    width: 6px;

    &-thumb {
      background: white;
    }
  }

  &:hover {
    height: ${({ showCart, isMobile, checkoutAnimation }) => (!checkoutAnimation && !showCart ? "3rem" : "")};
  }
`;

const CartIcon = styled.div`
  position: relative;
  left: 50%;
  top: 0;
  transform: translate(-50%, -22px);
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

  img {
    width: 1.25rem;
    height: 1.25rem;
    transition: all 0.5s ease;

    &:hover {
      transform: ${({ showCart, isMobile, checkoutAnimation }) =>
        !checkoutAnimation && showCart ? "translateY(4px)" : ""};
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

const CartTitle = styled(TitleStyle)`
  opacity: ${({ checkoutAnimation }) => (checkoutAnimation ? "0" : "1")};
  transition: opacity 0.5s ease;
  text-align: center;
  transform: translateY(-20px);
`;

const ResumeContainer = styled.div`
  color: ${({ checkoutAnimation }) => (checkoutAnimation ? "#333" : "#d8d8d8")};
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-height: ${({ checkoutAnimation }) => (checkoutAnimation ? "0" : "75vh")};
  width: 100%;
  transform: translateY(${({ checkoutAnimation }) => (checkoutAnimation ? "-20px" : "0")});

  &::-webkit-scrollbar {
    width: 6px;

    &-thumb {
      background: white;
    }
  }
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .imagePreview {
    height: 12.5rem;
    width: 13rem;
    border-radius: 5px;
  }
`;

const ResumeSection = styled.div`
  width: ${({ checkoutAnimation }) => (checkoutAnimation ? "100%" : "40%")};
`;

const FinalCheckoutContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  width: 100%;

  &::before {
    content: "";
    height: 8rem;
    width: 12rem;
  }

  .container {
    padding-right: 1rem;
    width: 40%;
  }
`;

export default function CartInformations() {
  const { entryAnimation, checkoutAnimation, setCheckoutAnimation } = useAnimationContext();
  const { showCart, setShowCart } = useCartContext();
  const { calculateConfigTotal } = useCartContext();
  const [cartAnimation, setCartAnimation] = useState(false);

  const configurations = JSON.parse(localStorage.getItem("configurations")) || {};
  const isMobile = useMediaQuery(useTheme().breakpoints.between("xs", "sm"));
  const location = useLocation();
  const priceHT = parseFloat(
    Object.values(configurations)
      .reduce((sum, config) => sum + calculateConfigTotal(config) / 1.2, 0)
      .toFixed(2)
  );

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

  return (
    <CartContainer
      cartAnimation={cartAnimation}
      showCart={showCart}
      checkoutAnimation={checkoutAnimation}
      isMobile={isMobile}
      onClick={!showCart ? () => setShowCart(true) : undefined}>
      <CartIcon
        showCart={showCart}
        checkoutAnimation={checkoutAnimation}
        onClick={() => !checkoutAnimation && setShowCart(!showCart)}>
        <img src={showCart ? "arrow_down.svg" : "shoppingbag.svg"} alt="Icône du panier" />
      </CartIcon>

      {!checkoutAnimation ? (
        <>
          <CartTitle checkoutAnimation={checkoutAnimation} color="white" fontSize="0.75rem">
            RÉSUMÉ DE VOTRE PANIER
          </CartTitle>

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
                    {/* CONFIG KEY RETOURNE L'INDEX DE CHAQUE ITEM, UTILE POUR LA SUPPRESSION */}
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
        </>
      ) : (
        <Checkout
          configurations={configurations}
          priceHT={priceHT}
          setCheckoutAnimation={setCheckoutAnimation}
          setShowCart={setShowCart}
        />
      )}
    </CartContainer>
  );
}
