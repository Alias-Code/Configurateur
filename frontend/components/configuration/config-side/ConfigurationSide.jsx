import styled from "@emotion/styled";
import Steps from "./Steps";
import NavbarComponent from "./navigation/MainNavbar";
import { useMediaQuery, useTheme } from "@mui/material";
import MobileRenderPreview from "../render-side/MobileRenderPreview";
import AccountButton from "./navigation/AccountButton";
import { useCallback, useEffect, useState } from "react";

const ConfigurationSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;

  #logoVendome {
    max-width: 70%;
    margin: 2rem auto 0px auto;
    transform: translateX(-5px);
    display: block;
  }

  #accountButton {
    position: fixed;
    top: 10px;
    left: -100px;
    transition: all 0.5s ease;
  }

  .visible {
    left: 10px !important;
  }

  @media (max-width: 992px) {
    width: 100%;
    height: auto;
    position: relative;
  }
`;

export default function ConfigurationSide() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const [y, setY] = useState(window.scrollY);
  // const [visible, setVisible] = useState(false);

  // const handleNavigation = useCallback(
  //   (e) => {
  //     const window = e.currentTarget;
  //     if (y > window.scrollY) {
  //       setVisible(true);
  //       console.log("visible");
  //     } else if (y < window.scrollY) {
  //       setVisible(false);
  //     }
  //     setY(window.scrollY);
  //   },
  //   [y]
  // );

  // useEffect(() => {
  //   setY(window.scrollY);
  //   window.addEventListener("scroll", handleNavigation);

  //   return () => {
  //     window.removeEventListener("scroll", handleNavigation);
  //   };
  // }, [handleNavigation]);

  return (
    <ConfigurationSideContainer>
      {/* --- NAVBAR COMPONENT --- */}

      {!isMobile ? (
        <NavbarComponent />
      ) : (
        <>
          <MobileRenderPreview />
          {/* <div id="accountButton" className={visible ? "visible" : ""}>
            <AccountButton />
          </div> */}
          <img id="logoVendome" src="/Vendome.png" alt="" />
        </>
      )}

      {/* --- MAIN CONFIGURATION COMPONENT --- */}

      <Steps />
    </ConfigurationSideContainer>
  );
}
