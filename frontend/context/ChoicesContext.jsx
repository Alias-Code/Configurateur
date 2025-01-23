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

  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
    } else {
      setChoices((prevChoices) => {
        const updatedChoices = { ...defaultChoice };
        updatedChoices.couleur = prevChoices.couleur;
        return updatedChoices;
      });
      setRenderImage(`plaques/${choices.couleur.id}.png`);
    }
  }

  // ID TO IMAGE NAME

  // ID TO IMAGE NAME

  function idToImageName(id) {
    switch (id) {
      // PRISES

      case "P-RJ45_CL-AC":
        return "RJ45 acier ";
      case "P-RJ45_CL-BM":
        return "RJ45 blanc ";
      case "P-RJ45_CL-BZ":
        return "RJ45 bronze ";
      case "P-RJ45_CL-CF":
        return "RJ45 canon ";
      case "P-RJ45_CL-LT":
        return "RJ45 laiton ";
      case "P-RJ45_CL-N":
        return "RJ45 noir ";

      case "P-USBA_CL-AC":
        return "USB-A acier ";
      case "P-USBA_CL-BM":
        return "USB-A blanc ";
      case "P-USBA_CL-BZ":
        return "USB-A bronze ";
      case "P-USBA_CL-CF":
        return "USB-A canon ";
      case "P-USBA_CL-LT":
        return "USB-A laiton ";
      case "P-USBA_CL-N":
        return "USB-A noir ";

      case "P-USBC_CL-AC":
        return "USB-C acier ";
      case "P-USBC_CL-BM":
        return "USB-C blanc ";
      case "P-USBC_CL-BZ":
        return "USB-C bronze ";
      case "P-USBC_CL-CF":
        return "USB-C canon ";
      case "P-USBC_CL-LT":
        return "USB-C laiton ";
      case "P-USBC_CL-N":
        return "USB-C noir ";

      case "P-USBAC_CL-AC":
        return "USB acier ";
      case "P-USBAC_CL-BM":
        return "USB blanc ";
      case "P-USBAC_CL-BZ":
        return "USB bronze ";
      case "P-USBAC_CL-CF":
        return "USB canon ";
      case "P-USBAC_CL-LT":
        return "USB laiton ";
      case "P-USBAC_CL-N":
        return "USB noir ";

      case "P-HDMI_CL-AC":
        return "HDMI acier ";
      case "P-HDMI_CL-BM":
        return "HDMI blanc ";
      case "P-HDMI_CL-BZ":
        return "HDMI bronze ";
      case "P-HDMI_CL-CF":
        return "HDMI canon ";
      case "P-HDMI_CL-LT":
        return "HDMI laiton ";
      case "P-HDMI_CL-N":
        return "HDMI noir ";

      case "P-TV_CL-AC":
        return "TV acier ";
      case "P-TV_CL-BM":
        return "TV blanc ";
      case "P-TV_CL-BZ":
        return "TV bronze ";
      case "P-TV_CL-CF":
        return "TV canon ";
      case "P-TV_CL-LT":
        return "TV laiton ";
      case "P-TV_CL-N":
        return "TV noir ";

      case "P-CB_CL-AC":
        return "prise courant blanc acier ";
      case "P-CB_CL-BM":
        return "prise courant blanc blanc ";
      case "P-CB_CL-BZ":
        return "prise courant blanc bronze ";
      case "P-CB_CL-CF":
        return "prise courant blanc canon ";
      case "P-CB_CL-LT":
        return "prise courant blanc laiton ";
      case "P-CB_CL-N":
        return "prise courant blanc noir ";

      case "P-CN_CL-AC":
        return "prise courant noir acier ";
      case "P-CN_CL-BM":
        return "prise courant noir blanc ";
      case "P-CN_CL-BZ":
        return "prise courant noir bronze ";
      case "P-CN_CL-CF":
        return "prise courant noir canon ";
      case "P-CN_CL-LT":
        return "prise courant noir laiton ";
      case "P-CN_CL-N":
        return "prise courant noir noir ";

      // INTERRUPTEURS

      case "R-AC-VV_CL-AC":
        return "bouton poussoir rétro acier acier ";
      case "R-AC-VV_CL-BM":
        return "bouton poussoir rétro acier blanc ";
      case "R-AC-VV_CL-BZ":
        return "bouton poussoir rétro acier bronze ";
      case "R-AC-VV_CL-CF":
        return "bouton poussoir rétro acier canon ";
      case "R-AC-VV_CL-LT":
        return "bouton poussoir rétro acier laiton ";
      case "R-AC-VV_CL-N":
        return "bouton poussoir rétro acier noir ";

      case "R-BZ-VV_CL-AC":
        return "bouton poussoir rétro bronze acier ";
      case "R-BZ-VV_CL-BM":
        return "bouton poussoir rétro bronze blanc ";
      case "R-BZ-VV_CL-BZ":
        return "bouton poussoir rétro bronze bronze ";
      case "R-BZ-VV_CL-CF":
        return "bouton poussoir rétro bronze canon ";
      case "R-BZ-VV_CL-LT":
        return "bouton poussoir rétro bronze laiton ";
      case "R-BZ-VV_CL-N":
        return "bouton poussoir rétro bronze noir ";

      case "R-CF-VV_CL-AC":
        return "bouton poussoir rétro canon acier ";
      case "R-CF-VV_CL-BM":
        return "bouton poussoir rétro canon blanc ";
      case "R-CF-VV_CL-BZ":
        return "bouton poussoir rétro canon bronze ";
      case "R-CF-VV_CL-CF":
        return "bouton poussoir rétro canon canon ";
      case "R-CF-VV_CL-LT":
        return "bouton poussoir rétro canon laiton ";
      case "R-CF-VV_CL-N":
        return "bouton poussoir rétro canon noir ";

      case "R-LT-VV_CL-AC":
        return "bouton poussoir rétro laiton acier ";
      case "R-LT-VV_CL-BM":
        return "bouton poussoir rétro laiton blanc ";
      case "R-LT-VV_CL-BZ":
        return "bouton poussoir rétro laiton bronze ";
      case "R-LT-VV_CL-CF":
        return "bouton poussoir rétro laiton canon ";
      case "R-LT-VV_CL-LT":
        return "bouton poussoir rétro laiton laiton ";
      case "R-LT-VV_CL-N":
        return "bouton poussoir rétro laiton noir ";

      case "R-N-VV_CL-AC":
        return "bouton poussoir rétro noir acier ";
      case "R-N-VV_CL-BM":
        return "bouton poussoir rétro noir blanc ";
      case "R-N-VV_CL-BZ":
        return "bouton poussoir rétro noir bronze ";
      case "R-N-VV_CL-CF":
        return "bouton poussoir rétro noir canon ";
      case "R-N-VV_CL-LT":
        return "bouton poussoir rétro noir laiton ";
      case "R-N-VV_CL-N":
        return "bouton poussoir rétro noir noir ";

      default:
        return "";
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
        menu,
        setMenu,
        expanded,
        setExpanded,
        idToImageName,
      }}>
      {children}
    </ChoicesContext.Provider>
  );
}

export const useChoicesContext = () => useContext(ChoicesContext);
