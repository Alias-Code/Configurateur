import productInformations from "../../config/productInformations";
import { useNotificationsContext } from "../../context/NotificationsContext";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useCartContext } from "../../context/CartContext";
import { MAX_GRAVURE_PER_PLAQUE, ITEM_CATEGORYS } from "../../config/config";

export function useAddChoice() {
  const { choices, setChoices, selectedFacade, setSelectedFacade, getSelectedFacadeForIndex, setRenderImage } =
    useChoicesContext();

  const { setNotifications } = useNotificationsContext();
  const { calculateTotalItems, emplacementIsFull } = useCartContext();

  // --- UTILS FUNCTIONS ---

  const findItemById = (category, id) => {
    return productInformations[category].find((item) => item.id === id);
  };

  const calculateTotalGravures = () => {
    return choices.facades.reduce((sum, facade) => {
      if (!facade.gravures) return sum;
      const facadeGravures = facade.gravures.reduce((gravureSum, item) => gravureSum + item.quantity, 0);
      return sum + facadeGravures;
    }, 0);
  };

  const getCategory = (id) => {
    if (id.startsWith("R-")) return "Retros";
    if (id.startsWith("CL-")) return "Couleurs";
    if (id.startsWith("C-")) return "Cylindres";
    if (id.startsWith("VA-")) return "Variateurs";
    if (id.startsWith("P-")) return "Prises";
    if (id.startsWith("LI-")) return "Liseuses";
    if (id.startsWith("G-")) return "Gravures";
    if (
      id.startsWith("N-") ||
      id.startsWith("DH-") ||
      id.startsWith("DV-") ||
      id.startsWith("TH-") ||
      id.startsWith("TV-")
    )
      return "Facades";
    return null;
  };

  const switchOnEmptyEmplacement = (newFacadeNumber, identifier) => {
    const facadeNumber = parseInt(choices.facade.id.slice("-1"));
    const isPlaque = getCategory(identifier) === "Facades";

    // SI ON REVIENT EN ARRIERE DANS UN EMPLACEMENT DE PLAQUE

    if (isPlaque && newFacadeNumber < facadeNumber && emplacementIsFull(choices.facades[newFacadeNumber - 1])) {
      setSelectedFacade(newFacadeNumber);
      return;
    }

    // SI ON AVANCE

    for (const facade of choices.facades) {
      if (!emplacementIsFull(facade)) {
        if (!isPlaque && facade.id <= facadeNumber) {
          // AVANCEMENT VIA UN AJOUT DE MECANISME : ON CHECK LA FACADE NUMBER ACTUELLE

          setSelectedFacade(facade.id);
        } else if (isPlaque && facade.id <= newFacadeNumber) {
          // AVANCEMENT VIA UNE AUGMENTATION DE FACADE, ON CHECK LA NOUVELLE FACADE NUMBER

          setSelectedFacade(facade.id);
        }
        break;
      }
    }
  };

  // --- ADD CHOICE ---

  const addChoice = (identifier, type, dropZoneNumber) => {
    // --- CATEGORY BY IDENTIFIER ---

    const category = getCategory(identifier);

    if (!category) {
      setNotifications({ content: "Cet identifiant est invalide.", type: "error" });
      return;
    }

    // --- CHECK COLOR SELECTION ---

    if (category !== "Couleurs" && !choices.couleur.name) {
      setNotifications({
        content: "Veuillez d'abord séléctionner une couleur puis une façade.",
        type: "error",
      });
      return;
    }

    if (category !== "Couleurs" && category !== "Facades" && !choices.facade.name) {
      setNotifications({
        content: "Veuillez d'abord séléctionner une façade.",
        type: "error",
      });
      return;
    }

    // --- HANDLE COLOR SELECTION ---

    if (category === "Couleurs") {
      const colorItem = findItemById(category, identifier);

      if (colorItem) {
        setChoices((prev) => ({
          ...prev,
          couleur: colorItem,
        }));
      }

      const plaqueExiste = choices.facade.id;

      if (plaqueExiste) {
        setRenderImage(`plaques/${colorItem.id}_${choices.facade.id}.jpg`);
      } else {
        setRenderImage(`plaques/${colorItem.id}.jpg`);
      }
      return;
    }

    // --- HANDLE FACADE SELECTION ---

    const facadeNumber = parseInt(choices.facade.id.slice("-1"));

    const handleFacadeSelection = async () => {
      const facadeItem = findItemById(category, identifier);

      if (facadeItem) {
        const newFacadeNumber = parseInt(identifier.slice("-1"));
        const { width, height, ...newFacadeItem } = facadeItem;

        // setNotifications({
        //   content: `Vous avez sélectionné une façade ${
        //     newFacadeNumber === 1 ? "simple" : newFacadeNumber === 2 ? "double" : "triple"
        //   }`,
        //   type: "success",
        // });

        const updatedFacades = [...choices.facades];

        const createEmptyFacade = (facadeId) => {
          const facade = { id: facadeId };
          ITEM_CATEGORYS.forEach((category) => {
            facade[category] = [];
          });
          return facade;
        };

        // SUPPRESSION DES MECANISMES LORSQU'ON PASSE A UNE FACADE PLUS BASSE

        if (facadeNumber === 3 && newFacadeItem.id.includes("2")) {
          updatedFacades[2] = createEmptyFacade(3);
        } else if (facadeNumber === 2 && newFacadeItem.id.includes("1")) {
          updatedFacades[1] = createEmptyFacade(2);
        } else if (facadeNumber === 3 && newFacadeItem.id.includes("1")) {
          updatedFacades[2] = createEmptyFacade(3);
          updatedFacades[1] = createEmptyFacade(2);
        }

        setChoices({
          ...choices,
          facade: newFacadeItem,
          facades: updatedFacades,
        });

        // REMPLACEMENT DE L'IMAGE ET SWITCH SUR LA PLAQUE VIDE

        const colorName = choices.couleur.id;
        const facadeName = facadeItem.id;

        setRenderImage(`plaques/${colorName}_${facadeName}.jpg`);
        switchOnEmptyEmplacement(newFacadeNumber, identifier);
      }
    };

    if (category === "Facades") {
      handleFacadeSelection();
      return;
    }

    // --- VERIFICATION PLACES RESTANTES & MAXIMUM ---

    const categoryKey = category.toLowerCase();
    const currentFacadeIndex = getSelectedFacadeForIndex(type, dropZoneNumber);
    const currentFacade = choices.facades[currentFacadeIndex];
    const existingItem = currentFacade[categoryKey].find((item) => item.id === identifier);
    const isGravure = category === "Gravures";
    const totalItems = calculateTotalItems(currentFacade);

    // STOCKAGE DE TOUT LES MECANISMES QUI PRENNENT UNE PLACE

    const hasOneEmplacementItem =
      currentFacade.prises.some((p) => p.id.includes("P-C")) ||
      currentFacade.variateurs.some((v) => v.id.includes("VA-")) ||
      currentFacade.liseuses.some((l) => l.id.includes("LI-"));
    const isOneEmplacement = identifier.includes("P-C") || identifier.includes("VA-") || identifier.includes("LI-");

    // --- VERIFICATION LISEUSES ---

    if (category === "Liseuses" && selectedFacade !== 1) {
      setNotifications({
        content: "Vous ne pouvez mettre de liseuse qu'au premier emplacement.",
        type: "error",
      });
      return;
    }

    // --- VERIFICATIONS GRAVURES ---

    const totalGravures = calculateTotalGravures(currentFacade);

    if (isGravure && totalGravures >= facadeNumber * MAX_GRAVURE_PER_PLAQUE) {
      setNotifications({
        content: "Vous avez atteint le maximum de gravures.",
        type: "error",
      });
      return;
    } else if (isGravure && totalGravures < facadeNumber * MAX_GRAVURE_PER_PLAQUE) {
      setNotifications({
        content: "Vous avez bien ajouté une gravure.",
        type: "success",
      });
    }

    if (!isGravure) {
      // --- BLOCAGE DE QUANTITÉ ---

      if (existingItem) {
        if (existingItem.quantity >= 2 || totalItems >= 2) {
          setNotifications({
            content: `Vous avez atteint la quantité maximum de mécanisme sur l'emplacement N°${selectedFacade}.`,
            type: "error",
          });
          return;
        }
      }

      if ((hasOneEmplacementItem && totalItems >= 1) || (!hasOneEmplacementItem && totalItems >= 2)) {
        setNotifications({
          content: `Vous avez atteint la quantité maximum de mécanisme sur l'emplacement N°${selectedFacade}.`,
          type: "error",
        });
        return;
      }

      if ((isOneEmplacement && totalItems >= 1) || (!isOneEmplacement && hasOneEmplacementItem)) {
        setNotifications({
          content: "Attention, vous avez déjà un emplacement complet de remplis",
          type: "error",
        });
        return;
      }

      // --- BLOCAGE COMBINAISON IMPOSSIBLE ---

      const hasPrise = currentFacade.prises.some((p) => p.id.includes("P-"));
      const hasInterrupteurs =
        currentFacade.cylindres.some((c) => c.id.includes("C-")) ||
        currentFacade.retros.some((r) => r.id.includes("R-"));

      if (
        (category === "Prises" && hasInterrupteurs) ||
        ((category === "Cylindres" || category === "Retros") && hasPrise)
      ) {
        setNotifications({
          content:
            "Combinaison impossible, vous ne pouvez pas mettre un mécanisme de courant faible à côté d'un courant fort.",
          type: "error",
        });
        return;
      }
    }

    // --- ADD OR UPDATE ITEM IN CHOICES ---

    const item = findItemById(category, identifier);

    if (item) {
      setChoices((prev) => {
        const newFacades = [...prev.facades];
        const categoryKey = category.toLowerCase();
        const currentFacadeItems = newFacades[currentFacadeIndex][categoryKey];

        const existingItemIndex = currentFacadeItems.findIndex((i) => i.id === identifier);

        if (existingItemIndex !== -1) {
          currentFacadeItems[existingItemIndex] = {
            ...currentFacadeItems[existingItemIndex],
            quantity: currentFacadeItems[existingItemIndex].quantity + 1,
          };
        } else {
          currentFacadeItems.push({ ...item, quantity: 1 });
        }

        newFacades[currentFacadeIndex] = {
          ...newFacades[currentFacadeIndex],
          [categoryKey]: currentFacadeItems,
        };

        switchOnEmptyEmplacement(null, identifier);

        return { ...prev, facades: newFacades };
      });
    }
  };

  return addChoice;
}
