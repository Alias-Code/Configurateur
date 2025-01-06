import styled from "styled-components";
import Navbar from "../Configuration/Navbar.jsx";
import Navigation from "./Navigation.jsx";
import Content from "./Content.jsx";

const ProfilContainer = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  padding: 3rem 2rem;
`;

export default function Profil() {
  return (
    <>
      <Navbar />
      <ProfilContainer>
        <Navigation />
        <Content />
      </ProfilContainer>
    </>
  );
}
