import styled from "@emotion/styled";
import { useNotificationsContext } from "../../../../context/NotificationsContext";
import { TitleStyle } from "../../../utils/SharedStyle";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../../../App";

const InfoSection = styled.div`
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.displayAddressBoxColor};
  border-bottom: ${({ theme }) => theme.displayAddressBorder};
  padding: ${({ theme }) => theme.displayAddressPaddingAndRadius};
  border-radius: ${({ theme }) => theme.displayAddressPaddingAndRadius};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 65px;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.displayAddressTextColor};
  font-weight: bold;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.displayAddressTextColor};
  opacity: 0.8;
  font-weight: 500;
`;

const DeleteAddressButton = styled.button`
  display: inline-flex;
  width: fit-content;
  background-color: #c22f3e;
  color: white;
  border-radius: 5px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  img {
    height: 1.2rem;
    width: 1.2rem;
  }

  p {
    font-size: 12px;
    text-transform: capitalize;
  }

  &:hover {
    background-color: #772029;
  }
`;

// --- AFFICHAGE ADRESSE ---

export default function AddressDisplay({ isCheckout, address, onAddressDeleted, type }) {
  const { setNotifications } = useNotificationsContext();

  // --- DELETE ADDRESS ---

  async function submitDeleteAddress() {
    const isConfirmed = window.confirm("[ATTENTION] Êtes-vous sûr de vouloir supprimer cette adresse ?");

    if (isConfirmed) {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(`http://localhost:3000/api/address/deleteuseraddress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setNotifications({
            content: [data.message || "Une erreur est survenue lors de la suppression de l'adresse."],
            type: "error",
          });
        } else {
          setNotifications({
            content: [
              `Adresse de ${type.split("-")[1] === "billing" ? "facturation" : "livraison"} supprimée avec succès.`,
            ],
            type: "success",
          });
          onAddressDeleted(type, address.alias === "sync");
        }
      } catch (error) {
        setNotifications({
          content: ["Une erreur est survenue lors de la suppression de l'adresse."],
          type: "error",
        });
      }
    }
  }

  // --- SHOW ADDRESS ----

  return (
    <ThemeProvider theme={isCheckout ? darkTheme : lightTheme}>
      <div>
        {!isCheckout && <hr />}
        <TitleStyle fontSize="0.9rem" color={isCheckout ? "white" : "black"}>
          Adresse de {type.split("-")[1] === "billing" ? "facturation" : "livraison"} :
        </TitleStyle>
        <InfoSection>
          <InfoCard>
            <InfoLabel>Nom & Prénom</InfoLabel>
            <InfoValue>{address.firstname + " " + address.lastname}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Téléphone</InfoLabel>
            <InfoValue>{address.phone || "Non renseigné"}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Adresse</InfoLabel>
            <InfoValue>{address.address1}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Complément d'adresse</InfoLabel>
            <InfoValue>{address.address2 || "Non renseigné"}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Code postal</InfoLabel>
            <InfoValue>{address.postcode}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Ville</InfoLabel>
            <InfoValue>{address.city}</InfoValue>
          </InfoCard>

          <DeleteAddressButton onClick={submitDeleteAddress}>
            <img src="/unsave.svg" alt="" />
            <p>Supprimer l'Adresse de {type.split("-")[1] === "billing" ? "facturation" : "livraison"}</p>
          </DeleteAddressButton>
        </InfoSection>
      </div>
    </ThemeProvider>
  );
}
