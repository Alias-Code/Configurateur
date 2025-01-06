import productInformations from "../../productInformations";
import { useNotificationsContext } from "../../Context/NotificationsContext";
import { useChoicesContext } from "../../Context/ChoicesContext";

export function useAddChoice() {
  const {
    choices,
    setChoices,
    selectedFacade,
    setSelectedFacade,
    getSelectedFacadeForIndex,
    setRenderImage,
    setMecanismeRenderPosition,
  } = useChoicesContext();

  const { setNotifications } = useNotificationsContext();

  // --- UTILS FUNCTIONS ---

  const findItemById = (category, id) => {
    return productInformations[category].find((item) => item.id === id);
  };

  const calculateTotalItems = (facade) => {
    return (
      facade.cylindres.reduce((sum, item) => sum + item.quantity, 0) +
      facade.retros.reduce((sum, item) => sum + item.quantity, 0) +
      facade.prises.reduce((sum, item) => sum + item.quantity, 0)
    );
  };

  const calculateTotalGravures = (facade) => {
    return facade.gravures.reduce((sum, item) => sum + item.quantity, 0);
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

  // --- ADD CHOICE ---

  const addChoice = (identifier) => {
    // --- CATEGORY BY IDENTIFIER ---

    const category = getCategory(identifier);

    if (!category) {
      setNotifications({ content: "Cet identifiant est invalide.", type: "error" });
      return;
    }

    // --- CHECK COLOR SELECTION ---

    if (category !== "Couleurs" && !choices.couleur.name) {
      setNotifications({
        content: "Veuillez d'abord séléctionner une couleur.",
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

      setRenderImage(`plaques/${colorItem.name.replace(/ /g, "").toLowerCase()}.png`);
      return;
    }

    // --- DEPLACEMENT AUTO DE LA FACADE ---

    const currentFacadeIndex = getSelectedFacadeForIndex();
    const currentFacade = choices.facades[currentFacadeIndex];

    const hasCourantPrise = currentFacade.prises.some((p) => p.id.includes("P-C"));
    const isCourantPrise = identifier.includes("P-C");
    const totalItems = calculateTotalItems(currentFacade);

    const emplacementisFull = () => {
      if (hasCourantPrise || totalItems) {
        return true;
      } else {
        return false;
      }
    };

    // --- HANDLE FACADE SELECTION ---

    if (category === "Facades") {
      const facadeItem = findItemById(category, identifier);

      if (choices.facade.name) {
        const isConfirmed = window.confirm(
          "[ATTENTION] En choisissant une nouvelle façade, votre configuration sera réinitialisée"
        );

        if (!isConfirmed) {
          return;
        }
      }

      if (facadeItem) {
        const facadeNumber = parseInt(identifier.split("-")[1]);
        let { width, height, ...newFacadeItem } = facadeItem;

        if (emplacementisFull() || facadeNumber === 1) {
          setSelectedFacade(facadeNumber);
        }

        setNotifications({
          content: `Vous avez sélectionné une façade ${
            facadeNumber === 1 ? "simple" : facadeNumber === 2 ? "double" : facadeNumber === 3 ? "triple" : ""
          }`,
          type: "success",
        });

        setChoices((prev) => ({
          ...prev,
          facade: newFacadeItem,
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
        }));

        setMecanismeRenderPosition((prev) => ({
          ...prev,
          prises: {
            ...prev.prises,
            images: [],
          },
        }));

        setSelectedFacade(1);

        const colorName = choices.couleur.id;
        const facadeName = facadeItem.id;

        setRenderImage(`plaques/${colorName}_${facadeName}.jpg`);
      }
      return;
    }

    if (isCourantPrise || totalItems >= 1) {
      if (
        (!choices.facade.name.includes("Simple") && selectedFacade !== 2 && choices.facade.name.includes("Double")) ||
        (!choices.facade.name.includes("Simple") && selectedFacade !== 3 && choices.facade.name.includes("Triple"))
      ) {
        setNotifications({
          content: "Votre emplacement est plein, vous avez été redirigé automatiquement vers l'emplacement suivant.",
          type: "success",
        });
      }

      if (
        (selectedFacade === 1 && choices.facade.name.includes("Double")) ||
        (selectedFacade === 1 && choices.facade.name.includes("Triple"))
      ) {
        setSelectedFacade(2);
      } else if (selectedFacade === 2 && choices.facade.name.includes("Triple")) {
        setSelectedFacade(3);
      }
    }

    // --- VERIFICATION PLACES RESTANTES & MAXIMUM ---

    const isGravure = category === "Gravures";

    const categoryKey = category.toLowerCase();
    const existingItem = currentFacade[categoryKey].find((item) => item.id === identifier);

    if ((isCourantPrise && totalItems >= 1) || (!isCourantPrise && hasCourantPrise)) {
      setNotifications({
        content: "Attention, une prise de courant prend un emplacement complet.",
        type: "error",
      });
      return;
    }

    const totalGravures = calculateTotalGravures(currentFacade);

    if (isGravure && totalGravures >= 2) {
      setNotifications({
        content: "Vous avez atteint le maximum de gravures par emplacement.",
        type: "error",
      });
      return;
    }

    if (existingItem) {
      if (existingItem.quantity >= 2 || totalItems >= 2) {
        setNotifications({
          content: `Vous avez atteint la quantité maximum de mécanisme sur l'emplacement N°${selectedFacade}.`,
          type: "error",
        });
        return;
      }
    } else {
      if (totalItems >= 2) {
        setNotifications({
          content: `Vous avez atteint la quantité maximum de mécanisme sur l'emplacement N°${selectedFacade}.`,
          type: "error",
        });
        return;
      }
    }

    // --- PLACEMENT IMAGE RENDER ---

    // if (isCourantPrise) {
    //   const imageName = `${findItemById(category, identifier).id}.svg`;

    //   setMecanismeRenderPosition((prevState) => {
    //     const updatedPrises = { ...prevState.prises };

    //     const updatedImages = [...updatedPrises.images, imageName];

    //     return {
    //       ...prevState,
    //       prises: {
    //         ...updatedPrises,
    //         images: updatedImages,
    //       },
    //     };
    //   });
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

        return { ...prev, facades: newFacades };
      });
    }
  };

  return addChoice;
}
