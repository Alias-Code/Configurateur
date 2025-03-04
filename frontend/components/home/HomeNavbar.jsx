import styled from "@emotion/styled";
import { useAnimationContext } from "../../context/AnimationContext";

// --- STYLE ---

const NavBarContainer = styled.div`
  width: 100%;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
`;

const Logo = styled.img`
  height: 60px;
`;

// --- HOME NAVBAR ---

export default function HomeNavbar() {
  // --- RENDU ---

  return (
    <NavBarContainer>
      <Logo src="/logo_lumicrea_white.webp" alt="Logo Lumicrea" />
    </NavBarContainer>
  );
}
