import React, { createContext, useContext, useState } from "react";
import { useAnimationContext } from "./AnimationContext";
import { RENDER_BASE_IMAGE } from "../config/config";

const ChoicesContext = createContext();

export function ChoicesProvider({ children }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const defaultChoice = {
    couleur: { id: "", name: "", value: 0 },
    facade: { id: "", name: "", price: 0 },
    quantity: 1,
    facades: [
      {
        id: 1,
        cylindres: [],
        retros: [],
        prises: [],
        gravures: [],
      },
      {
        id: 2,
        cylindres: [],
        retros: [],
        prises: [],
        gravures: [],
      },
      {
        id: 3,
        cylindres: [],
        retros: [],
        prises: [],
        gravures: [],
      },
    ],
  };

  const [mecanismeRenderPosition, setMecanismeRenderPosition] = useState({
    simple: {
      unemplacement: {
        1: { positionY: "49%", positionX: "50%" },
      },
      deuxemplacements: {
        1: { positionY: "49%", positionX: "30%" },
        1: { positionY: "49%", positionX: "60%" },
      },
    },

    double: {
      horizontale: {
        unemplacement: {
          1: { positionY: "50%", positionX: "35%" },
          2: { positionY: "48%", positionX: "65%" },
        },
        deuxemplacements: {
          1: { positionY: "50%", positionX: "35%" },
          2: { positionY: "48%", positionX: "65%" },
          3: { positionY: "50%", positionX: "35%" },
          4: { positionY: "48%", positionX: "65%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "37%", positionX: "48%" },
          2: { positionY: "63%", positionX: "52%" },
        },
        deuxemplacements: {
          1: { positionY: "37%", positionX: "48%" },
          2: { positionY: "63%", positionX: "52%" },
          3: { positionY: "37%", positionX: "48%" },
          4: { positionY: "63%", positionX: "52%" },
        },
      },
    },

    triple: {
      horizontale: {
        unemplacement: {
          1: { positionY: "51%", positionX: "23%" },
          2: { positionY: "49%", positionX: "51%" },
          3: { positionY: "47%", positionX: "78%" },
        },
        deuxemplacements: {
          1: { positionY: "51%", positionX: "40%" },
          2: { positionY: "49%", positionX: "51%" },
          3: { positionY: "47%", positionX: "40%" },
          4: { positionY: "51%", positionX: "60%" },
          5: { positionY: "49%", positionX: "75%" },
          6: { positionY: "47%", positionX: "95%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "23%", positionX: "46.5%" },
          2: { positionY: "49.5%", positionX: "50%" },
          3: { positionY: "76%", positionX: "54%" },
        },
        deuxemplacements: {
          1: { positionY: "23%", positionX: "46.5%" },
          2: { positionY: "49.5%", positionX: "50%" },
          3: { positionY: "76%", positionX: "54%" },
          4: { positionY: "23%", positionX: "46.5%" },
          5: { positionY: "49.5%", positionX: "50%" },
          6: { positionY: "76%", positionX: "54%" },
        },
      },
    },
    images: [],
  });

  const [choices, setChoices] = useState(defaultChoice);
  const [selectedFacade, setSelectedFacade] = useState(1);
  const [renderImage, setRenderImage] = useState("/plaques/plaque_vide.jpg");

  function getSelectedFacadeForIndex(type, dropZoneNumber) {
    if (type === "click") {
      return selectedFacade - 1;
    } else if (type === "draganddrop") {
      return dropZoneNumber;
    }
  }

  // --- RESET CONFIG ---

  const { setAnimationStarted, setOrbitControls } = useAnimationContext();

  function resetConfig(type) {
    setSelectedFacade(1);

    if (type.includes("delete_all")) {
      setChoices(defaultChoice);
      setRenderImage(RENDER_BASE_IMAGE);
      setOrbitControls(null);
      setAnimationStarted(null);
      setOrbitControls((prev) => {});
    } else {
      setChoices((prevChoices) => {
        const updatedChoices = { ...defaultChoice };
        updatedChoices.couleur = prevChoices.couleur;
        return updatedChoices;
      });
      setRenderImage(`plaques/${choices.couleur.id}.png`);
    }
  }

  return (
    <ChoicesContext.Provider
      value={{
        choices,
        setChoices,
        defaultChoice,
        selectedFacade,
        setSelectedFacade,
        getSelectedFacadeForIndex,
        renderImage,
        setRenderImage,
        mecanismeRenderPosition,
        setMecanismeRenderPosition,
        resetConfig,
      }}>
      {children}
    </ChoicesContext.Provider>
  );
}

export const useChoicesContext = () => useContext(ChoicesContext);
