import styled from "styled-components";
import MainNavbar from "../configuration/config-side/MainNavbar.jsx";
import Navigation from "./Navigation.jsx";
import Content from "./Dashboard.jsx";

const ProfilContainer = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  padding: 3rem 2rem;
`;

export default function Profil() {
  return (
    <>
      <MainNavbar />
      <ProfilContainer>
        <Navigation />
        <Content />
      </ProfilContainer>
    </>
  );
}
