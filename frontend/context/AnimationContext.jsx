import React, { createContext, useContext, useState } from "react";

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [animation, setAnimationStarted] = useState(null);
  const [orbitControls, setOrbitControls] = useState(null);
  const [checkoutAnimation, setCheckoutAnimation] = useState(null);
  const [entryAnimation, setEntryAnimation] = useState("");

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
      }}>
      {children}
    </AnimationContext.Provider>
  );
}

export const useAnimationContext = () => useContext(AnimationContext);
