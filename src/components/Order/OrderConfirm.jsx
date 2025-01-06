import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useCartContext } from "../../Context/CartContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Animation pour l'apparition des éléments
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  color: #ffffff;
  /* animation: ${fadeIn} 0.6s ease-out; */
`;

const SuccessCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #5cb85c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const SubTitle = styled.h2`
  text-align: center;
  font-weight: 500;
  font-size: 1.2rem;
  color: #5cb85c;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: #5cb85c;
    border-radius: 2px;
  }
`;

const OrderInfoContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem 2rem 1rem;
  margin: 2rem 2rem 1rem;
  width: 100%;
  backdrop-filter: blur(10px);
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: #888;
    font-size: 0.9rem;
  }

  span {
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const StatusBadge = styled.div`
  background: ${({ waiting }) => (waiting ? "#a76a30" : "#5cb85c")};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  width: fit-content;

  svg,
  img {
    width: 20px;
    height: 20px;
  }
`;

const NotificationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(92, 184, 92, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;

  .link {
    text-decoration: underline;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #5cb85c;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const Button = styled.button`
  background: #5cb85c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2ca82c;
  }
`;

const VideoWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999999;
  width: 100%;
  height: 100%;
  background: black;
`;

export default function OrderConfirm({ orderNumber, priceHT, selectedDelivery, selectedPayment }) {
  const { deleteCart } = useCartContext();
  const [showContent, setShowContent] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoEnded(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoEnded) {
      setShowContent(true);
    }
  }, [videoEnded]);

  useEffect(() => {
    return () => {
      deleteCart();
    };
  }, []);

  return (
    <Container>
      {!showContent && (
        <VideoWrapper>
          <video width="100%" height="100%" autoPlay muted onEnded={() => setVideoEnded(true)}>
            <source src="ordersucceed.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas les vidéos.
          </video>
        </VideoWrapper>
      )}

      {showContent && (
        <>
          <SuccessCircle>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </SuccessCircle>

          <SubTitle>Commande confirmée avec succès</SubTitle>

          <OrderInfoContainer>
            <OrderInfoGrid>
              <InfoItem>
                <label>Numéro de commande</label>
                <span>#{orderNumber}</span>
              </InfoItem>
              <InfoItem>
                <label>Méthode de livraison</label>
                <span>{selectedDelivery}</span>
              </InfoItem>
              <InfoItem>
                <label>Statut</label>
                <StatusBadge waiting={selectedPayment === "Virement Bancaire"}>
                  {selectedPayment === "Virement Bancaire" ? (
                    <img src="clock.svg" alt="En attente de virement bancaire" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {selectedPayment === "Carte Bancaire" ? "Confirmée" : "Attente De Virement"}
                </StatusBadge>
              </InfoItem>
              <InfoItem>
                <label>Montant total</label>
                <span>{(priceHT * 1.2).toFixed(2)}€</span>
              </InfoItem>
            </OrderInfoGrid>

            <NotificationSection>
              <img src="emailsend.svg" alt="" />
              <p>
                Un email de confirmation contenant les détails de votre commande a été envoyé à
                <strong> alias.bcll@gmail.com</strong>. Veuillez vérifier votre boîte de réception.
              </p>
            </NotificationSection>

            <NotificationSection>
              <img src="printer.svg" alt="Icône d'impremerie" />
              <p>
                Vous pouvez vérifier l'état de votre commande à tout moment sur la page{" "}
                <Link to="/profil/commandes" className="link">
                  Mes Commandes
                </Link>
                . Vous pouvez également retrouver l'historique de vos devis dans la catégorie{" "}
                <Link to="/profil/devis" className="link">
                  Mes Devis
                </Link>
                .
              </p>
            </NotificationSection>
          </OrderInfoContainer>

          <Button as={Link} to="/profil/commandes">
            Voir Mes Commandes
          </Button>
        </>
      )}
    </Container>
  );
}
