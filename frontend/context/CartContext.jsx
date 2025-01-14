import React, { createContext, useContext, useState } from "react";
import { useChoicesContext } from "./ChoicesContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  // --- ÉTATS ET RÉFÉRENCES ---
  const [configurations, setConfigurations] = useState(JSON.parse(localStorage.getItem("configurations")) || {});
  const { choices, setChoices, getSelectedFacadeForIndex } = useChoicesContext();
  const [showCart, setShowCart] = useState(false);

  function deleteCart() {
    setConfigurations({});
    localStorage.removeItem("configurations");
  }

  function updateQuantity(configKey, newQuantity) {
    const updatedConfigurations = { ...configurations };
    updatedConfigurations[configKey].quantity = newQuantity;
    localStorage.setItem("configurations", JSON.stringify(updatedConfigurations));
    setConfigurations(updatedConfigurations);
    setChoices(updatedConfigurations[configKey]); // Met à jour les choix
  }

  function addToCart(config) {
    const updatedConfigurations = { ...configurations };
    const lastItemKey = Object.keys(updatedConfigurations).pop();
    const lastItemNumber = parseInt(lastItemKey.replace("config", ""), 10);
    const nextItemNumber = lastItemNumber + 1;
    updatedConfigurations[`config${nextItemNumber}`] = config;
    localStorage.setItem("configurations", JSON.stringify(updatedConfigurations));
    setConfigurations(updatedConfigurations);
  }

  function removeFromCart(configKey) {
    const updatedConfigurations = { ...configurations };
    delete updatedConfigurations[configKey];
    localStorage.setItem("configurations", JSON.stringify(updatedConfigurations));
    setConfigurations(updatedConfigurations);
  }

  const emplacementIsFull = (facade) => {
    const hasCourantPrise = facade.prises.some((p) => p.id.includes("P-C"));

    if (
      (hasCourantPrise && calculateTotalItems(facade) >= 1) ||
      (!hasCourantPrise && calculateTotalItems(facade) >= 2)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const calculateTotalItems = (facade) => {
    return (
      facade.cylindres.reduce((sum, item) => sum + item.quantity, 0) +
      facade.retros.reduce((sum, item) => sum + item.quantity, 0) +
      facade.prises.reduce((sum, item) => sum + item.quantity, 0)
    );
  };

  const calculateAllTotalItems = () => {
    let totalQuantity = 0;

    choices.facades.forEach((facade) => {
      totalQuantity += facade.cylindres.reduce((sum, item) => sum + item.quantity, 0);
      totalQuantity += facade.retros.reduce((sum, item) => sum + item.quantity, 0);
      totalQuantity += facade.prises.reduce((sum, item) => sum + item.quantity, 0);
    });

    return totalQuantity;
  };

  // CALCULATE PRICE

  const calculateItemTotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  };

  const calculateConfigTotal = (config) => {
    if (!config) return 0;

    let total = config.facade?.price || 0;

    const categories = ["cylindres", "retros", "prises", "gravures"];
    categories.forEach((category) => {
      config.facades.forEach((facade) => {
        if (facade[category]) {
          total += calculateItemTotal(facade[category]);
        }
      });
    });

    return total * config.quantity;
  };

  const updateItemQuantity = (itemId, category, newQuantity) => {
    const updatedChoices = { ...choices };
    const facadeIndex = getSelectedFacadeForIndex();
    const facade = updatedChoices.facades[facadeIndex];

    if (facade[category]) {
      const itemIndex = facade[category].findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        facade[category][itemIndex].quantity = newQuantity;
        setChoices(updatedChoices);
      }
    }
  };

  const getAllItems = (config, category) => {
    // Si c'est une configuration finale ou vide, retourner un tableau vide
    if (!config || config.type === "final_cart") {
      return [];
    }

    // Si c'est une configuration avec des façades
    if (config.facades) {
      return config.facades.reduce((acc, facade) => {
        // Pour chaque item dans la catégorie, ajouter l'ID de la façade
        const itemsWithFacadeId = (facade[category] || []).map((item) => ({
          ...item,
          facadeId: facade.id,
        }));
        return acc.concat(itemsWithFacadeId);
      }, []);
    }

    return [];
  };

  //   --- RENDU ---

  return (
    <CartContext.Provider
      value={{
        configurations,
        setConfigurations,
        updateQuantity,
        addToCart,
        removeFromCart,
        calculateItemTotal,
        calculateConfigTotal,
        updateItemQuantity,
        getAllItems,
        showCart,
        setShowCart,
        deleteCart,
        calculateTotalItems,
        calculateAllTotalItems,
        emplacementIsFull,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
