import styled from "@emotion/styled";
import ResumeSummary from "../../utils/ResumeSummary";
import React, { useState, useEffect } from "react";
import { useChoicesContext } from "../../../context/ChoicesContext";
import { useCartContext } from "../../../context/CartContext";
import { TitleStyle } from "../../utils/SharedStyle";
import { useModalContext } from "../../../context/ModalContext";

// --- STYLED COMPONENTS ---
const ResumeContainer = styled.div`
  padding: ${({ type }) => (type === "resume" ? "1.5rem 1.5rem 2rem 1.5rem" : "0 0 0 1.5rem")};
  color: white;
  width: 100%;

  p {
    font-weight: 100;
    letter-spacing: 2px;
    font-size: 0.6rem;
  }

  hr {
    margin: 0.6rem 0;
    border: 0.5px solid white;
  }

  .hr {
    width: 5%;
  }
`;

const FacadeTitle = styled.p`
  display: flex;
  gap: 0.2rem;
  font-size: 0.6rem;
`;

const SousTitle = styled.p`
  margin: 0.2rem 0;
  span {
    font-weight: 400;
    font-size: 0.6rem;
  }
`;

const CancelIcon = styled.img`
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.2rem;
  cursor: pointer;
`;

const LineInformation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.2rem 0;

  div {
    display: flex;
    align-items: start;
    gap: 0.2rem;
  }

  & :nth-of-type(2) {
    margin-left: auto;
  }
`;

// --- DETAILS SECTION COMPONENT ---

const DetailsSection = ({ title, items, type }) => {
  const { openModal } = useModalContext();

  return (
    <div>
      {/* CATEGORY TITLE */}

      <SousTitle>
        <span>{title} :</span> {!items || items.length === 0 ? "..." : ""}
      </SousTitle>

      {/* PRODUCT IN CATEGORY */}

      {items &&
        items.length > 0 &&
        items.map((item, index) => (
          <LineInformation key={index} render={type === "resume"}>
            {type === "resume" && (
              <CancelIcon
                src="/cancel.svg"
                alt="Icône de suppression"
                onClick={() => openModal({ type: type, data: item })}
              />
            )}
            <FacadeTitle>- {item.name}</FacadeTitle>
            <p>
              x{item.quantity} - {item.price * item.quantity}€
            </p>
          </LineInformation>
        ))}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function Resume({ type, configuration, itemIndex }) {
  const { calculateConfigTotal, getAllItems } = useCartContext();
  const { isOpen } = useModalContext();
  const { choices } = useChoicesContext();

  const [showModal, setShowModal] = useState(false);
  const [resumeItem, setResumeItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // DEPEND SI LA CONFIGURATION PROVIENT DU RESUME (DONC CHOICES DU CONTEXT) OU DU PANIER (DONC CONFIGURATION DU LOCAL STORAGE)
  const currentConfig = type === "resume" ? choices : configuration;

  // --- UPDATE PRICE ---

  useEffect(() => {
    const newTotal = calculateConfigTotal(currentConfig);
    setTotalPrice(newTotal);
  }, [currentConfig, calculateConfigTotal]);

  return (
    <>
      <ResumeContainer type={type}>
        {type === "resume" && <TitleStyle color="white">CONFIGURATION</TitleStyle>}

        <hr />

        {/* HEADER INFORMATIONS */}

        {currentConfig.couleur && (
          <LineInformation>
            <FacadeTitle>
              COULEUR : {currentConfig.couleur.name.replace("Couleur ", "") || "Veuillez séléctionner une couleur"}
            </FacadeTitle>
          </LineInformation>
        )}

        {currentConfig.facade && (
          <LineInformation>
            <FacadeTitle>
              FACADE : {currentConfig.facade.name.replace("Facade ", "") || "Veuillez séléctionner une façade"}
            </FacadeTitle>
            <FacadeTitle>{currentConfig.facade.price ? `${currentConfig.facade.price}€` : ""}</FacadeTitle>
          </LineInformation>
        )}

        {type === "history" && (
          <LineInformation>
            <FacadeTitle>QUANTITÉ : {currentConfig.quantity}</FacadeTitle>
          </LineInformation>
        )}

        <hr className="hr" />

        {/* MECANISMES */}

        <DetailsSection
          title="Interrupteur(s)"
          type={type}
          items={[
            ...getAllItems(currentConfig, "cylindres"),
            ...getAllItems(currentConfig, "retros"),
            ...getAllItems(currentConfig, "variateurs"),
          ]}
        />

        <DetailsSection title="Prise(s)" type={type} items={getAllItems(currentConfig, "prises")} />

        <DetailsSection title="Liseuse(s)" type={type} items={getAllItems(currentConfig, "liseuses")} />

        <DetailsSection title="Gravure(s)" type={type} items={getAllItems(currentConfig, "gravures")} />

        <hr />

        <ResumeSummary
          itemIndex={itemIndex || ""}
          priceHT={totalPrice / 1.2}
          quantity={currentConfig.quantity}
          type={type}
        />

        {type === "cart" && <hr />}
      </ResumeContainer>
    </>
  );
}
