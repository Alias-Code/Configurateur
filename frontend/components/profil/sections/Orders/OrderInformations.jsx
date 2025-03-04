/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import Spinner from "../../../common/Spinner";
import Resume from "../../../configuration/render-side/Resume";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { TitleStyle } from "../../../utils/SharedStyle";
import { useCartContext } from "../../../../context/CartContext";

const OrderModalContent = styled.div`
  background-color: white;
  border: 1px solid black;
  border-radius: 12px;
  padding: 2rem 3rem;
  width: 50vw;
  max-width: 90vw;
  height: fit-content;
  max-height: 90%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  overflow: auto !important;

  transform: scale(0.3);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;

  hr {
    margin-bottom: 1rem;
    border: 0.5px solid black !important;
  }

  &.open {
    transform: scale(1);
    opacity: 1;
  }

  &.close {
    transform: scale(0.3);
    opacity: 0;
  }
`;

const OrderModalHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  img {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 0;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
  }
`;

const Adresses = styled.div`
  display: flex;
  justify-content: space-between;

  h3 {
    font-size: 16px;
  }
`;

const overlayStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.open {
    opacity: 1;
  }

  &.close {
    opacity: 0;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  p {
    color: black !important;
  }

  hr {
    border: none;
    height: 0.1px;
    background: black;
    opacity: 0.8;
  }

  img {
    height: 8rem;
    width: 8rem;
  }
`;

const PrixContainer = styled.div`
  text-align: right;
  margin-top: 0.5rem;

  & p:last-child {
    font-size: 10px;
  }
`;

export default function OrderDetails({ selectedOrder, orderTotalAmount, handleCloseModal }) {
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [animationState, setAnimationState] = useState("close");
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // --- OPEN & CLOSE ANIMATION ---

  useEffect(() => {
    const timer = setTimeout(() => setAnimationState("open"), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimatedClose = () => {
    setAnimationState("close");
    setTimeout(() => {
      handleCloseModal();
    }, 500);
  };

  // --- FETCH USER ADDRESS ---

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
      setLoading(false);
    } catch (error) {
      setNotifications({ content: error.message, type: "error" });
    }
  };

  // --- FETCH ORDER DETAILS ---

  const fetchOrderDetails = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/order/getorder/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSelectedOrderDetails(data);
      setLoadingOrder(false);
    } catch (error) {
      setNotifications({ content: error.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchOrderDetails(selectedOrder.order_id);
    fetchUserAddresses();
  }, []);

  // --- RETURN ---

  return (
    <div css={overlayStyles} className={animationState} onClick={handleCloseModal}>
      <OrderModalContent className={animationState} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <OrderModalHeader>
          <TitleStyle fontSize="1rem" fontWeight="700">
            Détails de la commande #{selectedOrder?.order_number}
          </TitleStyle>
          <img src="/close.svg" alt="Fermer" onClick={handleAnimatedClose} />
        </OrderModalHeader>

        {/* HISTORIQUE DES ITEMS */}
        {!loadingOrder ? (
          <>
            {Object.entries(selectedOrderDetails).map(([configKey, configuration]) => (
              <ItemContainer key={configKey}>
                <img className="imagePreview" src={configuration.image} alt="Visualisation de la configuration" />
                <Resume type="orderHistory" configuration={configuration} />
              </ItemContainer>
            ))}
          </>
        ) : (
          <Spinner />
        )}

        <PrixContainer>
          <div>
            <p>
              <strong>Total TTC :</strong> {orderTotalAmount} €
            </p>
            <p>Dont TVA (20%) : {(orderTotalAmount * 0.2).toFixed(2)} €</p>
          </div>
        </PrixContainer>

        {/* ADRESSES UTILISÉES */}

        {/* <hr />

        <Adresses>
          <div>
            <h3>Adresse de livraison</h3>
            {!loading ? (
              <>
                <p>
                  {userAddresses[0]?.lastname} {userAddresses[0]?.firstname}
                </p>
                <p>{userAddresses[0]?.phone}</p>
                <p>{userAddresses[0]?.address1}</p>
                <p>
                  {userAddresses[0]?.postcode} {userAddresses[0]?.city}
                </p>
              </>
            ) : (
              <Spinner />
            )}
          </div>
          <div>
            <h3>Adresse de facturation</h3>
            {!loading ? (
              <>
                <p>
                  {userAddresses[0]?.lastname} {userAddresses[0]?.firstname}
                </p>
                <p>{userAddresses[0]?.phone}</p>
                <p>{userAddresses[0]?.address1}</p>
                <p>
                  {userAddresses[0]?.postcode} {userAddresses[0]?.city}
                </p>
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </Adresses> */}
      </OrderModalContent>
    </div>
  );
}
