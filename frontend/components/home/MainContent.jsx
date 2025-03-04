import styled from "@emotion/styled";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import { useState } from "react";
import { useAnimationContext } from "../../context/AnimationContext";
import { TitleStyle } from "../utils/SharedStyle";

// --- STYLE ---

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  margin-top: 1rem;
  height: 90vh;

  h2 {
    font-weight: bold;
  }
`;

const Description = styled.p`
  font-size: clamp(0.7rem, 2vw, 1rem);
  max-width: 600px;
  padding: 0 1rem;
  margin-top: 1rem;
  color: #dbdbdb;
`;

const HrContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 1.5rem 0;
`;

const Line = styled.hr`
  flex-grow: 1;
  border: none;
  border-top: 1.5px solid white;
  margin: 0 10px;
`;

const CenteredText = styled.span`
  font-size: 0.55rem;
  font-weight: 100;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffffff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Logo = styled.img`
  height: 80px;
  margin-top: 1rem;
`;

const Button = styled.button`
  color: white;
  border-radius: 7px;
  font-size: clamp(0.65rem, 2vw, 0.75rem);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(4px, 1vw, 5px) clamp(8px, 2vw, 10px);
  gap: clamp(0.2rem, 0.5vw, 0.25rem);
  border: 1px solid black;
  cursor: pointer;

  background-color: ${({ type }) => (type === "white" ? "white" : "#1a1a1a")};
  color: ${({ type }) => (type === "white" ? "black" : "white")};

  img {
    height: clamp(0.9rem, 2vw, 1.3rem);
    width: clamp(0.9rem, 2vw, 1.3rem);
  }
`;

// --- MAIN CONTENT ---

export default function MainContent() {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { setEntryAnimation } = useAnimationContext();

  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("");

  // --- HANDLERS ---

  const handleOpenSignIn = () => {
    setSignInOpen(true);
    setTimeout(() => {
      setModalAnimation("open");
    }, 50);
  };

  function handleSkip() {
    setEntryAnimation("skip_/configuration");
  }

  // --- RENDU ---

  return (
    <div>
      {/* MAIN CONTENT */}

      <MainContentContainer>
        <TitleStyle color="white" fontSize="1rem">
          Configurez votre produit haut de gamme
        </TitleStyle>
        <Description>
          Choisissez parmi une large gamme de designs et de finitions pour adapter votre installation électrique à vos
          besoins et à votre style.
        </Description>
        <Logo src="/vendomeserie2_white.webp" alt="Logo Lumicrea" />
        <HrContainer>
          <Line />
          <CenteredText>Commencez votre configuration</CenteredText>
          <Line />
        </HrContainer>
        <ButtonGroup>
          <Button type="white" onClick={handleOpenSignIn}>
            <img src="/login.svg" alt="Icône de connexion" />
            Se connecter ou s'inscrire
          </Button>
          <Button type="black" onClick={handleSkip}>
            <img src="/visitor.svg" alt="Icône de visiteur non identifié" />
            Continuer sans s'identifier
          </Button>
        </ButtonGroup>
      </MainContentContainer>

      {/* SIGN IN/UP FORMS WITH GOOGLE AUTH */}

      <SignIn
        setSignUpOpen={setSignUpOpen}
        isSignInOpen={isSignInOpen}
        setSignInOpen={setSignInOpen}
        modalAnimation={modalAnimation}
        setModalAnimation={setModalAnimation}
      />
      <SignUp
        isSignUpOpen={isSignUpOpen}
        setSignUpOpen={setSignUpOpen}
        setSignInOpen={setSignInOpen}
        modalAnimation={modalAnimation}
        setModalAnimation={setModalAnimation}
      />
    </div>
  );
}
