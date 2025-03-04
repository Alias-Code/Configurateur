import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Spinner from "../../common/Spinner";

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

    .MR-Widget input[type="text"] {
      border: 1px solid white !important;
      color: black !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
    }

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

    .MRW-Content > div:last-child {
      display: none !important;
    }

    .MRW-Line input.Arg2 {
      width: 70px !important;
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
    const loadJQuery = async () => {
      if (!window.jQuery) {
        const script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => script.onload = resolve);
      }
  
      const mrScript = document.createElement("script");
      mrScript.src = "https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js";
      mrScript.async = true;
      document.body.appendChild(mrScript);
  
      await new Promise((resolve) => mrScript.onload = resolve);
      setIsScriptLoaded(true);
      setIsLoading(false);
    };
  
    loadJQuery();
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
          <Spinner />
        ) : (
          <div
            id="Zone_Widget"
            ref={widgetContainerRef}
            style={{
              height: "500px",
              width: "98%",
              margin: "0 auto",
              opacity: isScriptLoaded ? 1 : 0,
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
