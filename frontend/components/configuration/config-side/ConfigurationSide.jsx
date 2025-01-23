import styled from "@emotion/styled";
import Steps from "./Steps";
import NavbarComponent from "./MainNavbar";
import { useMediaQuery, useTheme } from "@mui/material";
import MobileRenderPreview from "../render-side/MobileRenderPreview";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <ConfigurationSideContainer>
      {/* --- NAVBAR COMPONENT --- */}
      {!isMobile ? <NavbarComponent /> : <MobileRenderPreview />}
      {/* --- MAIN CONFIGURATION COMPONENT --- */}
      <Steps />
    </ConfigurationSideContainer>
  );
}
