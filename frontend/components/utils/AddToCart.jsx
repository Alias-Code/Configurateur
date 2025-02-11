import html2canvas from "html2canvas";
import { useState } from "react";
import { useAnimationContext } from "../../context/AnimationContext";
import { useCartContext } from "../../context/CartContext";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useNotificationsContext } from "../../context/NotificationsContext";

export function useAddToCart() {
  const { setImageAnimation } = useAnimationContext();
  const { choices, resetConfig, setMenu, renderRef } = useChoicesContext();
  const { calculateAllTotalItems, calculateTotalItems, setNumber } = useCartContext();
  const { setNotifications } = useNotificationsContext();

  const [loading, setLoading] = useState(false);

  const addToCart = (quantity, setQuantity, type) => {
    if (renderRef.current) {
      // --- VERIFICATION EMPLACEMENT VIDE ---

      if (!choices.facade.id && !choices.facade.couleur && !calculateAllTotalItems(choices)) {
        setNotifications({ content: "Vous ne pouvez pas ajouter une configuration vide au panier.", type: "error" });
        return;
      }

      const facadeId = choices.facade.id;

      if (!facadeId.includes("1")) {
        if (calculateAllTotalItems() === 0) {
          setNotifications({
            content: "Vous ne pouvez pas ajouter une façade vide au panier, sauf pour la façade simple.",
            type: "error",
          });
          return;
        }

        const facadesToCheck = facadeId.includes("2") ? 2 : facadeId.includes("3") ? 3 : 0;

        for (let i = 0; i < facadesToCheck; i++) {
          if (calculateTotalItems(choices.facades[i]) === 0) {
            setNotifications({
              content: "Vous ne pouvez pas ajouter une façade au panier avec un emplacement vide.",
              type: "error",
            });
            return;
          }
        }
      }

      // --- DÉBUT DE LA CAPTURE ---

      setLoading(true);

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

          const quality = 0.7;
          const base64ImageData = finalCanvas.toDataURL("image/jpeg", quality);

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

          setNotifications({ content: "Vous avez bien ajouté votre produit au panier !", type: "success" });

          setImageAnimation(base64ImageData);
          setLoading(false);

          resetConfig(type);
          setQuantity(1);

          // FERMETURE DU MENU POUR LES MOBILES

          setMenu(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la capture du canevas :", error);
        });
    }
  };

  return addToCart;
}
