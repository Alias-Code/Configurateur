import React, { createContext, useContext, useState } from "react";

const ChoicesContext = createContext();

export function ChoicesProvider({ children }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const defaultChoice = {
    couleur: { id: "CL-BM", name: "Couleur Blanc Mat", value: 25 },
    facade: { id: "TH-3", name: "Facade Triple Horizontale", price: 180, width: "9", height: "3" },
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
        1: { positionY: "49%", positionX: "50%" },
        1: { positionY: "49%", positionX: "50%" },
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
  const [renderImage, setRenderImage] = useState("/plaques/CL-BM_TH-3.jpg");

  function getSelectedFacadeForIndex() {
    return selectedFacade - 1;
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
      }}>
      {children}
    </ChoicesContext.Provider>
  );
}

export const useChoicesContext = () => useContext(ChoicesContext);
