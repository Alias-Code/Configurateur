import styled from "@emotion/styled";
import { useState } from "react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useAuthContext } from "../../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  z-index: 99999999999;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: left;
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
  text-align: center;
  transform: scale(0.5);

  p {
    font-size: 0.75rem;
    text-decoration: underline;
    text-align: right;
    margin-bottom: 15px;
  }

  hr {
    margin: 20px 0;
  }

  a {
    justify-content: end;
  }

  .warning {
    color: #a82633;
    text-decoration: none;
    text-align: center;
    font-size: 0.7rem;
  }

  .buttonContainer {
    display: flex;
    gap: 1rem;
  }

  .entryarea {
    position: relative;
    height: 80px;

    .label {
      position: absolute;
      transform: translateY(-50%);
      left: 25px;
      top: 50%;
      transition: all 0.2s ease;
      background-color: white;
      font-size: 0.9rem;
    }
  }

  &.open {
    opacity: 1;
    transform: scale(1);
  }

  &.close {
    opacity: 0;
    transform: scale(0.5);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  background-color: transparent;
  padding: 0.75rem;
  transition: all 0.2s ease;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1111;

  &:focus,
  &:valid {
    border-color: #1a1a1a;
  }

  &:focus + .label,
  &:valid + .label {
    color: #1a1a1a;
    height: 20px;
    font-weight: bold;
    transform: translate(-25px, -35px) scale(0.85);
    z-index: 3000;
    padding: 0 10px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const CreateAccountButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: white;
  color: #1a1a1a;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
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

const HrContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0.5rem 0;
`;

const Line = styled.hr`
  flex-grow: 1;
  border: none;
  border-top: 1.5px solid black;
  margin: 0 10px;
`;

const CenteredText = styled.span`
  font-size: 0.5rem;
  padding: 0 5px;
  font-weight: 100;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: black;
`;

export default function SignIn({
  isSignInOpen,
  setSignInOpen,
  setSignUpOpen,
  modalAnimation,
  setModalAnimation,
  warningMessage,
}) {
  const { login } = useAuthContext();
  const { setNotifications } = useNotificationsContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // --- HANDLERS ---

  const handleCloseSignIn = () => {
    setModalAnimation("close");
    setTimeout(() => {
      setSignInOpen(false);
    }, 500);
  };

  const handleOpenSignUp = () => {
    handleCloseSignIn();
    setTimeout(() => {
      setSignUpOpen(true);
      setTimeout(() => {
        setModalAnimation("open");
      }, 50);
    }, 700);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // --- SIMPLE AUTH FUNCTION ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const messages = [];

    if (!emailRegex.test(formData.email)) {
      messages.push("Veuillez entrer une adresse mail valide.");
    }

    if (!formData.password) {
      messages.push("Veuillez entrer un mot de passe valide.");
    }

    if (messages.length > 0) {
      setNotifications({
        content: messages,
        type: "error",
      });
      return;
    }

    const { email, password } = formData;

    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotifications({
          content: [data.message || "Une erreur est survenue."],
          type: "error",
        });
      } else {
        login(data.token);
        setTimeout(() => {
          setNotifications({
            content: ["Connexion réalisée avec succès."],
            type: "success",
          });
        }, 5300);
      }
    } catch (error) {
      setNotifications({
        content: ["Une erreur est survenue lors de la connexion."],
        type: "error",
      });
    }
  };

  // --- GOOGLE AUTH FUNCTION ---

  // const handleLoginSuccess = (response) => {
  //   if (response?.credential) {
  //     const encodedToken = encodeURIComponent(response.credential);
  //     window.location.href = `http://localhost:3000/auth/google/callback?token=${encodedToken}`;

  //   } else {
  //     console.error('La réponse Google ne contient pas "credential".');
  //   }
  // };

  const handleLoginSuccess = (response) => {
    if (response?.credential) {
      login(response.credential);

      setTimeout(() => {
        setNotifications({
          content: ["Connexion via Google réalisée avec succès."],
          type: "success",
        });
      }, 5300);
    } else {
      setNotifications({
        content: ["Échec de l'authentification Google."],
        type: "error",
      });
    }
  };

  return (
    <Overlay isOpen={isSignInOpen} onClick={handleCloseSignIn}>
      <Modal className={modalAnimation} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleCloseSignIn}>&times;</CloseButton>

        {/* SIMPLE CONNEXION */}

        {warningMessage && (
          <p className="warning">Veuillez vous inscrire pour avoir accès à toutes les fonctionnalités</p>
        )}

        <h2>Connectez-vous</h2>
        <div className="entryarea">
          <Input type="text" name="email" value={formData.email} onChange={handleChange} required />
          <div className="label">Email*</div>
        </div>
        <div className="entryarea">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="label">Mot de passe*</div>
          <EyeButton onClick={togglePasswordVisibility}>
            <img src="eye.svg" alt="Icône pour afficher le mot de passe" />
          </EyeButton>
        </div>
        <p>
          <a href="https://lumicrea.fr/mot-de-passe-oublie" target="_blank">
            Mot de passe oublié ?
          </a>
        </p>
        <div className="buttonContainer">
          <SubmitButton type="submit" onClick={handleSubmit}>
            Connexion
          </SubmitButton>
          <CreateAccountButton onClick={handleOpenSignUp}>Créer un compte</CreateAccountButton>
        </div>

        {/* SOCIAL CONNEXION */}

        <HrContainer>
          <Line />
          <CenteredText>RÉSEAUX SOCIAUX</CenteredText>
          <Line />
        </HrContainer>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Erreur")} />
      </Modal>
    </Overlay>
  );
}
