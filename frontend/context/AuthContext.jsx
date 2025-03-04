import React, { createContext, useContext, useState } from "react";
import { useAnimationContext } from "./AnimationContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // --- ÉTATS ET RÉFÉRENCES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(false);
  const [skipHome, setSkipHome] = useState(false);
  const { setEntryAnimation } = useAnimationContext();

  //   --- UTILS FUNCTIONS ---

  function login(token) {
    localStorage.setItem("token", token);
    setUserToken(token);

    if (window.location.pathname !== "/configuration") {
      setEntryAnimation("login_/configuration");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserToken(null);
  }

  //   --- AUTH CONTEXT ---

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userToken,
        login,
        logout,
        skipHome,
        setSkipHome,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
