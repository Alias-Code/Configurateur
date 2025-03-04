import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useAuthContext } from "../../../context/AuthContext";
import { TitleStyle, FormStar } from "../../utils/SharedStyle";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  height: 50px;
`;

const AccountBadge = styled.span`
  padding: 8px 16px;
  width: fit-content;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: ${({ $isPro }) => ($isPro ? "#e8f5e9" : "rgba(193, 193, 193, 0.5)")};
  color: black;
`;

const InfoSection = styled.div`
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const InfoCard = styled.div`
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 65px;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.5rem;
  transition: all 0.2s ease;
  background-color: transparent;

  &:focus,
  &:valid {
    border-color: #1a1a1a;
  }

  &:focus + .label,
  &:valid + .label {
    transform: translate(-10px, -29px) scale(0.85) !important;
    font-weight: bold;
    z-index: 10 !important;
  }
`;

const EyeButton = styled.button`
  display: flex;
  background: none;
  border: none;
  position: absolute;
  z-index: 4000;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);

  img {
    height: 1.2rem;
    width: 1.2rem;
    cursor: pointer;
  }
`;

const Form = styled.form`
  margin-top: 30px;
  border-top: 2px solid #eee;

  h2 {
    margin: 1.5rem 0;
  }
  .inputGroup {
    display: flex;
    gap: 1rem;
    width: 95%;
  }

  .entryarea {
    position: relative;
    flex: 1;

    .label {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.2s ease;
      background-color: white;
      padding: 0 0.3rem;
      font-size: 0.85rem;
      z-index: -1;
    }
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 10px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.75rem;
  transition: all 0.4s ease;
  cursor: pointer;

  img {
    width: 0.9rem;
    height: auto;
  }

  &:hover {
    background-color: #c22f3e;
  }
`;

const DeleteUserButton = styled.button`
  display: inline-flex;
  width: fit-content;
  background-color: #c22f3e;
  color: white;
  border-radius: 5px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  img {
    height: 0.9rem;
    width: 0.9rem;
  }

  p {
    font-size: 9px;
    text-transform: capitalize;
  }

  &:hover {
    background-color: #962e39;
  }
`;

const formatDateFr = (dateString) => {
  if (!dateString) return "Non disponible";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function DetailsDuCompte() {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { setNotifications } = useNotificationsContext();
  const { logout } = useAuthContext();
  const [userInfo, setUserInfo] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // --- INFORMATIONS UTILISATEUR ---

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getuserdetails`, {
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

  // --- HANDLE RESET PASSWORD ---

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (oldPassword.length < 5 || newPassword.length < 5) {
      setNotifications({ content: "Veuillez entrer des mots de passe valide.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/updatepassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          setNotifications({
            content: [data.message || "Une erreur est survenue."],
            type: "error",
          });
        } else {
          setNotifications({
            content: ["Votre mot de passe a été actualisé avec succès !"],
            type: "success",
          });
        }
      } catch (error) {
        setNotifications({
          content: ["Une erreur est survenue lors de l'actualisation du mot de passe."],
          type: "error",
        });
      }
    }
  };

  // --- HANDLE DELETE ACCOUNT ---

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm("[ATTENTION] Êtes-vous sûr de vouloir supprimer votre compte ?");

    if (isConfirmed) {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/deleteaccount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setNotifications({
            content: [data.message || "Une erreur est survenue."],
            type: "error",
          });
        } else {
          setNotifications({
            content: ["Votre compte a été supprimé avec succès !"],
            type: "success",
          });
          logout();
          localStorage.removeItem("configurations");
        }
      } catch (error) {
        setNotifications({
          content: ["Une erreur est survenue lors de la suppression du compte."],
          type: "error",
        });
      }
    }
  };

  return (
    <div>
      <HeaderContainer>
        <TitleStyle fontWeight="700">Détails du compte</TitleStyle>
        {userInfo && (
          <AccountBadge $isPro={userInfo.siret}>
            {userInfo.siret ? "Compte Professionnel" : "Compte Particulier"}
          </AccountBadge>
        )}
      </HeaderContainer>

      {userInfo && (
        <>
          <InfoSection>
            {userInfo.siret ? (
              <InfoCard>
                <InfoLabel>Nom & Prénom</InfoLabel>
                <InfoValue>{userInfo.lastname + " " + userInfo.firstname}</InfoValue>
              </InfoCard>
            ) : (
              <>
                <InfoCard>
                  <InfoLabel>Prénom</InfoLabel>
                  <InfoValue>{userInfo.firstname}</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>Nom</InfoLabel>
                  <InfoValue>{userInfo.lastname}</InfoValue>
                </InfoCard>
              </>
            )}

            <InfoCard>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{userInfo.email}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Téléphone</InfoLabel>
              <InfoValue>{userInfo.phone || "Non renseigné"}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Date d'inscription</InfoLabel>
              <InfoValue>{formatDateFr(userInfo.date_add)}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoLabel>Newsletter</InfoLabel>
              <InfoValue>{userInfo.newsletter ? "Inscrit" : "Non inscrit"}</InfoValue>
            </InfoCard>

            {userInfo.siret && (
              <>
                <InfoCard>
                  <InfoLabel>SIRET</InfoLabel>
                  <InfoValue>{userInfo.siret}</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>Entreprise</InfoLabel>
                  <InfoValue>{userInfo.company}</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>Profession</InfoLabel>
                  <InfoValue>{userInfo.profession}</InfoValue>
                </InfoCard>
              </>
            )}

            <DeleteUserButton onClick={handleDeleteAccount}>
              <img src="/warning.svg" alt="Alerte de suppression de compte" />
              <p>Supprimer Le Compte</p>
            </DeleteUserButton>
          </InfoSection>

          <Form>
            <TitleStyle fontWeight="700">Réinitialiser mon mot de passe</TitleStyle>
            <div className="inputGroup">
              <div className="entryarea">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <div className="label">
                  Ancien mot de passe<FormStar>*</FormStar>
                </div>
                <EyeButton type="button" onClick={() => setShowOldPassword((prevState) => !prevState)}>
                  <img
                    src={showOldPassword ? "../eyeoff.svg" : "../eye.svg"}
                    alt="Icône pour afficher / masquer le mot de passe"
                  />
                </EyeButton>
              </div>
              <div className="entryarea">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <div className="label">
                  Nouveau mot de passe<FormStar>*</FormStar>
                </div>
                <EyeButton type="button" onClick={() => setShowNewPassword((prevState) => !prevState)}>
                  <img
                    src={showNewPassword ? "../eyeoff.svg" : "../eye.svg"}
                    alt="Icône pour afficher / masquer le mot de passe"
                  />
                </EyeButton>
              </div>
              <SubmitButton type="submit" onClick={handleResetPassword}>
                <img src="/reset.svg" alt="Icône de réinitialisation" />
                Réinitialiser
              </SubmitButton>
            </div>
          </Form>
        </>
      )}
    </div>
  );
}
