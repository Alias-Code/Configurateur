import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAddChoice } from "./components/utils/AddChoice";

import { useNotificationsContext } from "./context/NotificationsContext";
import { useAuthContext } from "./context/AuthContext";
import { useAnimationContext } from "./context/AnimationContext";
import { useCartContext } from "./context/CartContext";
import { useModalContext } from "./context/ModalContext";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import ConfigurationSide from "./components/configuration/config-side/ConfigurationSide";
import RenderSide from "./components/configuration/render-side/RenderSide";
import Checkout from "./components/checkout/Checkout";
import CartInformations from "./components/checkout/CartInformations";
import Home from "./components/home/Home";
import Notifications from "./components/common/notifications/Notifications";
import EntryAnimation from "./components/common/animation/EntryAnimation";
import Profil from "./components/profil/Profil";
import Spinner from "./components/common/Spinner";
import Modal from "./components/common/modal/Modal";
import BottomBar from "./components/utils/BottomBar";
import { useMediaQueries } from "./config/config";

// --- STYLE ---

const ConfigContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden !important;

  @media (max-width: 992px) {
    height: auto;
    min-height: 90vh;
  }
`;

export default function AppContent() {
  // --- ÉTATS ET RÉFÉRENCES ---
  const { isAuthenticated, setIsAuthenticated, skipHome } = useAuthContext();
  const { entryAnimation } = useAnimationContext();
  const { notifications } = useNotificationsContext();
  const { configurations } = useCartContext();
  const { IS_MOBILE } = useMediaQueries();
  const { isOpen } = useModalContext();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const addChoice = useAddChoice();

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // --- AUTH ---

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setIsAuthenticated(true);
    }

    setIsAuthChecked(true);
  }, []);

  // --- DRAG AND DROP ---

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const dropZoneNumber = over.id.split("-")[1];
      addChoice(active.data.current.id, "draganddrop", dropZoneNumber);
    }
  };

  // --- RESIZE IPHONE ---

  useEffect(() => {
    const resizeApp = () => {
      if (/iPhone/.test(navigator.userAgent)) {
        document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
      }
    };

    resizeApp();
    window.addEventListener("resize", resizeApp);

    return () => {
      window.removeEventListener("resize", resizeApp);
    };
  }, []);

  // --- RENDU ---

  if (!isAuthChecked) {
    return <Spinner />;
  }

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={(event) => {
        handleDragEnd(event);
      }}>
      <HelmetProvider>
        <BrowserRouter>
          <DragOverlay>
            {activeId && <img src={`/${activeId}`} style={{ width: "auto", height: "auto" }} />}
          </DragOverlay>

          {/* DYNAMIC FAVICON */}

          <Helmet>
            <link rel="icon" href={isDarkMode ? "lumicrea_icon_white.png" : "lumicrea_icon_black.png"} />{" "}
          </Helmet>

          {/* GLOBAL */}

          <Notifications notifications={notifications} />
          {entryAnimation && <EntryAnimation />}
          {isOpen && <Modal />}

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
    </DndContext>
  );
}
