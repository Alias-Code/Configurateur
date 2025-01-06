import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNotificationsContext } from "../../../../Context/NotificationsContext";
import { TitleStyle } from "../../../Global/SharedStyle";
import OrderInformations from "./OrderInformations";

const OrderListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const OrderCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: black;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    font-size: 0.9rem;
    color: #6b7280;
  }
`;

const OrderDetails = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  color: #374151;

  div p {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  svg {
    margin-right: 0.5rem;
    vertical-align: middle;
  }
`;

const EmptyMessage = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: black;
`;

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("fr-FR", options).replace(" à", " à");
};

export default function Commandes() {
  const { setNotifications } = useNotificationsContext();
  const [userOrders, setUserOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- FETCH USER ORDERS ---

  const fetchUserOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/order/getorders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUserOrders(data);
    } catch (error) {
      setNotifications({ content: error.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // --- MODAL HANDLERS ---

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    setTimeout(() => {
      setSelectedOrder(null);
    }, 300);
  };

  return (
    <>
      <TitleStyle mb="1rem">Historique de vos commandes</TitleStyle>
      <hr />
      {userOrders.length === 0 ? (
        <EmptyMessage>
          <strong>Vous n'avez aucune commande.</strong>
        </EmptyMessage>
      ) : (
        <OrderListContainer>
          {userOrders.map((order) => (
            <OrderCard key={order.order_id} onClick={() => handleOrderClick(order)}>
              <Header>
                <TitleStyle fontSize={"0.9rem"}>Commande n°{order.order_number}</TitleStyle>
                <p>
                  Passée le <strong>{formatDate(order.order_date)}</strong>
                </p>
              </Header>
              <OrderDetails>
                {/* LEFT SIDE (PRICE) */}

                <div>
                  <p>
                    <strong>Montant HT :</strong> {(order.total_amount / 1.2).toFixed(2)} €
                  </p>
                  <p>
                    <strong>TVA :</strong> {(order.total_amount * 0.2).toFixed(2)} €
                  </p>
                  <p>
                    <strong>Total TTC :</strong> {order.total_amount} €
                  </p>
                </div>

                {/* RIGHT PRICE (INFORMATIONS) */}

                <div>
                  <p>
                    <img src="/informations.svg" width={16} height={16} /> <strong>Statut :</strong> {order.status}
                  </p>
                  <p>
                    <img src="/shipping.svg" width={16} height={16} /> <strong>Livraison : </strong>{" "}
                    {order.shipping_method}
                  </p>
                  <p>
                    <img src="/payment.svg" width={16} height={16} /> <strong>Paiement :</strong> {order.payment_method}
                  </p>
                </div>
              </OrderDetails>
            </OrderCard>
          ))}
        </OrderListContainer>
      )}

      {/* ORDER DETAILS */}

      {showModal && (
        <OrderInformations selectedOrder={selectedOrder} showModal={showModal} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
}
