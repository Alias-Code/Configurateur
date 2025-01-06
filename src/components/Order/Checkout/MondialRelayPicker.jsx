import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  overflow: auto;
  background: transparent;
  border-radius: 10px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const WidgetContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  position: relative;

  & {
    .MR-Widget,
    .MR-Widget > div,
    .MR-Widget iframe,
    .MR-Widget .MR-List,
    .MR-Widget .MR-List .MR-ListPoint {
      background-color: transparent !important;
      width: 100% !important;
      color: #fff !important;
    }

    .MR-Widget {
      font-family: "Inter", sans-serif !important;
    }

    .leaflet-popup-content-wrapper {
      color: black !important;
    }

    .MR-Widget .MR-List {
      border-radius: 8px !important;
      border: 1px solid #333 !important;
    }

    .MR-Widget .MR-List .MR-ListPoint {
      padding: 12px !important;
      transition: background-color 0.2s ease;
      border-bottom: 1px solid #333 !important;
    }

    .MR-Widget .MR-List .MR-ListPoint:hover {
      background-color: red !important;
    }

    .MR-Widget .MR-List .MR-ListPoint.selected {
      background-color: #2d2d2d !important;
      border-left: 3px solid #3498db !important;
    }

    // Style des boutons
    .MR-Widget button,
    .MR-Widget .btn {
      background-color: #bdbdbd !important;
      border: none !important;
      color: black !important;
      font-weight: bold !important;
      border-radius: 6px !important;
      padding: 8px 16px !important;
      transition: background-color 0.2s ease !important;
    }

    .MR-Widget,
    .MR-Widget .MRW-Title {
      border: none !important;
    }

    .MR-Widget .MRW-Title {
      font-size: 16px;
    }

    // Style des inputs
    .MR-Widget input[type="text"] {
      background-color: black !important;
      border: 1px solid white !important;
      color: white !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
    }

    // Style de la carte
    .MR-Widget #map {
      border-radius: 8px !important;
      filter: brightness(0.8) contrast(1.2);
    }

    .PR-AutoCplCity {
      background-color: black !important;
    }

    .MR-Widget .MR-List .MR-ListPoint .nom {
      color: #3498db !important;
      font-weight: 500 !important;
    }

    .MR-Widget .MR-List .MR-ListPoint .address {
      color: #888 !important;
    }
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(26, 26, 26, 0.9);
  border-radius: 8px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid #333;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const MondialRelayPicker = ({ onPointRelaisSelect }) => {
  const widgetContainerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializationRef = useRef(false);

  useEffect(() => {
    const loadScript = async () => {
      if (document.querySelector('script[src*="mondialrelay"]')) {
        setIsScriptLoaded(true);
        setIsLoading(false);
        return;
      }

      try {
        const mrScript = document.createElement("script");
        mrScript.src =
          "https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js";
        mrScript.async = true;
        document.body.appendChild(mrScript);

        await new Promise((resolve) => {
          mrScript.onload = resolve;
        });

        // Attendre que le DOM soit stable
        await new Promise((resolve) => setTimeout(resolve, 100));

        setIsScriptLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des scripts:", error);
        setIsLoading(false);
      }
    };

    loadScript();

    return () => {
      if (window.jQuery && widgetContainerRef.current) {
        try {
          window.jQuery(widgetContainerRef.current).empty();
        } catch (e) {
          console.error("Erreur lors du nettoyage:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    const initializeWidget = () => {
      if (!window.jQuery || !widgetContainerRef.current || initializationRef.current) return;

      try {
        initializationRef.current = true;

        // Forcer un reflow avant l'initialisation
        void widgetContainerRef.current.offsetHeight;

        window.jQuery(widgetContainerRef.current).MR_ParcelShopPicker({
          Target: "#Target_Widget",
          Brand: "BDTEST  ",
          Country: "FR",
          PostCode: "",
          ColLivMod: "24R",
          NbResults: "6",
          ShowResultsOnMap: true,
          DisplayMapInfo: true,
          OnParcelShopSelected: (data) => {
            setSelectedPoint(data);
            onPointRelaisSelect?.(data);
          },
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation du widget:", error);
        initializationRef.current = false;
      }
    };

    if (isScriptLoaded) {
      // Attendre que le DOM soit complètement stable
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initializeWidget();
        });
      });
    }
  }, [isScriptLoaded, onPointRelaisSelect]);

  return (
    <Container>
      <WidgetContainer>
        {isLoading ? (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        ) : (
          <div
            id="Zone_Widget"
            ref={widgetContainerRef}
            style={{
              height: "500px",
              width: "98%",
              margin: "0 auto",
              opacity: isScriptLoaded ? 1 : 0, // Masquer jusqu'à ce que tout soit prêt
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        )}
        <input type="hidden" id="Target_Widget" />
      </WidgetContainer>
    </Container>
  );
};

export default MondialRelayPicker;
