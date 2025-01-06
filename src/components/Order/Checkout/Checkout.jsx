import React, { useState, useEffect } from "react";
import { useNotificationsContext } from "../../../Context/NotificationsContext";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Resume from "../../Render/Resume";
import ResumeSummary from "../../Render/ResumeSummary";
import OrderConfirm from "../OrderConfirm";
import Informations from "./Informations";
import PaymentMethod from "./PaymentMethod";
import Shipping from "./Shipping";
import Adresses from "../../Profil/Sections/Adresses/Address";
import Spinner from "../../Global/Spinner";

const CheckoutHeader = styled.div`
  position: relative;

  img {
    position: absolute;
    z-index: 999999;
    right: 2%;
    top: 50%;
    transform: translateY(-50%);
    filter: invert(1);
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
`;

const CheckoutTitle = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  opacity: 1;
  transition: opacity 0.5s ease;
`;

const CartSummaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background-color: #bdbdbd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: black;
  transition: all 0.4s ease;

  &:hover {
    background-color: white;
  }

  svg {
    transform: ${({ expanded }) => (expanded ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.4s ease;
  }
`;

const EntryArea = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 1.5rem;

  &.textarea {
    width: 100%;
  }

  .label {
    top: 0.75rem;
    position: absolute;
    font-size: 1rem;
    color: #bdbdbd;
    transition: all 0.2s ease;
    pointer-events: none;
  }
`;

const OrderNote = styled.textarea`
  border: none;
  border-bottom: 1px solid gray;
  width: 100%;
  padding: 0.6rem 0;
  background: transparent;
  color: white;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    border-bottom-color: white;
  }

  &:focus + .label,
  &:not(:placeholder-shown) + .label {
    color: white;
    top: -10px;
    font-size: 0.85rem;
    transform: translateY(0);
  }
`;

const CheckoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  background-color: #bdbdbd;
  border: 1px solid black;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 1.2rem;
    height: 1.2rem;
    flex-shrink: 0;
  }

  p {
    font-size: 20px;
    flex-shrink: 0;
    margin: 0;
  }

  &:hover {
    background-color: white;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      transparent 40%,
      rgba(26, 26, 26, 0.25),
      transparent 60%,
      transparent
    );
    animation: glowingEffect 3s infinite linear;
  }

  @keyframes glowingEffect {
    0% {
      left: -100%;
    }
    100% {
      left: 200%;
    }
  }
`;

const FinalResume = styled.div`
  display: flex;

  & > button {
    flex: 0 0 60%;
  }

  & > div {
    flex: 0 0 40%;
    justify-content: flex-end;
  }
`;

const ResumeContainer = styled.div`
  color: #333;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-height: ${({ expanded }) => (expanded ? "75vh" : "0")};
  width: 100%;
  transition: all 0.75s ease;

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
    height: 13rem;
    width: 13rem;
    border-radius: 5px;
  }
`;

const ResumeSection = styled.div`
  width: 100%;
`;

const Checkout = ({ configurations, priceHT, setCheckoutAnimation }) => {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { setNotifications } = useNotificationsContext();
  const [loading, setLoading] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [selectedRelayPoint, setSelectedRelayPoint] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [orderDone, setOrderDone] = useState(false);
  const [formData, setFormData] = useState({
    shipping: {
      fullName: "",
      phone: "",
      address: "",
      additionalAddress: "",
      postalCode: "",
      city: "",
    },
    billing: {
      fullName: "",
      phone: "",
      address: "",
      additionalAddress: "",
      postalCode: "",
      city: "",
    },
    useForBilling: true,
    note: "",
  });

  // --- FETCH USER DATA ---

  const fetchUserAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/address/getuseraddress", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUserAddresses(data);
    } catch (error) {
      setNotifications({ content: error.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  //   --- ORDER DONE ---

  const handleCheckout = async () => {
    let messages = [];

    if (!selectedDelivery) {
      messages.push("Veuillez séléctionner une méthode d'éxpédition");
    }

    if (!selectedPayment) {
      messages.push("Veuillez séléctionner une méthode de paiement");
    }

    if (selectedDelivery === "relay" && !selectedRelayPoint) {
      messages.push("Veuillez séléctionner un point relai.");
    }

    // --- VERIF IF NO ADDRESS ---

    if (!userAddresses || userAddresses.length === 0) {
      const phoneRegex = /^[0-9]{10}$/;

      if (!formData.fullName) {
        messages.push("Veuillez entrer votre nom et prénom.");
      }

      if (!formData.address || !formData.postalCode || !formData.city) {
        messages.push("Veuillez entrer une adresse valide.");
      }

      if (formData.phone && !phoneRegex.test(formData.phone)) {
        messages.push("Veuillez entrer un numéro de téléphone valide.");
      }
    }

    if (messages.length > 0) {
      setNotifications((prev) => ({
        ...prev,
        content: [...prev.content, ...messages],
        type: "error",
      }));
    } else {
      // --- ORDER VERIFICATION ---

      const token = localStorage.getItem("token");
      const cart = JSON.parse(localStorage.getItem("configurations"));

      if (!token) {
        setNotifications({
          content: "Vous devez être connecté ou vous inscrire pour finaliser le paiement.",
          type: "error",
        });
        return;
      }

      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/api/order/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            note: formData.note,
            selectedDelivery,
            selectedPayment,
            cart,
            ...(selectedDelivery === "Point Relai - Mondial Relay" && { selectedRelayPoint }),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setNotifications({
            content: [data.message || "Une erreur est survenue."],
            type: "error",
          });
        } else {
          setOrderDone(data.orderNumber);
          setLoading(false);
        }
      } catch (error) {
        setNotifications({
          content: ["Une erreur est survenue lors de la confirmation de la commande, vous n'avez pas été débité."],
          type: "error",
        });
      }
    }
  };

  // --- EXPAND RESUME ---

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpandedSummary(true);
    }, 1000);
    return () => {
      clearTimeout(timer);
      setExpandedSummary(false);
    };
  }, []);

  const toggleSummary = () => {
    setExpandedSummary(!expandedSummary);
  };

  // --- HANDLERS ---

  function handleClose() {
    setCheckoutAnimation(false);
    window.history.pushState({}, "", "../configuration");
  }

  const handleRelayPointSelect = (point) => {
    setSelectedRelayPoint(point);
  };

  const handleNoteChange = (event) => {
    setFormData((prevFormData) => ({ ...prevFormData, note: event.target.value }));
  };

  function calculatePrice(priceHT) {
    const shippingPrice =
      selectedDelivery === "Point Relai - Mondial Relay"
        ? 4.99
        : selectedDelivery === "Domicile - Colissimo"
        ? 7.99
        : 0;

    const priceTTC = priceHT + shippingPrice;

    return priceTTC;
  }

  // RETURN

  return (
    <div style={{ width: "55%", margin: "0 auto" }}>
      <CheckoutHeader>
        <img src="close.svg" alt="" onClick={() => handleClose()} />
        <CheckoutTitle>{!orderDone ? "FINALISEZ VOTRE COMMANDE" : "MERCI POUR VOTRE COMMANDE !"}</CheckoutTitle>
      </CheckoutHeader>

      {orderDone ? (
        <OrderConfirm
          orderNumber={orderDone}
          selectedDelivery={selectedDelivery}
          selectedPayment={selectedPayment}
          priceHT={calculatePrice(priceHT)}
        />
      ) : (
        <>
          <CartSummaryButton expanded={expandedSummary} onClick={toggleSummary}>
            <strong>RÉSUMÉ DE MON PANIER</strong>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </CartSummaryButton>

          <ResumeContainer expanded={expandedSummary}>
            {Object.entries(configurations).map(([configKey, configuration], index) => (
              <ItemContainer key={configKey}>
                <img className="imagePreview" src={configuration.image} alt="Visualisation de la configuration" />
                <ResumeSection>
                  <Resume type="cart" configuration={configuration} itemIndex={index + 1} />
                </ResumeSection>
              </ItemContainer>
            ))}
          </ResumeContainer>

          {/* INFORMATIONS */}

          {/* <Informations formData={formData} setFormData={setFormData} setCheckoutAnimation={setCheckoutAnimation} /> */}

          <Adresses checkoutFormData={formData} setCheckoutFormData={setFormData} isCheckout={true} />

          {/* LIVRAISON */}

          <Shipping
            selectedDelivery={selectedDelivery}
            setSelectedDelivery={setSelectedDelivery}
            handleRelayPointSelect={handleRelayPointSelect}
          />

          {/* PAIEMENT */}

          <PaymentMethod selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />

          {/* CHECKOUT */}

          <EntryArea className="textarea">
            <OrderNote value={formData.note} onChange={handleNoteChange} rows={1} placeholder="" />
            <div className="label">Ajoutez une note à votre commande (optionnel)</div>
          </EntryArea>

          {/* FINAL RESUME */}

          <FinalResume>
            <CheckoutButton onClick={() => handleCheckout()}>
              {loading && <Spinner />}
              <img src="lock.svg" alt="" />
              <p>
                <strong>PROCÉDER AU PAIEMENT</strong>
              </p>
            </CheckoutButton>
            <ResumeSummary type="checkout" priceHT={calculatePrice(priceHT)} />
          </FinalResume>
        </>
      )}
    </div>
  );
};

export default Checkout;
