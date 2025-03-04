import { create } from "zustand";

// Store unique pour tous les contextes
export const useStore = create((set) => ({
  // Animations (AnimationContext)
  animations: {
    animation: null,
    checkoutAnimation: null,
    imageAnimation: false,
    activeTab: 0,
    entryAnimation: "",
  },
  setAnimations: (updates) =>
    set((state) => ({
      animations: { ...state.animations, ...updates },
    })),

  // Auth (AuthContext)
  isAuthenticated: false,
  userToken: null,
  skipHome: false,
  login: (token) => {
    localStorage.setItem("token", token);
    set({ userToken: token, isAuthenticated: true });
    // Accès à setEntryAnimation via le store (simulé ici)
    set((state) => ({
      animations: { ...state.animations, entryAnimation: "login_/configuration" },
    }));
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, userToken: null });
  },
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUserToken: (value) => set({ userToken: value }),
  setSkipHome: (value) => set({ skipHome: value }),

  // Ajoute ici Cart, Choices, Notifications, Modal, Model...
}));

// Fonction utilitaire pour accéder aux parties spécifiques (optionnel)
export const useAuthStore = () => {
  const authPart = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userToken: state.userToken,
    skipHome: state.skipHome,
    login: state.login,
    logout: state.logout,
    setIsAuthenticated: state.setIsAuthenticated,
    setUserToken: state.setUserToken,
    setSkipHome: state.setSkipHome,
  }));
  return authPart;
};

export const useAnimationStore = () => {
  const animationPart = useStore((state) => ({
    animations: state.animations,
    setAnimations: state.setAnimations,
    // Autres fonctions d'animation si besoin
  }));
  return animationPart;
};
