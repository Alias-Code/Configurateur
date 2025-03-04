import styled from "@emotion/styled";
import HomeNavbar from "./HomeNavbar";
import MainContent from "./MainContent";

// --- STYLE ---

const HomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: url("/accueil.webp") center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// --- HOME ---

export default function Home() {
  return (
    <HomeContainer>
      <HomeNavbar />
      <MainContent />
    </HomeContainer>
  );
}
