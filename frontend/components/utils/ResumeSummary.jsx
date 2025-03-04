import styled from "@emotion/styled";
import SignIn from "../home/auth/SignIn";
import { useEffect, useState } from "react";
import { Button } from "./SharedStyle";
import { useNotificationsContext } from "../../context/NotificationsContext";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useCartContext } from "../../context/CartContext";
import { useAnimationContext } from "../../context/AnimationContext";
import { useAuthContext } from "../../context/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createPortal } from "react-dom";
import QuantityButton from "./QuantityButton";
import Spinner from "../common/Spinner";
import { useAddToCart } from "./AddToCart";
import SignUp from "../home/auth/SignUp";

const ResumeSummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

const TrashIcon = styled.img`
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const CartContainer = styled.div`
  display: flex;
  align-items: center;

  .cartButton {
    &:hover {
      img {
        filter: invert(48%) sepia(72%) saturate(200%) hue-rotate(77deg) brightness(105%) contrast(85%);
      }
    }

    img {
      width: 1.8rem;
      transition: filter 0.5s ease;
    }
  }
`;

const PrixContainer = styled.div`
  text-align: right;

  /* PRIX TOTAL FINAL_CART PLUS GRAND QUE LE PRIX AFFICHÉ PLUSIEURS FOIS POUR CHAQUE CONFIG */

  p {
    font-size: ${({ type }) => (type === "final_cart" ? "clamp(0.7rem, 2vw, 0.8rem)" : "clamp(0.4rem, 2vw, 0.6rem)")};
  }

  .TTC {
    font-size: ${({ type }) => (type === "final_cart" ? "clamp(0.9rem, 3vw, 1rem)" : "clamp(0.6rem, 3vw, 0.8rem)")};
    font-weight: bold;
  }

  .ST {
    font-size: clamp(0.4rem, 2.5vw, 0.75rem);
  }

  .PU {
    font-size: 0.6rem;
    margin-bottom: 0.4rem;
  }
`;

const FinalButtonsContainer = styled.div`
  display: flex;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export default function ResumeSummary({ priceHT, type, quantity, itemIndex, finalPrice }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { setCheckoutAnimation } = useAnimationContext();
  const { choices } = useChoicesContext();
  const { configurations } = useCartContext();
  const { setNotifications } = useNotificationsContext();
  const { isAuthenticated } = useAuthContext();
  const { openModal } = useModalContext();
  const addToCart = useAddToCart();

  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("");
  const [number, setNumber] = useState(1);

  // --- SPINNER ---

  const [invoiceSpinner, setInvoiceSpinner] = useState(false);
  const [cartSpinner, setCartSpinner] = useState(false);

  // --- PRICES ---

  const TVA = (priceHT * 0.2).toFixed(2);
  const TTC = (priceHT + parseFloat(TVA)).toFixed(2);
  const PU = ((priceHT + parseFloat(TVA)) / quantity).toFixed(2);

  useEffect(() => {
    setNumber(type === "cart" ? quantity : number);
  }, []);

  // --- OPEN SIGN IN ---

  const handleOpenSignIn = () => {
    setSignInOpen(true);
    setTimeout(() => {
      setModalAnimation("open");
    }, 50);
  };

  // --- CREATE INVOICE ---

  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    // --- AUTH CHECKER ---

    const token = localStorage.getItem("token");

    if (!token) {
      handleOpenSignIn();
      return;
    }

    // --- INVOICE GENERATOR ---

    const rawCart = JSON.parse(localStorage.getItem("configurations"));

    const cartArray = Object.values(rawCart);
    const cartWithoutImages = cartArray.map((config) => {
      const { image, ...configWithoutImage } = config;
      return configWithoutImage;
    });

    setInvoiceSpinner(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/order/generateinvoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart: cartWithoutImages }),
      });

      if (response.ok) {
        // BLOB : Méthode native qui traite un renvoie binaire (fichier, image etc...)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");

        setNotifications({
          content: ["Votre devis a été généré avec succès."],
          type: "success",
        });
        setInvoiceSpinner(false);
      } else {
        const data = await response.json();
        setNotifications({
          content: [data.message || "Une erreur est survenue."],
          type: "error",
        });
        setInvoiceSpinner(false);
      }
    } catch (error) {
      setNotifications({
        content: ["Une erreur est survenue lors de la génération du PDF."],
        type: "error",
      });
      console.error(error);
      setInvoiceSpinner(false);
    }
  };

  // --- CHECKOUT AUTH CHECKER ---

  function handleCheckoutClick(e) {
    e.preventDefault();

    if (isAuthenticated) {
      setCheckoutAnimation(true);
      window.history.pushState({}, "", "../paiement");
    } else {
      handleOpenSignIn();
    }
  }

  // --- RENDER ---

  return (
    <>
      <ResumeSummaryContainer>
        {type !== "checkout" && (
          <CartContainer>
            {/* QUANTITE POUR PRODUIT UNITAIRE */}

            {type !== "final_cart" && type !== "history" && type !== "orderHistory" && (
              <QuantityButton number={number} setNumber={setNumber} type={type} itemIndex={itemIndex} />
            )}

            {type === "resume" ? (
              // --- RENDER ---
              <Button
                className="cartButton"
                borderColor={"white"}
                bgColor={"transparent"}
                bgColorHover={"transparent"}
                // PAS DE ON CLICK SI LE SPINNER EST EN COURS
                onClick={() => !cartSpinner && addToCart(number, setNumber, type, setCartSpinner)}>
                {cartSpinner && <Spinner />}
                <img src="/cart.svg" alt="Icone d'ajout au panier" />
              </Button>
            ) : type === "cart" ? (
              // --- INDIVIDUAL CART ---
              <TrashIcon
                onClick={() => openModal({ type: type, data: itemIndex })}
                src="trash.svg"
                alt="Supprimer le produit"
              />
            ) : type !== "history" && type !== "orderHistory" ? (
              // --- FINAL CART ---
              <FinalButtonsContainer>
                <Button type="checkout" bgColorHover={"#419741"} bgColor="black" onClick={handleCheckoutClick}>
                  <img className="bag" src="/shopping-cart.svg" alt="Icône du panier" />
                  <p>PAYER EN LIGNE</p>
                </Button>

                <Button onClick={handleCreateInvoice} type="checkout" bgColorHover={"#419741"} bgColor="black">
                  {invoiceSpinner && <Spinner />}
                  <img className="bag" src="/invoice.svg" alt="Icône du panier" />
                  <p>SAUVEGARDER EN DEVIS</p>
                </Button>
              </FinalButtonsContainer>
            ) : (
              ""
            )}
            {(type === "final_cart" || type === "resume") && (
              <Button
                borderColor={"#a82633"}
                bgColorHover={"transparent"}
                onClick={() =>
                  openModal({ type: `${type}_delete_all`, data: type === "final_cart" ? configurations : choices })
                }>
                <img className="trash" src="/trash.svg" alt="Icône du panier" />
              </Button>
            )}
          </CartContainer>
        )}

        {/* GLOBAL PRICE */}

        <PrixContainer type={type}>
          {type !== "final_cart" && type !== "checkout" && <p className="PU">Prix Unitaire : {PU}€</p>}

          {!finalPrice ? (
            <>
              <p className="ST">Sous Total : {TTC}€</p>
            </>
          ) : (
            <>
              <p className="TTC">Total TTC : {TTC}€</p>
            </>
          )}

          {(type === "final_cart" || type === "checkout") && <p>Dont TVA 20% : {TVA}€</p>}
        </PrixContainer>
      </ResumeSummaryContainer>

      {/* SIGN UP DEVIS */}

      {createPortal(
        <GoogleOAuthProvider clientId="172052439601-dkqnbasm5ouddo44abnjs0c3qepoqcc6.apps.googleusercontent.com">
          <SignIn
            setSignUpOpen={setSignUpOpen}
            isSignInOpen={isSignInOpen}
            setSignInOpen={setSignInOpen}
            modalAnimation={modalAnimation}
            setModalAnimation={setModalAnimation}
            warningMessage={true}
          />
          <SignUp
            isSignUpOpen={isSignUpOpen}
            setSignUpOpen={setSignUpOpen}
            setSignInOpen={setSignInOpen}
            modalAnimation={modalAnimation}
            setModalAnimation={setModalAnimation}
          />
        </GoogleOAuthProvider>,
        document.body
      )}
    </>
  );
}
