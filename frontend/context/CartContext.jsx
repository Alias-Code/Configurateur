import React, { createContext, useContext, useState } from "react";
import { useChoicesContext } from "./ChoicesContext";
import { ITEM_CATEGORYS } from "../config/config";

const CartContext = createContext();

export function CartProvider({ children }) {
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
    setChoices(updatedConfigurations[configKey]);
  }

  function addToCart(config) {
    const updatedConfigurations = { ...configurations };
    const lastItemKey = Object.keys(updatedConfigurations).pop() || "config0";
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

  const calculateTotalItems = (facade) => {
    if (!facade) return 0;
    return (
      (facade?.cylindres?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0) +
      (facade?.retros?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0) +
      (facade?.variateurs?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0) +
      (facade?.prises?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0) +
      (facade?.liseuses?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0)
    );
  };

  const emplacementIsFull = (facade) => {
    if (!facade) return false;

    const hasOneEmplacement =
      facade?.prises?.some((p) => p.id?.includes("P-C")) || facade?.variateurs?.some((v) => v.id?.includes("VA-"));

    const total = calculateTotalItems(facade);
    return hasOneEmplacement ? total >= 1 : total >= 2;
  };

  const calculateAllTotalItems = () => {
    if (!choices?.facades) return 0;
    let totalQuantity = 0;

    choices.facades.forEach((facade) => {
      totalQuantity += calculateTotalItems(facade);
    });

    return totalQuantity;
  };

  const calculateItemTotal = (items) => {
    if (!items) return 0;

    return items.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const calculateConfigTotal = (config) => {
    if (!config) return 0;

    let total = config.facade?.price || 0;

    const categories = ITEM_CATEGORYS;

    categories.forEach((category) => {
      config.facades?.forEach((facade) => {
        if (facade?.[category]) {
          total += calculateItemTotal(facade[category]);
        }
      });
    });

    return total * (config.quantity || 1);
  };

  const updateItemQuantity = (itemId, category, newQuantity) => {
    const updatedChoices = { ...choices };
    const facadeIndex = getSelectedFacadeForIndex();
    const facade = updatedChoices.facades?.[facadeIndex];

    if (facade?.[category]) {
      const itemIndex = facade[category].findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        facade[category][itemIndex].quantity = newQuantity;
        setChoices(updatedChoices);
      }
    }
  };

  const getAllItems = (config, category) => {
    if (!config || config.type === "final_cart") {
      return [];
    }

    if (config.facades) {
      return config.facades.reduce((acc, facade) => {
        const itemsWithFacadeId = (facade?.[category] || []).map((item) => ({
          ...item,
          facadeId: facade.id,
        }));
        return acc.concat(itemsWithFacadeId);
      }, []);
    }

    return [];
  };

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
