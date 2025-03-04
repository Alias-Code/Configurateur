import styled from "@emotion/styled";
import ResumeSummary from "../../utils/ResumeSummary";
import React, { useState, useEffect } from "react";
import { useChoicesContext } from "../../../context/ChoicesContext";
import { useCartContext } from "../../../context/CartContext";
import { TitleStyle } from "../../utils/SharedStyle";
import { useModalContext } from "../../../context/ModalContext";

// --- STYLED COMPONENTS ---
const ResumeContainer = styled.div`
  padding: ${({ type }) => (type === "resume" ? "1.5rem" : "0 0 0 1.5rem")};
  color: white;
  width: 100%;

  p {
    letter-spacing: 2px;
    font-size: 0.6rem;
  }

  hr {
    margin: 0.6rem 0;
    border: none;
    height: 0.1px;
    background: white;
    opacity: 0.8;
  }
`;

const FacadeTitle = styled.p`
  display: flex;
  gap: 0.2rem;
  font-size: 0.6rem !important;
  font-weight: 600;
  width: fit-content;
  margin: 0.3rem 0;
  position: relative;

  &::after {
    content: "";
    display: block;
    height: 0.5px;
    width: 100%;
    background-color: white;
    position: absolute;
    bottom: -1px;
    left: 0;
  }
`;

const SousTitle = styled.p`
  span {
    font-weight: 400;
    font-size: 0.5rem;
  }
`;

const CancelIcon = styled.img`
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.2rem;
  transition: all 0.5s ease;
  transform: translateY(0.5px) scale(1);
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
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

      <FacadeTitle>
        <span>{title}</span>
      </FacadeTitle>

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
            <SousTitle>- {item.name}</SousTitle>
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
  const { choices } = useChoicesContext();

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

        <FacadeTitle>Facade</FacadeTitle>

        <LineInformation>
          <SousTitle>
            {currentConfig.facade.name.split(" ")[1] || "Veuillez sélectionner une façade"} -{" "}
            {currentConfig.couleur.name
              ? `Coloris ${currentConfig.couleur.name.replace("Couleur ", "")}`
              : "Veuillez sélectionner une couleur"}
          </SousTitle>

          {currentConfig.facade.id && <p>x1 - {currentConfig.facade.price}€</p>}
        </LineInformation>

        {/* MECANISMES */}

        <DetailsSection
          title="Mécanisme(s)"
          type={type}
          items={[
            ...getAllItems(currentConfig, "cylindres"),
            ...getAllItems(currentConfig, "retros"),
            ...getAllItems(currentConfig, "variateurs"),
            ...getAllItems(currentConfig, "prises"),
            ...getAllItems(currentConfig, "liseuses"),
          ]}
        />

        {getAllItems(currentConfig, "gravures").length >= 1 && (
          <DetailsSection title="Gravure(s)" type={type} items={getAllItems(currentConfig, "gravures")} />
        )}

        {type !== "cart" && type !== "orderHistory" && <hr />}

        <ResumeSummary
          itemIndex={itemIndex || ""}
          priceHT={totalPrice / 1.2}
          quantity={currentConfig.quantity}
          type={type}
          finalPrice={type === "resume" ? true : false}
        />

        {(type === "cart" || type === "orderHistory") && <hr />}
      </ResumeContainer>
    </>
  );
}
