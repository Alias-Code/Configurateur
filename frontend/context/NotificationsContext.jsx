import React, { createContext, useContext, useState } from "react";

// --- CONTEXT ---

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const [notifications, setNotifications] = useState({ content: [], type: "" });

  // --- RENDU ---

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

// --- EXPORT ---

export const useNotificationsContext = () => useContext(NotificationsContext);
