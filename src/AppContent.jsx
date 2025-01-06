import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNotificationsContext } from "./Context/NotificationsContext";
import { useAuthContext } from "./Context/AuthContext";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAnimationContext } from "./Context/AnimationContext";
import { useCartContext } from "./Context/CartContext";

import ConfigurationSide from "./components/Configuration/ConfigurationSide";
import RenderSide from "./components/Render/RenderSide";
import Checkout from "./components/Order/CartInformations";
import CartInformations from "./components/Order/CartInformations";
import Home from "./components/Home/Home";
import Notifications from "./components/Global/Notifications";
import EntryAnimation from "./components/Global/EntryAnimation";
import Profil from "./components/Profil/Profil";
import Spinner from "./components/Global/Spinner";

// --- STYLE ---

const ConfigContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

export default function AppContent() {
  // --- ÉTATS ET RÉFÉRENCES ---
  const { isAuthenticated, setIsAuthenticated, skipHome } = useAuthContext();
  const { entryAnimation } = useAnimationContext();
  const { notifications } = useNotificationsContext();
  const { configurations } = useCartContext();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // --- AUTH ---

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setIsAuthenticated(true);
    }

    setIsAuthChecked(true);
  }, []);

  // --- RENDU ---

  if (!isAuthChecked) {
    return <Spinner />;
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* DYNAMIC FAVICON */}

        <Helmet>
          <link rel="icon" href={isDarkMode ? "lumicrea_icon_white.png" : "lumicrea_icon_black.png"} />{" "}
        </Helmet>

        {/* GLOBAL */}

        <Notifications notifications={notifications} />
        {entryAnimation && <EntryAnimation />}

        {/* ROUTES */}

        <Routes>
          <Route path="/" element={<Navigate to="/accueil" replace />} />

          <Route
            path="/accueil"
            element={!skipHome && !isAuthenticated ? <Home /> : <Navigate to="/configuration" />}
          />

          <Route path="/profil/*" element={isAuthenticated ? <Profil /> : <Navigate to="/accueil" />} />

          <Route
            path="/paiement"
            element={
              Object.keys(configurations).length > 0 && isAuthenticated ? (
                <Checkout />
              ) : (
                <Navigate to="/configuration" />
              )
            }
          />

          <Route
            path="/configuration"
            element={
              isAuthenticated || skipHome ? (
                <ConfigContainer>
                  <ConfigurationSide />
                  <RenderSide />
                  <CartInformations />
                </ConfigContainer>
              ) : (
                <Navigate to="/accueil" />
              )
            }
          />

          {/* UNKNOW URL */}

          <Route path="*" element={isAuthenticated ? <Navigate to="/configuration" /> : <Navigate to="/accueil" />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
