import styled from "@emotion/styled";
import React from "react";
import AccountButton from "./AccountButton";
import { TitleStyle } from "../../../utils/SharedStyle";

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
    padding: 1rem 16px;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    height: 60px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 100%;

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

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
    p {
      font-size: 7px;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 11px;
  font-weight: bold;
  margin: 4px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

export default function MainNavbar() {
  return (
    <NavbarWrapper>
      <LeftSection>
        {/* AFFICHAGE DYNAMIQUE DU BOUTON ACCUEIL OU PROFIL */}

        <AccountButton />
        <Divider />

        <ContentSection>
          <TitleStyle fontSize={"0.7rem"}>COMPOSEZ VOTRE PRODUIT SUR MESURE</TitleStyle>
          <Subtitle>Créez votre modèle unique avec Vendôme, la marque haut de gamme.</Subtitle>
        </ContentSection>
      </LeftSection>

      <LogoContainer>
        <img src="/Vendome.png" alt="Logo de marque Vendôme" />
      </LogoContainer>
    </NavbarWrapper>
  );
}
