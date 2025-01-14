import styled from "@emotion/styled";
import React, { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { TitleStyle } from "../../utils/SharedStyle";

const NavbarWrapper = styled.nav`
  width: 100%;
  height: 80px;
  padding: 3rem 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 60px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 50%;

  @media (max-width: 768px) {
    gap: 16px;
    max-width: 60%;
  }
`;

const Divider = styled.div`
  height: 36px;
  border-right: 1px solid black;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AccountButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: black;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: calc(100% - 50px);
  }
`;

const Subtitle = styled.p`
  font-size: 11px;
  font-weight: bold;
  margin: 4px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 40%;

  img {
    max-height: 60px;
    transform: translateY(-5px);
    width: auto;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    max-width: 30%;

    img {
      max-height: 50px;
    }
  }
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  height: 40px;
  padding: 0 16px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  position: absolute;
  right: 0;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
    filter: invert(1);
  }

  @media (max-width: 480px) {
    height: 32px;
    padding: 0 12px;

    img {
      width: 20px;
      height: 20px;
    }
  }
`;

export default function MainNavbar() {
  const { isAuthenticated, setSkipHome } = useAuthContext();
  const [menu, setMenu] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = () => setMenu((prev) => !prev);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (isInProfile) {
        navigate("/configuration");
      } else {
        navigate("/profil");
      }
    } else {
      setSkipHome(false);
    }
  };

  const isInProfile = location.pathname.startsWith("/profil");

  return (
    <NavbarWrapper>
      <LeftSection>
        {/* AFFICHAGE DYNAMIQUE DU BOUTON ACCUEIL OU PROFIL */}

        <AccountButton onClick={handleAccountClick}>
          {!isInProfile && isAuthenticated ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          )}
        </AccountButton>
        <Divider />
        <ContentSection>
          <TitleStyle fontSize={"1rem"}>VOTRE PRODUIT SUR MESURE</TitleStyle>
          <Subtitle>Créez votre modèle unique avec Vendôme, la marque haut de gamme.</Subtitle>
        </ContentSection>
      </LeftSection>

      <LogoContainer>
        <img src="/Vendome.png" alt="Logo de marque Vendôme" />
      </LogoContainer>

      {isMobile && (
        <MenuButton onClick={handleMenu}>
          <img src={!menu ? "/viewconfig.svg" : "/eyeoff.svg"} alt="Icône du menu" />
        </MenuButton>
      )}
    </NavbarWrapper>
  );
}
