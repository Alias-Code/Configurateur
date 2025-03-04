import styled from "@emotion/styled";
import Resume from "../configuration/render-side/Resume";
import ResumeSummary from "../utils/ResumeSummary";
import CheckoutConfirm from "./CheckoutConfirm";
import PaymentMethod from "./checkout-steps/PaymentMethod";
import Shipping from "./checkout-steps/Shipping";
import Adresses from "../profil/sections/adresses/Address";
import Spinner from "../common/Spinner";
import React, { useState, useEffect, useRef } from "react";
import { useNotificationsContext } from "../../context/NotificationsContext";

const CheckoutContainer = styled.div`
  margin: 0 auto;
  width: 55%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 85%;
  }
`;

const CheckoutHeader = styled.div`
  position: relative;
`;

const CheckoutTitle = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  opacity: 1;
  transition: opacity 0.5s ease;
  letter-spacing: 2px;
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

  img {
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
  width: fit-content;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background-color: #bdbdbd;
  border: 1px solid black;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 0.8rem;
    height: 0.8rem;
    flex-shrink: 0;
    transform: translateY(-0.5px);
  }

  p {
    font-size: clamp(9px, 1.5vw, 10px);
    letter-spacing: 1px;
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
      rgb(207, 170, 96, 0.4),
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
  justify-content: center;
`;

const ResumeContainer = styled.div`
  color: white;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
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

const GoBottomArrowContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 0;
  z-index: 99999999999999;
  transition: opacity 0.3s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
`;

const GoBottomArrow = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 35px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 50%;
    height: 50%;
    transition: all 0.3s ease;
  }

  &:hover {
    img {
      transform: translateY(2px);
    }
  }
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-right: 0.5rem;

  .imagePreview {
    height: 9rem;
    width: 9rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ResumeSection = styled.div`
  width: 100%;
`;

const FreeShipping = styled.div`
  background-color: ${({ $freeShipping }) =>
    $freeShipping ? "rgba(210, 255, 214, 0.427)" : "rgba(255, 113, 127, 0.514)"};
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  width: fit-content;
`;

const ReturnButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  position: absolute;
  background-color: white;
  border-radius: 5px;
  right: 0;
  top: 50%;
  padding: 6px;
  transform: translateY(-50%);
  cursor: pointer;

  img {
    width: 1.2rem;
    height: 1.2rem;
  }

  p {
    color: black;
    font-weight: 700;
    font-size: 10px;
  }
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
  const [arrowVisible, setArrowVisible] = useState(true);
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

  const freeShipping = priceHT >= 500;

  // --- FETCH USER DATA ---

  const fetchUserAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/address/getuseraddress`, {
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

    const phoneRegex = /^[0-9]{10}$/;

    const adressIncomplete =
      !formData.shipping.fullName &&
      !formData.shipping.address &&
      !formData.shipping.postalCode &&
      !formData.shipping.city &&
      formData.shipping.phone &&
      !phoneRegex.test(formData.shipping.phone);

    if ((!userAddresses || userAddresses.length === 0) && !adressIncomplete) {
      if (!formData.shipping.fullName) {
        messages.push("Veuillez entrer votre nom et prénom.");
      }

      if (!formData.shipping.address || !formData.shipping.postalCode || !formData.shipping.city) {
        messages.push("Veuillez entrer une adresse valide.");
      }

      if (!formData.shipping.phone || (formData.shipping.phone && !phoneRegex.test(formData.shipping.phone))) {
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/order/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            note: formData.note,
            formAddress: formData.shipping,
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
      freeShipping && selectedDelivery !== "Domicile - Chronopost"
        ? 0
        : selectedDelivery === "Point Relai - Mondial Relay"
        ? 4.99
        : selectedDelivery === "Domicile - Colissimo"
        ? 7.99
        : selectedDelivery === "Domicile - Chronopost"
        ? 9.99
        : 0;

    const priceTTC = priceHT + shippingPrice;

    return priceTTC;
  }

  // GO TO BOTTOM SYSTEM

  const resumeContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (resumeContainerRef.current) {
      resumeContainerRef.current.scrollTo({
        top: resumeContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setArrowVisible(false);
    }
  };

  const handleScroll = () => {
    if (resumeContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = resumeContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setArrowVisible(!isNearBottom);
    }
  };

  useEffect(() => {
    const container = resumeContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [expandedSummary]);

  // RETURN

  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <ReturnButton onClick={() => handleClose()}>
          <img src="/back.svg" alt="" />
          <p>Retour au Configurateur</p>
        </ReturnButton>
        <CheckoutTitle>{!orderDone ? "FINALISEZ VOTRE COMMANDE" : "MERCI POUR VOTRE COMMANDE !"}</CheckoutTitle>
      </CheckoutHeader>

      {orderDone ? (
        <CheckoutConfirm
          orderNumber={orderDone}
          selectedDelivery={selectedDelivery}
          selectedPayment={selectedPayment}
          priceHT={calculatePrice(priceHT)}
        />
      ) : (
        <>
          <CartSummaryButton expanded={expandedSummary} onClick={toggleSummary}>
            <strong>RÉSUMÉ DE MON PANIER</strong>
            <img src="/resume-arrow-down.svg" alt="Icône flèche orienté vers le bas" />
          </CartSummaryButton>

          <ResumeContainer ref={resumeContainerRef} expanded={expandedSummary}>
            {/* RESUME ORDER */}

            {configurations &&
              Object.entries(configurations).map(([configKey, configuration], index) => (
                <ItemContainer key={configKey}>
                  <img className="imagePreview" src={configuration.image} alt="Visualisation de la configuration" />
                  <ResumeSection>
                    <Resume type="cart" configuration={configuration} itemIndex={index + 1} />
                  </ResumeSection>
                </ItemContainer>
              ))}
            <ResumeSummary type="checkout" priceHT={calculatePrice(priceHT)} finalPrice={true} />

            {/* BOTTOM ARROW */}

            {expandedSummary && configurations && Object.keys(configurations).length >= 4 && (
              <GoBottomArrowContainer $visible={arrowVisible}>
                <GoBottomArrow onClick={scrollToBottom}>
                  <img src="/arrow_down_black.svg" alt="Flèche pour descendre tout en bas du résumé" />
                </GoBottomArrow>
              </GoBottomArrowContainer>
            )}
          </ResumeContainer>

          <Adresses checkoutFormData={formData} setCheckoutFormData={setFormData} isCheckout={true} />

          {/* LIVRAISON */}

          <Shipping
            selectedDelivery={selectedDelivery}
            setSelectedDelivery={setSelectedDelivery}
            handleRelayPointSelect={handleRelayPointSelect}
            priceHT={priceHT}
          />

          {/* FREE SHIPPING */}

          <FreeShipping $freeShipping={freeShipping}>
            {freeShipping ? (
              <p>
                Votre commande dépasse le montant de 500,00 €, vous avez débloqué la ‎
                <strong>livraison gratuite</strong>.
              </p>
            ) : (
              <p>
                Il ne vous manque plus que <strong>{(500 - priceHT).toFixed(2)} €</strong> pour débloquer la
                <strong>livraison gratuite</strong>.
              </p>
            )}
          </FreeShipping>

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
              <img src="/lock.svg" alt="Icône de cadena sécurisé" />
              <p>
                <strong>PROCÉDER AU PAIEMENT</strong>
              </p>
            </CheckoutButton>
          </FinalResume>
        </>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;
