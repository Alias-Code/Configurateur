import html2canvas from "html2canvas";
import { useAnimationContext } from "../../context/AnimationContext";
import { useCartContext } from "../../context/CartContext";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useNotificationsContext } from "../../context/NotificationsContext";

export function useAddToCart() {
  const { setImageAnimation } = useAnimationContext();
  const { choices, resetConfig, setMenu, renderRef } = useChoicesContext();
  const { calculateAllTotalItems, calculateTotalItems } = useCartContext();
  const { setNotifications } = useNotificationsContext();

  const addToCart = (quantity, setQuantity, type, setCartSpinner) => {
    setCartSpinner(true);

    if (renderRef.current) {
      // --- VERIFICATION ET GESTION DES ERREURS ---
      
      const errorMessages = [];

      if (!choices.facade.id && !choices.facade.couleur && !calculateAllTotalItems(choices)) {
        errorMessages.push("Vous ne pouvez pas ajouter une configuration vide au panier.");
      }

      const facadeId = choices.facade.id;

      if (facadeId && !facadeId.includes("1")) {
        if (calculateAllTotalItems() === 0) {
          errorMessages.push("Vous ne pouvez pas ajouter une façade vide au panier, sauf pour la façade simple.");
        }

        const facadesToCheck = facadeId.includes("2") ? 2 : facadeId.includes("3") ? 3 : 0;

        for (let i = 0; i < facadesToCheck; i++) {
          if (calculateTotalItems(choices.facades[i]) === 0) {
            errorMessages.push("Vous ne pouvez pas ajouter une façade au panier avec un emplacement vide.");
            break; // On sort après la première erreur trouvée
          }
        }
      }

      // Si des erreurs sont trouvées
      if (errorMessages.length > 0) {
        setNotifications({
          content: errorMessages[0], // On affiche le premier message
          type: "error",
        });
        setCartSpinner(false);
        return;
      }

      // --- OPTIONS CANVA ---
      const options = {
        backgroundColor: null,
        scale: window.devicePixelRatio,
        useCORS: true,
        width: renderRef.current.offsetWidth,
        height: renderRef.current.offsetHeight,
        logging: false,
        removeContainer: true,
        allowTaint: true,
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          return element.classList.contains("no-screenshot");
        },
      };

      html2canvas(renderRef.current, options)
        .then((canvas) => {
          // --- CREATE CANVA ---
          const finalCanvas = document.createElement("canvas");
          const ctx = finalCanvas.getContext("2d");

          finalCanvas.width = renderRef.current.offsetWidth;
          finalCanvas.height = renderRef.current.offsetHeight;

          ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

          const quality = 0.8;
          const base64ImageData = finalCanvas.toDataURL("image/webp", quality);

          // --- ADD TO CART ---
          let panier = localStorage.getItem("configurations");
          panier = panier ? JSON.parse(panier) : {};

          const newItem = { quantity, ...choices, image: base64ImageData };

          if (Object.keys(panier).length === 0) {
            panier.config1 = newItem;
          } else {
            const lastItemKey = Object.keys(panier).pop();
            const lastItemNumber = parseInt(lastItemKey.replace("config", ""), 10);
            const nextItemNumber = lastItemNumber + 1;
            panier[`config${nextItemNumber}`] = newItem;
          }

          localStorage.setItem("configurations", JSON.stringify(panier));

          setNotifications({
            content: "Vous avez bien ajouté votre produit au panier !",
            type: "success",
          });

          setImageAnimation({
            src: base64ImageData,
            timestamp: Date.now(),
          });

          setCartSpinner(false);
          resetConfig(type);
          setQuantity(1);

          // FERMETURE DU MENU POUR LES MOBILES
          setMenu(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la capture du canevas :", error);
          setCartSpinner(false);
        });
    }
  };

  return addToCart;
}
