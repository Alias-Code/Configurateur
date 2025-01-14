import styled from "@emotion/styled";
import { useAnimationContext } from "../../context/AnimationContext";

// --- STYLE ---

const NavBarContainer = styled.div`
  width: 100%;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
`;

const Logo = styled.img`
  height: 50px;
  margin-left: 1.5rem;
`;

const NavButton = styled.button`
  background-color: ${({ type }) => (type === "white" ? "white" : "#1a1a1a")};
  color: ${({ type }) => (type === "white" ? "black" : "white")};
  padding: 4px 8px;
  border: none;
  border-radius: 7px;
  font-size: 0.7rem;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

// --- HOME NAVBAR ---

export default function HomeNavbar() {
  const { setEntryAnimation } = useAnimationContext();

  // --- SKIP HOME ---

  function handleSkip() {
    setEntryAnimation("skip_/configuration");
  }

  // --- RENDU ---

  return (
    <NavBarContainer>
      <a href="https://lumicrea.fr">
        <NavButton type="white">
          <img src="arrow_left.svg" alt="Icône de retour en arrière" />
          Retour au site
        </NavButton>
      </a>
      <Logo src="logo_lumicrea_white.png" alt="Logo Lumicrea" />
      <NavButton type="black" onClick={handleSkip}>
        <img src="plus.svg" alt="Icône de création de configuration" /> Créer une configuration
      </NavButton>
    </NavBarContainer>
  );
}
