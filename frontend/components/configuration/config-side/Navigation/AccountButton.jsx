import React from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../../context/AuthContext";

const AccountButtonContainer = styled.button`
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

  img {
    width: 20px;
    height: 20px;
  }
`;

export default function AccountButton() {
  const { isAuthenticated, setSkipHome } = useAuthContext();

  const navigate = useNavigate();
  const location = useLocation();

  const isInProfile = location.pathname.startsWith("/profil");

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

  return (
    <AccountButtonContainer onClick={handleAccountClick}>
      {!isInProfile && isAuthenticated ? (
        <img src="/profile.svg" alt="Icone de profile" />
      ) : (
        <img src="/home.svg" alt="Icone d'accueil" />
      )}
    </AccountButtonContainer>
  );
}
