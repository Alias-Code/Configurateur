import styled from "@emotion/styled";
import Configuration from "./Steps";
import NavbarComponent from "./MainNavbar";

// --- CONFIGURATION SIDE CONTAINER STYLES ---
const ConfigurationSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;

  @media (max-width: 992px) {
    width: 100%;
  }
`;

export default function ConfigurationSide() {
  return (
    <ConfigurationSideContainer>
      {/* --- NAVBAR COMPONENT --- */}
      <NavbarComponent />

      {/* --- MAIN CONFIGURATION COMPONENT --- */}
      <Configuration />
    </ConfigurationSideContainer>
  );
}
