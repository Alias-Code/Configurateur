import React, { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
    onClose: null,
    onConfirm: null,
  });

  const openModal = ({ type, data, onClose, onConfirm }) => {
    setModalState({
      isOpen: true,
      type,
      data,
      onClose: onClose || closeModal,
      onConfirm,
    });
  };

  const closeModal = () => setModalState({ isOpen: false, type: null, data: null });

  return <ModalContext.Provider value={{ ...modalState, openModal, closeModal }}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => useContext(ModalContext);
