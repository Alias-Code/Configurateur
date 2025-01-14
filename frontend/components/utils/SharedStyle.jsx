import styled from "@emotion/styled";

// --- MECANISME BOX ---

export const MecanismeBoxStyle = styled.div`
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  position: absolute;
  top: 125%;
  left: 30%;
  transform: translate(-50%);
  border-radius: 4px;
  background: white;
  border: 1px solid black;
  color: black;
  width: 8rem;
  text-align: center;
  transition: all 0.5s ease;

  p {
    font-weight: 700;
    letter-spacing: 2px;
    font-size: 0.5rem;
    text-transform: uppercase;
    border-bottom: 1px solid black;
    color: black;
    padding: 0.25rem 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;

    &:hover {
      color: white;
      background-color: #cfaa60;
    }

    z-index: 2;
  }

  &::before {
    content: "";
    position: absolute;
    top: -18px;
    left: 50%;
    background-color: transparent;
    transform: translateX(-50%);
    border-width: 0 18px 18px 18px;
    border-style: solid;
    width: 100%;
    border-color: transparent transparent transparent transparent;
  }
`;

// --- BUTTON ---

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.7rem;
  padding: 0.5rem 0.7rem;
  background-color: ${({ bgColor }) => bgColor || "black"};
  border: 1px solid;
  border-color: ${({ borderColor }) => borderColor || "white"};
  color: ${({ bgColor, textColor }) => (bgColor === "black" ? "white" : bgColor === "white" ? "black" : textColor)};
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  transition: color 0.5s ease;
  text-transform: capitalize;

  p {
    padding-left: ${({ noPadding }) => (noPadding ? "0rem" : "0.4rem")};
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 1px;
    transform: ${({ type }) => type === "checkout" && "translateY(1px)"};
  }

  img {
    height: 1rem;
    width: auto;
  }

  p,
  img {
    position: relative;
    padding-right: 0px !important;
    z-index: 2;
  }

  @media (max-width: 600px) {
    margin-right: 0.2rem;
    padding: 0.4rem 0.5rem;

    img {
      height: 0.8rem !important;
      width: 0.8rem !important;
    }

    p {
      font-size: 0.6rem !important;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: ${({ bgColorHover }) => bgColorHover || "white"};
    transition: width 0.5s ease;
    z-index: 1;
  }

  &:hover {
    color: ${({ textHover }) => textHover || "white"};

    &::before {
      width: 100%;
    }

    img {
      filter: ${({ type }) => (type === "icon" ? "invert(1)" : "invert(0)")};
    }
  }
`;

// --- TITRE ---

export const TitleStyle = styled.h2`
  font-weight: 100;
  letter-spacing: 4px;
  font-size: ${(props) => props.fontSize || "1.25rem"};
  text-transform: uppercase;
  color: ${(props) => props.color || "black"};
  margin-bottom: ${(props) => props.mb || "0"};

  @media (max-width: 600px) {
    font-size: 0.5rem;
  }
`;

// --- ICONS ---

export const SmallIcon = styled.img`
  width: 1.2rem;
  height: 1.2rem;
`;

// --- CHECKBOX ---

export const CheckboxStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-size: 12px;
  }

  input:hover {
    border-color: #245e24;
  }

  input {
    appearance: none;
    width: 1rem;
    height: 1rem;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &:checked {
      background-color: #245e24;
      border-color: #245e24;
    }

    &:checked::before {
      content: "✔";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.6rem;
    }
  }
`;

// --- STEP DIVIDER ---

export const StepDivider = styled.div`
  position: relative;
  text-align: center;
  margin: 2rem 0;

  hr {
    margin: 0;
    border: none;
    border-top: 1px solid white;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 1rem;
    font-weight: 500;
    font-size: 0.9rem;
    letter-spacing: 3px;
    background-color: black;
  }
`;
