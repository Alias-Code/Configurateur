import styled from "styled-components";
import MainNavbar from "../configuration/config-side/navigation/MainNavbar.jsx";
import Navigation from "./Navigation.jsx";
import Content from "./Dashboard.jsx";
import { useMediaQueries } from "../../config/config.js";

const ProfilContainer = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  padding: 3rem 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100%;
  }
`;

export default function Profil() {
  const { IS_MOBILE } = useMediaQueries();

  return (
    <>
      {!IS_MOBILE && <MainNavbar />}
      <ProfilContainer>
        <Navigation />
        <Content />
      </ProfilContainer>
    </>
  );
}
