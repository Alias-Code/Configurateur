import productInformations from "../../config/productInformations";
import { useNotificationsContext } from "../../context/NotificationsContext";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useCartContext } from "../../context/CartContext";
import { MAX_GRAVURE_PER_PLAQUE } from "../../config/config";

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
      const facadeGravures = facade.gravures.reduce((gravureSum, item) => gravureSum + item.quantity, 0);
      return sum + facadeGravures;
    }, 0);
  };

  const getCategory = (id) => {
    if (id.startsWith("R-")) return "Retros";
    if (id.startsWith("CL-")) return "Couleurs";
    if (id.startsWith("C-")) return "Cylindres";
    if (id.startsWith("P-")) return "Prises";
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

    // SI ON REVIENT EN ARRIERE

    if (isPlaque && newFacadeNumber < facadeNumber) {
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
          // AVANCEMENT VIA UN AJOUT D'EMPLACEMENT, ON CHECK LA NOUVELLE FACADE NUMBER

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
        content: "Veuillez d'abord séléctionner une couleur et une façade.",
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
        setRenderImage(`plaques/${colorItem.id}.png`);
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

        setNotifications({
          content: `Vous avez sélectionné une façade ${
            newFacadeNumber === 1 ? "simple" : newFacadeNumber === 2 ? "double" : "triple"
          }`,
          type: "success",
        });

        const updatedFacades = [...choices.facades];

        if (facadeNumber === 3 && newFacadeItem.id.includes("2")) {
          updatedFacades[2] = {
            id: 3,
            cylindres: [],
            retros: [],
            prises: [],
            gravures: [],
          };
        } else if (facadeNumber === 2 && newFacadeItem.id.includes("1")) {
          updatedFacades[1] = {
            id: 2,
            cylindres: [],
            retros: [],
            prises: [],
            gravures: [],
          };
        }

        setChoices({
          ...choices,
          facade: newFacadeItem,
          facades: updatedFacades,
        });

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

    const hasCourantPrise = currentFacade.prises.some((p) => p.id.includes("P-C"));
    const isCourantPrise = identifier.includes("P-C");
    const totalItems = calculateTotalItems(currentFacade);

    const totalGravures = calculateTotalGravures(currentFacade);

    if (isGravure && totalGravures >= facadeNumber * MAX_GRAVURE_PER_PLAQUE) {
      setNotifications({
        content: "Vous avez atteint le maximum de gravures par emplacement.",
        type: "error",
      });
      return;
    }

    if (!isGravure) {
      if (existingItem) {
        if (existingItem.quantity >= 2 || totalItems >= 2) {
          setNotifications({
            content: `Vous avez atteint la quantité maximum de mécanisme sur l'emplacement N°${selectedFacade}.`,
            type: "error",
          });
          return;
        }
      }

      if ((hasCourantPrise && totalItems >= 1) || (!hasCourantPrise && totalItems >= 2)) {
        setNotifications({
          content: `Vous avez atteint la quantité maximum de mécanisme sur l'emplacement N°${selectedFacade}.`,
          type: "error",
        });
        return;
      }

      if ((isCourantPrise && totalItems >= 1) || (!isCourantPrise && hasCourantPrise)) {
        setNotifications({
          content: "Attention, une prise de courant prend un emplacement complet.",
          type: "error",
        });
        return;
      }
    }

    // --- DEPLACEMENT AUTO DE LA FACADE ---

    // const emplacementisFull = () => {
    //   if (hasCourantPrise || totalItems) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };

    // if (isCourantPrise || totalItems >= 1) {
    //   if (
    //     !choices.facade.name.includes("Simple") &&
    //     ((choices.facade.name.includes("Double") && selectedFacade !== 2) ||
    //       (choices.facade.name.includes("Triple") && selectedFacade !== 3))
    //   ) {
    //     setNotifications({
    //       content: "Votre emplacement est plein, vous avez été redirigé automatiquement vers l'emplacement suivant.",
    //       type: "success",
    //     });
    //   }

    //   if (
    //     (selectedFacade === 1 && choices.facade.name.includes("Double")) ||
    //     (selectedFacade === 1 && choices.facade.name.includes("Triple"))
    //   ) {
    //     setSelectedFacade(2);
    //   } else if (selectedFacade === 2 && choices.facade.name.includes("Triple")) {
    //     setSelectedFacade(3);
    //   }
    // }

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
