import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TitleStyle } from "../../utils/SharedStyle";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useAuthContext } from "../../../context/AuthContext";

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 1rem;
  }
`;

const InfoText = styled.p`
  margin-bottom: 2rem;
  color: black;
`;

const CardsContainer = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const Card = styled(Link)`
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.5s ease;
  text-decoration: none;
  text-transform: capitalize;
  color: inherit;
  cursor: pointer;

  &:hover {
    color: #cfaa60 !important;
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  filter: invert(1);
`;

const CardTitle = styled.h3`
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const cardData = [
  {
    title: "Tableau de bord",
    iconSrc: "/dashboard.svg",
    section: "/profil/tableau-de-bord",
  },
  {
    title: "Commandes",
    iconSrc: "/order.svg",
    section: "/profil/commandes",
  },
  { title: "Devis", iconSrc: "/invoice.svg", section: "/profil/devis" },
  {
    title: "Détails du compte",
    iconSrc: "/profil.svg",
    section: "/profil/details-du-compte",
  },
  {
    title: "Adresses",
    iconSrc: "/address.svg",
    section: "/profil/adresses",
  },
  {
    title: "Déconnexion",
    iconSrc: "/logout.svg",
    section: false, // PAS DE REDIRECTION MAIS LA FUNCTION LOGOUT
  },
];

export default function TableauDeBord() {
  const { setNotifications } = useNotificationsContext();
  const { logout } = useAuthContext();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`http://localhost:3000/api/user/getuserdetails`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          setNotifications({ content: error.message, type: "error" });
        }
      } else {
        setNotifications({ content: "Aucun token trouvé. Veuillez vous connecter.", type: "error" });
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <DashboardContainer>
      {/* HEADER INFORMATIONS */}

      <TitleStyle>Bienvenue sur votre tableau de bord</TitleStyle>
      <InfoText>
        Vous êtes actuellement connecté avec l'adresse : <strong>{userInfo ? userInfo.email : "Chargement..."}</strong>
      </InfoText>

      {/* CARDS */}

      <CardsContainer>
        {cardData.map((card, index) => (
          <Card key={index} to={card.section} onClick={!card.section && logout}>
            <IconWrapper>
              <Icon src={card.iconSrc} alt={card.title} />
            </IconWrapper>
            <CardTitle>{card.title}</CardTitle>
          </Card>
        ))}
      </CardsContainer>
    </DashboardContainer>
  );
}
