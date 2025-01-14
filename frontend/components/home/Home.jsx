import styled from "@emotion/styled";
import HomeNavbar from "./HomeNavbar";
import MainContent from "./MainContent";

// --- STYLE ---

const HomeContainer = styled.div`
  width: 100%;
  background: url("/home_bg.png") center;
  background-size: cover;
  display: flex;
  flex-direction: column;
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
