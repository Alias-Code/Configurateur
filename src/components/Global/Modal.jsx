import styled from "@emotion/styled";
import { Button } from "./SharedStyle";
import { useChoicesContext } from "../../Context/ChoicesContext";
import { useCartContext } from "../../Context/CartContext";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  z-index: 1000;
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

// --- MODAL ---

export default function Modal({ resumeItem, numberCartItem, closeModal, type }) {
  const { choices, setChoices, defaultChoice } = useChoicesContext();
  const { setConfigurations } = useCartContext();
  const [facadeId, setFacadeId] = useState("");

  useEffect(() => {
    if (type === "render") {
      setFacadeId(resumeItem.facadeId);

      // --- RENDER DELETE ---

      const updatedChoices = { ...choices };
      const facadeIndex = resumeItem.facadeId - 1;
      const facade = updatedChoices.facades[facadeIndex];

      for (let category of ["cylindres", "retros", "prises", "gravures"]) {
        const index = facade[category].findIndex((item) => item.id === resumeItem.id);
        if (index !== -1) {
          facade[category].splice(index, 1);
          setChoices(updatedChoices);
          break;
        }
      }

      closeModal();
    }
  }, [type, resumeItem]);

  const deleteItem = () => {
    if (type === "cart") {
      // --- CART DELETE ---

      let panier = JSON.parse(localStorage.getItem("configurations"));
      delete panier[`config${numberCartItem}`];
      localStorage.setItem("configurations", JSON.stringify(panier));
      setConfigurations(JSON.stringify(panier));
    } else if (type === "final_cart") {
      setConfigurations(defaultChoice);
      localStorage.removeItem("configurations");
      setNotifications({
        content: `Vous avez bien supprimé tout votre panier.`,
        type: "success",
      });
    }
    closeModal();
  };

  return createPortal(
    <ModalBackdrop>
      <ModalBox>
        <ModalTitle>Confirmer la suppression</ModalTitle>
        <ModalContent>
          {type === "render" ? (
            <p>
              Êtes-vous sûr de vouloir supprimer l'option {resumeItem.name} sur la façade N°{facadeId} ?
            </p>
          ) : type === "cart" ? (
            <p className="config">Êtes-vous sûr de vouloir supprimer la configuration N°{numberCartItem} ?</p>
          ) : type === "final_cart" ? (
            <p>Attention, êtes vous sur de vouloir supprimer tout votre panier ?</p>
          ) : (
            ""
          )}
        </ModalContent>
        <div>
          <Button bgColor={"#000000"} textHover={"black"} noPadding={true} onClick={closeModal}>
            <p>Annuler</p>
          </Button>
          <Button bgColor={"#e74c3c"} textHover={"black"} noPadding={true} onClick={deleteItem}>
            <p>Supprimer</p>
          </Button>
        </div>
      </ModalBox>
    </ModalBackdrop>,
    document.body
  );
}
