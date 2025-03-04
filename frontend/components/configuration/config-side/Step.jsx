import React from "react";
import styled from "@emotion/styled";
import { useAddChoice } from "../../utils/AddChoice.jsx";
import { TitleStyle } from "../../utils/SharedStyle.jsx";

// --- STYLE ---

const StyledParagraph = styled.p`
  font-weight: 600;
  font-size: 0.75rem;

  @media (max-width: 600px) {
    font-size: ${({ fsMobile }) => fsMobile && "0.3rem"};
  }
`;

// const PriceParagraph = styled.p`
//   font-weight: 300;
//   font-size: 0.5rem;
//   text-transform: uppercase;
//   letter-spacing: 2px;
//   margin-top: 0.4rem;

//   @media (max-width: 600px) {
//     font-size: ${({ fsMobile }) => fsMobile && "0.3rem"};
//   }
// `;

const StepContainer = styled.div`
  padding: 1.5rem 0;
  text-align: ${({ category }) => (category === "navbar" ? "left" : "center")};
  width: 100%;

  hr {
    width: 85%;
    border: 0.5px solid black;
    opacity: 0.7;
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
  padding-top: ${({ $category }) =>
    $category === "liseuses" || $category === "facades" || $category === "couleurs" || $category === "Gravures"
      ? "2rem"
      : "0rem"};

  transform: ${({ $category }) => ($category === "couleurs" ? "translateX(8%)" : "none")};

  img,
  svg {
    cursor: pointer;
    padding-right: ${({ $category }) =>
      $category === "variateurs" || $category === "retros" || $category === "cylindres" || $category.includes("prises")
        ? "0px"
        : "1rem"};
  }

  .animation {
    transition: transform 0.5s ease, scale 0.5s ease;
  }

  .animation:hover {
    transform: translateY(-15px) scale(1.15);
  }

  @media (max-width: 768px) {
    transform: ${({ $category }) => ($category === "couleurs" ? "translateX(2%)" : "none")};
  }
`;

// --- STEP ---

export default function Step({ name, description, children, noHr, category, price }) {
  const addChoice = useAddChoice();

  return (
    <StepContainer category={category} noHr={noHr}>
      <TitleStyle>{name}</TitleStyle>
      {!noHr && <hr />}
      <StyledParagraph>{description}</StyledParagraph>
      {/* {price && <PriceParagraph>À partir de 50 €</PriceParagraph>} */}
      <ImageContainer $category={category}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          const name = child.props.name || "";

          // ENFANT AVEC BESOIN DE DRAG & DROP

          // if (child.props.draggable) {
          //   const childrenArray = React.Children.toArray(child.props.children);

          //   // Modifions uniquement l'image, en laissant le reste inchangé

          //   const modifiedChildren = childrenArray.map((grandChild) => {
          //     if (grandChild.type === "img") {
          //       const { attributes, listeners, setNodeRef } = useDraggable({
          //         id: `${grandChild.props.src}`,
          //         data: { id: child.props.id, name: child.props.name },
          //       });

          //       return React.cloneElement(grandChild, {
          //         ...listeners,
          //         ...attributes,
          //         ref: setNodeRef,
          //         style: { cursor: "grab" },
          //       });
          //     }
          //     return grandChild;
          //   });

          //   // RENDRE LA GRID AVEC L'IMG DRAGGABLE

          //   return React.cloneElement(child, {
          //     ...child.props,
          //     onClick: (e) => {
          //       e.preventDefault();
          //       if (name === "Vendome") return;
          //       addChoice(child.props.id, "click", null);
          //     },
          //     className: name.includes("Couleur") || name === "Gravure" ? "" : "animation",
          //     children: modifiedChildren,
          //   });
          // }

          // ENFANT SANS BESOIN DE DRAG & DROP

          return React.cloneElement(child, {
            onClick: (e) =>
              name.includes("Rétro") || name.includes("Cylindre")
                ? child.props.onClick(e)
                : addChoice(child.props.id, "click", null),
            className: name.includes("Couleur") || name === "Gravure" ? "" : "animation",
          });
        })}
      </ImageContainer>
    </StepContainer>
  );
}
