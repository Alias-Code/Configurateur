import React, { createContext, useContext, useRef, useState } from "react";
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
        variateurs: [],
        prises: [],
        liseuses: [],
        gravures: [],
      },
      {
        id: 2,
        cylindres: [],
        retros: [],
        variateurs: [],
        prises: [],
        liseuses: [],
        gravures: [],
      },
      {
        id: 3,
        cylindres: [],
        retros: [],
        variateurs: [],
        prises: [],
        liseuses: [],
        gravures: [],
      },
    ],
  };

  const mecanismeRenderPosition = useRef({
    simple: {
      neutre: {
        unemplacement: {
          1: { positionY: "49.25%", positionX: "50%" },
        },
        deuxemplacements: {
          1: { positionY: "49.25%", positionX: "45%" },
          2: { positionY: "48.75%", positionX: "54%" },
        },
      },
    },

    double: {
      horizontale: {
        unemplacement: {
          1: { positionY: "50%", positionX: "37%" },
          2: { positionY: "48.5%", positionX: "63%" },
        },
        deuxemplacements: {
          1: { positionY: "50%", positionX: "31.5%" },
          2: { positionY: "49.4%", positionX: "40.5%" },
          3: { positionY: "49%", positionX: "57.5%" },
          4: { positionY: "48.5%", positionX: "66.5%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "37%", positionX: "48.5%" },
          2: { positionY: "63%", positionX: "51.5%" },
        },
        deuxemplacements: {
          1: { positionY: "37%", positionX: "44.5%" },
          2: { positionY: "36.5%", positionX: "53.5%" },
          3: { positionY: "63%", positionX: "47.5%" },
          4: { positionY: "62.3%", positionX: "56.5%" },
        },
      },
    },

    triple: {
      horizontale: {
        unemplacement: {
          1: { positionY: "51%", positionX: "26%" },
          2: { positionY: "49.5%", positionX: "50%" },
          3: { positionY: "48%", positionX: "73.5%" },
        },
        deuxemplacements: {
          1: { positionY: "51%", positionX: "21.5%" },
          2: { positionY: "50.5%", positionX: "30.5%" },
          3: { positionY: "49.5%", positionX: "44.5%" },
          4: { positionY: "49%", positionX: "53.5%" },
          5: { positionY: "48%", positionX: "68.5%" },
          6: { positionY: "47.5%", positionX: "77.5%" },
        },
      },
      verticale: {
        unemplacement: {
          1: { positionY: "25%", positionX: "47%" },
          2: { positionY: "50%", positionX: "50.5%" },
          3: { positionY: "74%", positionX: "53.5%" },
        },
        deuxemplacements: {
          1: { positionY: "25%", positionX: "42.5%" },
          2: { positionY: "24.5%", positionX: "51.5%" },
          3: { positionY: "49.5%", positionX: "46%" },
          4: { positionY: "49%", positionX: "55%" },
          5: { positionY: "73.5%", positionX: "49.5%" },
          6: { positionY: "73%", positionX: "58.5%" },
        },
      },
    },
  });

  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [choices, setChoices] = useState(defaultChoice);
  const [choicesQuantity, setChoicesQuantity] = useState(choices.quantity);
  const [selectedFacade, setSelectedFacade] = useState(1);
  const [renderImage, setRenderImage] = useState("/plaques/plaque_vide.jpg");

  const renderRef = useRef(false);

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
        updatedChoices.quantity = 1;
        return updatedChoices;
      });
      setRenderImage(`plaques/${choices.couleur.id}.jpg`);
    }
  }

  // ID TO IMAGE NAME

  function idToImageName(id) {
    // SI C'EST UNE VARIATEUR OU LISEUSES, ILS N'ONT PAS DE CHANFREIN DIFFÉRENT, DONC RETIRER LA COULEUR DE LA PLAQUE APRES L'ID

    if (id.includes("VA") || id.includes("LI")) {
      id = id.split("_")[0];
    }

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
        return "USBC acier ";
      case "P-USBC_CL-BM":
        return "USBC blanc ";
      case "P-USBC_CL-BZ":
        return "USBC bronze ";
      case "P-USBC_CL-CF":
        return "USBC canon ";
      case "P-USBC_CL-LT":
        return "USBC laiton ";
      case "P-USBC_CL-N":
        return "USBC noir ";

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

      case "P-HP_CL-AC":
        return "HP acier ";
      case "P-HP_CL-BM":
        return "HP blanc ";
      case "P-HP_CL-BZ":
        return "HP bronze ";
      case "P-HP_CL-CF":
        return "HP canon ";
      case "P-HP_CL-LT":
        return "HP laiton ";
      case "P-HP_CL-N":
        return "HP noir ";

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
        return "prise blanche acier ";
      case "P-CB_CL-BM":
        return "prise blanche blanc ";
      case "P-CB_CL-BZ":
        return "prise blanche bronze ";
      case "P-CB_CL-CF":
        return "prise blanche canon ";
      case "P-CB_CL-LT":
        return "prise blanche laiton ";
      case "P-CB_CL-N":
        return "prise blanche noir ";

      case "P-CN_CL-AC":
        return "prise noire acier ";
      case "P-CN_CL-BM":
        return "prise noire blanc ";
      case "P-CN_CL-BZ":
        return "prise noire bronze ";
      case "P-CN_CL-CF":
        return "prise noire canon ";
      case "P-CN_CL-LT":
        return "prise noire laiton ";
      case "P-CN_CL-N":
        return "prise noire noir ";

      // INTERRUPTEURS RETROS

      // Poussoir

      case "R-AC-P_CL-AC":
        return "bouton poussoir rétro acier acier ";
      case "R-AC-P_CL-BM":
        return "bouton poussoir rétro acier blanc ";
      case "R-AC-P_CL-BZ":
        return "bouton poussoir rétro acier bronze ";
      case "R-AC-P_CL-CF":
        return "bouton poussoir rétro acier canon ";
      case "R-AC-P_CL-LT":
        return "bouton poussoir rétro acier laiton ";
      case "R-AC-P_CL-N":
        return "bouton poussoir rétro acier noir ";

      case "R-BZ-P_CL-AC":
        return "bouton poussoir rétro bronze acier ";
      case "R-BZ-P_CL-BM":
        return "bouton poussoir rétro bronze blanc ";
      case "R-BZ-P_CL-BZ":
        return "bouton poussoir rétro bronze bronze ";
      case "R-BZ-P_CL-CF":
        return "bouton poussoir rétro bronze canon ";
      case "R-BZ-P_CL-LT":
        return "bouton poussoir rétro bronze laiton ";
      case "R-BZ-P_CL-N":
        return "bouton poussoir rétro bronze noir ";

      case "R-CF-P_CL-AC":
        return "bouton poussoir rétro canon acier ";
      case "R-CF-P_CL-BM":
        return "bouton poussoir rétro canon blanc ";
      case "R-CF-P_CL-BZ":
        return "bouton poussoir rétro canon bronze ";
      case "R-CF-P_CL-CF":
        return "bouton poussoir rétro canon canon ";
      case "R-CF-P_CL-LT":
        return "bouton poussoir rétro canon laiton ";
      case "R-CF-P_CL-N":
        return "bouton poussoir rétro canon noir ";

      case "R-LT-P_CL-AC":
        return "bouton poussoir rétro laiton acier ";
      case "R-LT-P_CL-BM":
        return "bouton poussoir rétro laiton blanc ";
      case "R-LT-P_CL-BZ":
        return "bouton poussoir rétro laiton bronze ";
      case "R-LT-P_CL-CF":
        return "bouton poussoir rétro laiton canon ";
      case "R-LT-P_CL-LT":
        return "bouton poussoir rétro laiton laiton ";
      case "R-LT-P_CL-N":
        return "bouton poussoir rétro laiton noir ";

      case "R-N-P_CL-AC":
        return "bouton poussoir rétro noir acier ";
      case "R-N-P_CL-BM":
        return "bouton poussoir rétro noir blanc ";
      case "R-N-P_CL-BZ":
        return "bouton poussoir rétro noir bronze ";
      case "R-N-P_CL-CF":
        return "bouton poussoir rétro noir canon ";
      case "R-N-P_CL-LT":
        return "bouton poussoir reétro noir laiton ";
      case "R-N-P_CL-N":
        return "bouton poussoir rétro noir noir ";

      case "R-CU-P_CL-AC":
        return "bouton poussoir rétro cuivre acier ";
      case "R-CU-P_CL-BM":
        return "bouton poussoir rétro cuivre blanc ";
      case "R-CU-P_CL-BZ":
        return "bouton poussoir rétro cuivre bronze ";
      case "R-CU-P_CL-CF":
        return "bouton poussoir rétro cuivre canon ";
      case "R-CU-P_CL-LT":
        return "bouton poussoir rétro cuivre laiton ";
      case "R-CU-P_CL-N":
        return "bouton poussoir rétro cuivre noir ";

      // Poussoir & Va-Et-Vient

      case "R-AC-VV_CL-AC":
      case "R-AC-VR_CL-AC":
        return "VV rétro acier acier ";
      case "R-AC-VV_CL-BM":
      case "R-AC-VR_CL-BM":
        return "VV rétro acier blanc ";
      case "R-AC-VV_CL-BZ":
      case "R-AC-VR_CL-BZ":
        return "VV rétro acier bronze ";
      case "R-AC-VV_CL-CF":
      case "R-AC-VR_CL-CF":
        return "VV rétro acier canon ";
      case "R-AC-VV_CL-LT":
      case "R-AC-VR_CL-LT":
        return "VV rétro acier laiton ";
      case "R-AC-VV_CL-N":
      case "R-AC-VR_CL-N":
        return "VV rétro acier noir ";

      case "R-BZ-VV_CL-AC":
      case "R-BZ-VR_CL-AC":
        return "VV rétro bronze acier ";
      case "R-BZ-VV_CL-BM":
      case "R-BZ-VR_CL-BM":
        return "VV rétro bronze blanc ";
      case "R-BZ-VV_CL-BZ":
      case "R-BZ-VR_CL-BZ":
        return "VV rétro bronze bronze ";
      case "R-BZ-VV_CL-CF":
      case "R-BZ-VR_CL-CF":
        return "VV rétro bronze canon ";
      case "R-BZ-VV_CL-LT":
      case "R-BZ-VR_CL-LT":
        return "VV rétro bronze laiton ";
      case "R-BZ-VV_CL-N":
      case "R-BZ-VR_CL-N":
        return "VV rétro bronze noir ";

      case "R-CF-VV_CL-AC":
      case "R-CF-VR_CL-AC":
        return "VV rétro canon acier ";
      case "R-CF-VV_CL-BM":
      case "R-CF-VR_CL-BM":
        return "VV rétro canon blanc ";
      case "R-CF-VV_CL-BZ":
      case "R-CF-VR_CL-BZ":
        return "VV rétro canon bronze ";
      case "R-CF-VV_CL-CF":
      case "R-CF-VR_CL-CF":
        return "VV rétro canon canon ";
      case "R-CF-VV_CL-LT":
      case "R-CF-VR_CL-LT":
        return "VV rétro canon laiton ";
      case "R-CF-VV_CL-N":
      case "R-CF-VR_CL-N":
        return "VV rétro canon noir ";

      case "R-LT-VV_CL-AC":
      case "R-LT-VR_CL-AC":
        return "VV rétro laiton acier ";
      case "R-LT-VV_CL-BM":
      case "R-LT-VR_CL-BM":
        return "VV rétro laiton blanc ";
      case "R-LT-VV_CL-BZ":
      case "R-LT-VR_CL-BZ":
        return "VV rétro laiton bronze ";
      case "R-LT-VV_CL-CF":
      case "R-LT-VR_CL-CF":
        return "VV rétro laiton canon ";
      case "R-LT-VV_CL-LT":
      case "R-LT-VR_CL-LT":
        return "VV rétro laiton laiton ";
      case "R-LT-VV_CL-N":
      case "R-LT-VR_CL-N":
        return "VV rétro laiton noir ";

      case "R-N-VV_CL-AC":
      case "R-N-VR_CL-AC":
        return "VV rétro noir acier ";
      case "R-N-VV_CL-BM":
      case "R-N-VR_CL-BM":
        return "VV rétro noir blanc ";
      case "R-N-VV_CL-BZ":
      case "R-N-VR_CL-BZ":
        return "VV rétro noir bronze ";
      case "R-N-VV_CL-CF":
      case "R-N-VR_CL-CF":
        return "VV rétro noir canon ";
      case "R-N-VV_CL-LT":
      case "R-N-VR_CL-LT":
        return "VV rétro noir laiton ";
      case "R-N-VV_CL-N":
      case "R-N-VR_CL-N":
        return "VV rétro noir noir ";

      case "R-CU-VV_CL-AC":
      case "R-CU-VR_CL-AC":
        return "VV rétro cuivre acier ";
      case "R-CU-VV_CL-BM":
      case "R-CU-VR_CL-BM":
        return "VV rétro cuivre blanc ";
      case "R-CU-VV_CL-BZ":
      case "R-CU-VR_CL-BZ":
        return "VV rétro cuivre bronze ";
      case "R-CU-VV_CL-CF":
      case "R-CU-VR_CL-CF":
        return "VV rétro cuivre canon ";
      case "R-CU-VV_CL-LT":
      case "R-CU-VR_CL-LT":
        return "VV rétro cuivre laiton ";
      case "R-CU-VV_CL-N":
      case "R-CU-VR_CL-N":
        return "VV rétro cuivre noir ";

      // INTERRUPTEURS CYLINDRES

      // Poussoir & Va-Et-Vient & Volet Roulant

      case "C-AC-VV_CL-AC":
      case "C-AC-VR_CL-AC":
      case "C-AC-P_CL-AC":
        return "BP rond acier acier ";
      case "C-AC-VV_CL-BM":
      case "C-AC-VR_CL-BM":
      case "C-AC-P_CL-BM":
        return "BP rond acier blanc ";
      case "C-AC-VV_CL-BZ":
      case "C-AC-VR_CL-BZ":
      case "C-AC-P_CL-BZ":
        return "BP rond acier bronze ";
      case "C-AC-VV_CL-CF":
      case "C-AC-VR_CL-CF":
      case "C-AC-P_CL-CF":
        return "BP rond acier canon ";
      case "C-AC-VV_CL-LT":
      case "C-AC-VR_CL-LT":
      case "C-AC-P_CL-LT":
        return "BP rond acier laiton ";
      case "C-AC-VV_CL-N":
      case "C-AC-VR_CL-N":
      case "C-AC-P_CL-N":
        return "BP rond acier noir ";

      case "C-BZ-VV_CL-AC":
      case "C-BZ-VR_CL-AC":
      case "C-BZ-P_CL-AC":
        return "BP rond bronze acier ";
      case "C-BZ-VV_CL-BM":
      case "C-BZ-VR_CL-BM":
      case "C-BZ-P_CL-BM":
        return "BP rond bronze blanc ";
      case "C-BZ-VV_CL-BZ":
      case "C-BZ-VR_CL-BZ":
      case "C-BZ-P_CL-BZ":
        return "BP rond bronze bronze ";
      case "C-BZ-VV_CL-CF":
      case "C-BZ-VR_CL-CF":
      case "C-BZ-P_CL-CF":
        return "BP rond bronze canon ";
      case "C-BZ-VV_CL-LT":
      case "C-BZ-VR_CL-LT":
      case "C-BZ-P_CL-LT":
        return "BP rond bronze laiton ";
      case "C-BZ-VV_CL-N":
      case "C-BZ-VR_CL-N":
      case "C-BZ-P_CL-N":
        return "BP rond bronze noir ";

      case "C-CF-VV_CL-AC":
      case "C-CF-VR_CL-AC":
      case "C-CF-P_CL-AC":
        return "BP rond canon acier ";
      case "C-CF-VV_CL-BM":
      case "C-CF-VR_CL-BM":
      case "C-CF-P_CL-BM":
        return "BP rond canon blanc ";
      case "C-CF-VV_CL-BZ":
      case "C-CF-VR_CL-BZ":
      case "C-CF-P_CL-BZ":
        return "BP rond canon bronze ";
      case "C-CF-VV_CL-CF":
      case "C-CF-VR_CL-CF":
      case "C-CF-P_CL-CF":
        return "BP rond canon canon ";
      case "C-CF-VV_CL-LT":
      case "C-CF-VR_CL-LT":
      case "C-CF-P_CL-LT":
        return "BP rond canon laiton ";
      case "C-CF-VV_CL-N":
      case "C-CF-VR_CL-N":
      case "C-CF-P_CL-N":
        return "BP rond canon noir ";

      case "C-LT-VV_CL-AC":
      case "C-LT-VR_CL-AC":
      case "C-LT-P_CL-AC":
        return "BP rond laiton acier ";
      case "C-LT-VV_CL-BM":
      case "C-LT-VR_CL-BM":
      case "C-LT-P_CL-BM":
        return "BP rond laiton blanc ";
      case "C-LT-VV_CL-BZ":
      case "C-LT-VR_CL-BZ":
      case "C-LT-P_CL-BZ":
        return "BP rond laiton bronze ";
      case "C-LT-VV_CL-CF":
      case "C-LT-VR_CL-CF":
      case "C-LT-P_CL-CF":
        return "BP rond laiton canon ";
      case "C-LT-VV_CL-LT":
      case "C-LT-VR_CL-LT":
      case "C-LT-P_CL-LT":
        return "BP rond laiton laiton ";
      case "C-LT-VV_CL-N":
      case "C-LT-VR_CL-N":
      case "C-LT-P_CL-N":
        return "BP rond laiton noir ";

      case "C-N-VV_CL-AC":
      case "C-N-VR_CL-AC":
      case "C-N-P_CL-AC":
        return "BP rond noir acier ";
      case "C-N-VV_CL-BM":
      case "C-N-VR_CL-BM":
      case "C-N-P_CL-BM":
        return "BP rond noir blanc ";
      case "C-N-VV_CL-BZ":
      case "C-N-VR_CL-BZ":
      case "C-N-P_CL-BZ":
        return "BP rond noir bronze ";
      case "C-N-VV_CL-CF":
      case "C-N-VR_CL-CF":
      case "C-N-P_CL-CF":
        return "BP rond noir canon ";
      case "C-N-VV_CL-LT":
      case "C-N-VR_CL-LT":
      case "C-N-P_CL-LT":
        return "BP rond noir laiton ";
      case "C-N-VV_CL-N":
      case "C-N-VR_CL-N":
      case "C-N-P_CL-N":
        return "BP rond noir noir ";

      case "C-CU-VV_CL-AC":
      case "C-CU-VR_CL-AC":
      case "C-CU-P_CL-AC":
        return "BP rond cuivre acier ";
      case "C-CU-VV_CL-BM":
      case "C-CU-VR_CL-BM":
      case "C-CU-P_CL-BM":
        return "BP rond cuivre blanc ";
      case "C-CU-VV_CL-BZ":
      case "C-CU-VR_CL-BZ":
      case "C-CU-P_CL-BZ":
        return "BP rond cuivre bronze ";
      case "C-CU-VV_CL-CF":
      case "C-CU-VR_CL-CF":
      case "C-CU-P_CL-CF":
        return "BP rond cuivre canon ";
      case "C-CU-VV_CL-LT":
      case "C-CU-VR_CL-LT":
      case "C-CU-P_CL-LT":
        return "BP rond cuivre laiton ";
      case "C-CU-VV_CL-N":
      case "C-CU-VR_CL-N":
      case "C-CU-P_CL-N":
        return "BP rond cuivre noir ";

      // VARIATEURS

      case "VA-AC":
        return "variateur acier ";
      case "VA-CU":
        return "variateur cuivre ";
      case "VA-BZ":
        return "variateur bronze ";
      case "VA-CF":
        return "variateur canon ";
      case "VA-LT":
        return "variateur laiton ";
      case "VA-N":
        return "variateur noir ";

      // LISEUSES

      case "LI-AC":
        return "liseuse acier ";
      case "LI-BM":
        return "liseuse blanc ";
      case "LI-BZ":
        return "liseuse bronze ";
      case "LI-CF":
        return "liseuse canon ";
      case "LI-LT":
        return "liseuse laiton ";
      case "LI-N":
        return "liseuse noir ";

      // INTERRUPTEURS RETROS RENDU ICONE

      case "R-CU-VV_CL-AC_P":
        return "VV rétro cuivre acier P ";
      case "R-AC-VV_CL-AC_P":
        return "VV rétro acier acier P ";
      case "R-BZ-VV_CL-AC_P":
        return "VV rétro bronze acier P ";
      case "R-LT-VV_CL-AC_P":
        return "VV rétro laiton acier P ";
      case "R-N-VV_CL-AC_P":
        return "VV rétro noir acier P ";
      case "R-CF-VV_CL-AC_P":
        return "VV rétro canon acier P ";

      // INTERRUPTEURS CYLINDRES RENDU ICONE

      case "C-CU-VV_CL-AC_P":
        return "BP rond cuivre acier P ";
      case "C-AC-VV_CL-AC_P":
        return "BP rond acier acier P ";
      case "C-BZ-VV_CL-AC_P":
        return "BP rond bronze acier P ";
      case "C-LT-VV_CL-AC_P":
        return "BP rond laiton acier P ";
      case "C-N-VV_CL-AC_P":
        return "BP rond noir acier P ";
      case "C-CF-VV_CL-AC_P":
        return "BP rond canon acier P ";

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
        resetConfig,
        menu,
        setMenu,
        expanded,
        setExpanded,
        idToImageName,
        renderRef,
        choicesQuantity,
        setChoicesQuantity,
      }}>
      {children}
    </ChoicesContext.Provider>
  );
}

export const useChoicesContext = () => useContext(ChoicesContext);
