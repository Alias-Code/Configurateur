import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../utils/SharedStyle";
import { useChoicesContext } from "../../../context/ChoicesContext";
import { useCartContext } from "../../../context/CartContext";
import { useModalContext } from "../../../context/ModalContext";

// --- STYLE ---

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const ModalContent = styled.div`
  margin-bottom: 1.5rem;
  color: black;
  font-size: 14px;

  p {
    font-size: 14px;
  }
`;

const Modal = () => {
  const { type, data, closeModal } = useModalContext();
  const { choices, setChoices, defaultChoice, setRenderImage, setSelectedFacade, resetConfig } = useChoicesContext();
  const { setConfigurations, emplacementIsFull } = useCartContext();

  useEffect(() => {
    // SUPPRESSION DIRECT POUR LA PARTIE RENDER, SANS POPUP DE CONFIRMATION

    if (data && (type === "resume" || type === "preview")) {
      // FacadeId est passé à data, permet de chercher le bon mécanisme selon la facade en question pour ne pas supprimer un mauvais

      const updatedChoices = { ...choices };
      const facadeIndex = data.facadeId - 1;
      const facade = updatedChoices.facades[facadeIndex];

      for (let category of ["cylindres", "retros", "prises", "gravures"]) {
        const index = facade[category].findIndex((item) => item.id === data.id);
        if (index !== -1) {
          // SUPPRESSION SELON LA QUANTITE

          if (data.quantity >= 2) {
            facade[category][index].quantity -= 1;
          } else {
            facade[category].splice(index, 1);
          }

          setChoices(updatedChoices);
          break;
        }
      }

      // PLACEMENT AUTOMATIQUE SUR LA FLECHE VERTE DISPONIBLE

      for (const facade of choices.facades) {
        if (!emplacementIsFull(facade)) {
          setSelectedFacade(facade.id);
          break;
        }
      }

      closeModal();
    }
  }, [type, data]);

  const handleDelete = () => {
    if (type === "cart") {
      const panier = JSON.parse(localStorage.getItem("configurations"));
      delete panier[`config${data}`];
      localStorage.setItem("configurations", JSON.stringify(panier));
      setConfigurations(JSON.stringify(panier));
    } else if (type.includes("delete_all")) {
      // DELETE ALL POUR FINAL CART ET RESUME

      if (type.includes("final_cart")) {
        setConfigurations({});
        localStorage.removeItem("configurations");
      } else if (type.includes("resume")) {
        resetConfig(type);
      }
    }

    closeModal();
  };

  // MODAL N'EST PAS RENDER POUR LE DELETE INDIVIDUEL DE MECANISME SUR RESUME ET PREVIEW

  const shouldRenderModal = type !== "resume" && type !== "preview";

  return createPortal(
    shouldRenderModal && (
      <ModalBackdrop onClick={closeModal}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <ModalTitle>Confirmer la suppression</ModalTitle>
          <ModalContent>
            {type === "cart" ? (
              <p className="config">Êtes-vous sûr de vouloir supprimer la configuration N°{data} ?</p>
            ) : type.includes("delete_all") ? (
              <p>Attention, êtes-vous sûr de vouloir supprimer toute votre configuration ?</p>
            ) : (
              ""
            )}
          </ModalContent>
          <div>
            <Button bgColor="black" borderColor="black" textHover={"black"} noPadding={true} onClick={closeModal}>
              <p>Annuler</p>
            </Button>
            <Button
              bgColor="#e74c3c"
              borderColor="#e74c3c"
              textColor="white"
              textHover={"black"}
              noPadding={true}
              onClick={handleDelete}>
              <p>Supprimer</p>
            </Button>
          </div>
        </ModalBox>
      </ModalBackdrop>
    ),
    document.body
  );
};

export default Modal;
