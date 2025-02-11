import React, { createContext, useContext, useRef, useState } from "react";

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [animation, setAnimationStarted] = useState(null);
  const [orbitControls, setOrbitControls] = useState(null);
  const [checkoutAnimation, setCheckoutAnimation] = useState(null);
  const [imageAnimation, setImageAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [entryAnimation, setEntryAnimation] = useState("");

  const cartImageAnimation = useRef(false);

  return (
    <AnimationContext.Provider
      value={{
        animation,
        setAnimationStarted,
        orbitControls,
        setOrbitControls,
        entryAnimation,
        setEntryAnimation,
        checkoutAnimation,
        setCheckoutAnimation,
        cartImageAnimation,
        imageAnimation,
        setImageAnimation,
        activeTab,
        setActiveTab,
      }}>
      {children}
    </AnimationContext.Provider>
  );
}

export const useAnimationContext = () => useContext(AnimationContext);
