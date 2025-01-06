import React from "react";
import styled from "@emotion/styled";
import { useAddChoice } from "./AddChoice.jsx";
import { TitleStyle } from "../Global/SharedStyle.jsx";

// --- STYLE ---

const StyledP = styled.p`
  font-weight: 600;
  font-size: 0.75rem;

  @media (max-width: 600px) {
    font-size: ${({ fsMobile }) => fsMobile && "0.3rem"};
  }
`;

const StepContainer = styled.div`
  padding: ${({ category }) =>
    category === "collections"
      ? "0 0 1rem 0"
      : category === "retros" || category === "cylindres"
      ? "0rem 0 1.5rem 0"
      : "3rem 0 0 0"};
  text-align: ${({ category }) => (category === "navbar" ? "left" : "center")};
  width: 100%;

  hr {
    width: 85%;
    border: 0.5px solid black;
    opacity: 0.3;
    margin: 0.5rem auto;
  }

  @media (max-width: 900px) {
    hr {
      width: 95%;
    }
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 2rem;

  img,
  svg {
    cursor: pointer;
    padding: 0 1rem 0 0;
  }

  .animation {
    transition: transform 0.5s ease, scale 0.5s ease;
  }

  .animation:hover {
    transform: translateY(-15px) scale(1.15);
  }
`;

// --- STEPS ---

export default function Steps({ name, description, children, noHr, category }) {
  const addChoice = useAddChoice();

  return (
    <StepContainer category={category}>
      <TitleStyle>{name}</TitleStyle>
      {!noHr && <hr />}
      <StyledP>{description}</StyledP>
      <ImageContainer>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          const name = child.props.name || "";

          // --- LOAD CHILDREN WITH ADD CHOICE ---

          return React.cloneElement(child, {
            onClick: () =>
              name.includes("Rétro") || name.includes("Cylindre") || name === "Vendome"
                ? null
                : addChoice(child.props.id),
            className: name.includes("Couleur") || name === "Vendome" ? "" : "animation",
          });
        })}
      </ImageContainer>
    </StepContainer>
  );
}
