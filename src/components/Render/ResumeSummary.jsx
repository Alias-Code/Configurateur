import styled from "@emotion/styled";
import Modal from "../Global/Modal";
import html2canvas from "html2canvas";
import { useState } from "react";
import { Button } from "../Global/SharedStyle";
import { useNotificationsContext } from "../../Context/NotificationsContext";
import { useChoicesContext } from "../../Context/ChoicesContext";
import { useCartContext } from "../../Context/CartContext";
import { useAnimationContext } from "../../Context/AnimationContext";
import { useAuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const ResumeSummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartIcon = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  transition: filter 0.5s ease;
  cursor: pointer;

  &:hover {
    filter: invert(48%) sepia(72%) saturate(200%) hue-rotate(77deg) brightness(105%) contrast(85%);
  }
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

  button p {
    font-size: 0.6rem;
  }
`;

const PrixContainer = styled.div`
  text-align: right;

  p {
    font-size: ${({ type }) => (type === "final_cart" ? "0.8rem" : "0.70rem")};
  }

  .prix {
    font-size: ${({ type }) => (type === "final_cart" ? "0.9rem" : "0.80rem")};
    font-weight: 700;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  border: 1px solid white;
  border-radius: 10px;
  font-weight: bold;
  height: 2.2rem;
  width: auto;

  button {
    color: white;
    font-size: 1rem;
    padding: 0.4rem 0.6rem;
    transform: scale(1);
    transition: transform 0.5s ease;
    cursor: pointer;

    &:hover {
      transition: transform 0.5s ease;
      transform: scale(1.3);
    }
  }

  input {
    width: 2rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
    text-align: center;

    &:focus {
      outline: none;
    }
  }
`;

export default function ResumeSummary({ renderRef, priceHT, type, quantity, itemIndex }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { setAnimationStarted, setOrbitControls, checkoutAnimation, setCheckoutAnimation } = useAnimationContext();
  const { choices, setChoices, defaultChoice, setSelectedFacade, setMecanismeRenderPosition } = useChoicesContext();
  const { configurations, setConfigurations, calculateAllTotalItems } = useCartContext();
  const { setNotifications } = useNotificationsContext();
  const { isAuthenticated } = useAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [imageData, setImageData] = useState(null);

  const [number, setNumber] = useState(type === "cart" ? quantity : choices.quantity);

  // --- MODALS ---

  const handleCancelClick = (item) => {
    setModalItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalItem(null);
  };

  // --- INCREASE NUMBER CHOICES OR DIRECTLY FROM CART ---

  const increaseNumber = () => {
    if (type === "render") {
      setChoices((prevChoices) => ({
        ...prevChoices,
        quantity: prevChoices.quantity < 999 ? prevChoices.quantity + 1 : prevChoices.quantity,
      }));
      setNumber((prevNumber) => (prevNumber < 999 ? prevNumber + 1 : prevNumber));
    } else {
      let panier = localStorage.getItem("configurations");
      panier = JSON.parse(panier);

      const newQuantity = panier[`config${itemIndex}`].quantity + 1;

      if (newQuantity < 999) {
        panier[`config${itemIndex}`].quantity = newQuantity;
        localStorage.setItem("configurations", JSON.stringify(panier));
        setConfigurations(JSON.stringify(panier));
        setNumber(newQuantity);
      }
    }
  };

  const decreaseNumber = () => {
    if (type === "render") {
      setChoices((prevChoices) => ({
        ...prevChoices,
        quantity: prevChoices.quantity > 1 ? prevChoices.quantity - 1 : prevChoices.quantity,
      }));
      setNumber((prevNumber) => (prevNumber > 1 ? prevNumber - 1 : prevNumber));
    } else {
      let panier = localStorage.getItem("configurations");
      panier = JSON.parse(panier);

      if (panier[`config${itemIndex}`].quantity > 1) {
        const newQuantity = quantity - 1;

        panier[`config${itemIndex}`].quantity = newQuantity;
        localStorage.setItem("configurations", JSON.stringify(panier));

        setConfigurations(JSON.stringify(panier));
        setNumber(newQuantity);
      }
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value < 999) {
      setNumber(value);

      if (type === "render") {
        setChoices((prevChoices) => ({
          ...prevChoices,
          quantity: value,
        }));
      } else {
        let panier = localStorage.getItem("configurations");
        panier = JSON.parse(panier);
        panier[`config${itemIndex}`].quantity = value;
        localStorage.setItem("configurations", JSON.stringify(panier));
        setConfigurations(JSON.stringify(panier));
      }
    }
  };

  // --- ADD TO CART ---

  const handleAddToCart = (quantity) => {
    if (renderRef.current) {
      if (!choices.facade.id && !choices.facade.couleur && !calculateAllTotalItems(choices)) {
        setNotifications({ content: "Vous ne pouvez pas ajouter une configuration vide au panier.", type: "error" });
        return;
      }

      const options = {
        backgroundColor: null,
        scale: window.devicePixelRatio,
        useCORS: true,
        width: renderRef.current.offsetWidth,
        height: renderRef.current.offsetHeight,
        logging: false,
        removeContainer: true,
        allowTaint: true,
        foreignObjectRendering: false,
      };

      html2canvas(renderRef.current, options)
        .then((canvas) => {
          // --- CREATE CANVA ---

          const finalCanvas = document.createElement("canvas");
          const ctx = finalCanvas.getContext("2d");

          finalCanvas.width = renderRef.current.offsetWidth;
          finalCanvas.height = renderRef.current.offsetHeight;

          ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

          const quality = 0.7;
          const base64ImageData = finalCanvas.toDataURL("image/jpeg", quality);

          setImageData(base64ImageData);

          // --- ADD TO CART ---

          let panier = localStorage.getItem("configurations");
          panier = panier ? JSON.parse(panier) : {};

          const newItem = { quantity, ...choices, image: base64ImageData };

          if (Object.keys(panier).length === 0) {
            panier.config1 = newItem;
          } else {
            const lastItemKey = Object.keys(panier).pop();
            const lastItemNumber = parseInt(lastItemKey.replace("config", ""), 10);
            const nextItemNumber = lastItemNumber + 1;
            panier[`config${nextItemNumber}`] = newItem;
          }

          localStorage.setItem("configurations", JSON.stringify(panier));

          setNotifications({ content: "Vous avez bien ajouté votre produit au panier !", type: "success" });

          resetCart();
        })
        .catch((error) => {
          console.error("Erreur lors de la capture du canevas :", error);
        });
    }
  };

  // --- RESET CART ---

  function resetCart() {
    setChoices(defaultChoice);
    setAnimationStarted(null);
    setOrbitControls(null);
    setSelectedFacade(1);
    setNumber(1);

    setMecanismeRenderPosition((prevState) => ({
      ...prevState,
      prises: {
        ...prevState.prises,
        images: [],
      },
    }));
  }
  // --- CREATE INVOICE ---

  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    // --- AUTH CHECKER ---

    const token = localStorage.getItem("token");

    if (!token) {
      setNotifications({
        content: ["Vous devez être connecté pour enregistrer un devis."],
        type: "error",
        link: {
          href: "http://localhost:5173/accueil",
          text: "Inscrivez-vous !",
        },
      });
      return;
    }

    // --- INVOICE GENERATOR ---

    const rawCart = JSON.parse(localStorage.getItem("configurations"));

    const cartArray = Object.values(rawCart);
    const cartWithoutImages = cartArray.map((config) => {
      const { image, ...configWithoutImage } = config;
      return configWithoutImage;
    });

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
      } else {
        const data = await response.json();
        setNotifications({
          content: [data.message || "Une erreur est survenue."],
          type: "error",
          ...(response.status === 401 && {
            link: {
              href: "http://localhost:5173/accueil",
              text: "Inscrivez-vous !",
            },
          }),
        });
      }
    } catch (error) {
      setNotifications({
        content: ["Une erreur est survenue lors de la connexion."],
        type: "error",
      });
    }
  };

  // --- CHECKOUT AUTH CHECKER ---

  function handleCheckoutClick(e) {
    e.preventDefault();

    if (isAuthenticated) {
      setCheckoutAnimation(true);
      window.history.pushState({}, "", "../paiement");
    } else {
      setNotifications({
        content: "Vous devez être connecté pour finaliser le paiement.",
        type: "error",
        link: {
          href: "http://localhost:5173/accueil",
          text: "Inscrivez-vous !",
        },
      });
    }
  }

  // --- RENDER ---

  return (
    <ResumeSummaryContainer>
      {type !== "checkout" && (
        <CartContainer>
          {/* QUANTITE POUR PRODUIT UNITAIRE */}

          {type !== "final_cart" && type !== "history" && (
            <ButtonContainer checkoutAnimation={checkoutAnimation}>
              <button onClick={decreaseNumber}>-</button>
              <input type="text" value={number} onChange={handleChange} />
              <button onClick={increaseNumber}>+</button>
            </ButtonContainer>
          )}

          {type === "render" ? (
            // --- RENDER ---
            <CartIcon onClick={() => handleAddToCart(number)} src="cart.svg" alt="" />
          ) : type === "cart" ? (
            // --- INDIVIDUAL CART ---
            <TrashIcon onClick={() => handleCancelClick(itemIndex)} src="trash.svg" alt="Supprimer le produit" />
          ) : type !== "history" ? (
            // --- FINAL CART ---
            <>
              <Button type="checkout" bgColorHover={"#419741"} textHover={"white"} onClick={handleCheckoutClick}>
                <img className="bag" src="/checkout.svg" alt="Icône du panier" />
                <p>PAYER EN LIGNE</p>
              </Button>

              <Button onClick={handleCreateInvoice} type="checkout" bgColorHover={"#419741"} textHover={"white"}>
                <img className="bag" src="/invoice.svg" alt="Icône du panier" />
                <p>SAUVEGARDER EN DEVIS</p>
              </Button>

              <Button
                borderColor={"#a82633"}
                bgColorHover={"transparent"}
                onClick={() => handleCancelClick(configurations)}>
                <img className="trash" src="/trash.svg" alt="Icône du panier" />
              </Button>
            </>
          ) : (
            ""
          )}
        </CartContainer>
      )}

      {/* GLOBAL PRICE */}

      <PrixContainer type={type}>
        <p>MONTANT HT : {priceHT.toFixed(2)}€</p>
        <p>TVA 20% : {(priceHT * 0.2).toFixed(2)}€</p>
        <p className="prix">TOTAL TTC : {(priceHT + priceHT * 0.2).toFixed(2)}€</p>
      </PrixContainer>

      {/* DELETE MODAL */}
      {showModal && <Modal type={type} numberCartItem={modalItem} closeModal={closeModal} />}
    </ResumeSummaryContainer>
  );
}
