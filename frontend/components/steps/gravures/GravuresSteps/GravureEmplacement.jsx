import React from "react";
import styled from "styled-components";
import { TitleStyle } from "../../../Global/SharedStyle";

const GravureEmplacementContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const EmplacementButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  transition: all 0.3s ease;
  padding: 10px 15px;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 12px;
  text-align: center;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  border: 2px solid #000;
  cursor: pointer;

  &::before {
    content: "";
    transform: scale(0.1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 255, 0, 0.2);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
  }

  img {
    width: 1.2rem;
    height: 1.2rem;
  }

  ${(props) =>
    props.selected &&
    `
    background-color: rgb(36, 94, 36, 0.8) !important;
  `}

  ${(props) => `
    ${
      props.isDisabled
        ? `
        color: #999;
        background-color: #f3f3f3;
        border: 2px solid #ccc;
        background-image: 
          linear-gradient(45deg, #e0e0e0 25%, transparent 25%), 
          linear-gradient(-45deg, #e0e0e0 25%, transparent 25%);
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
      `
        : `
        color: #000;
        background-color: #ffffff;
        border: 2px solid #000;
        cursor: pointer;
        
        ${
          !props.selected &&
          `
          &:hover {
            background-color: #f0f0f0;
          }
        `
        }
      `
    }
  `}
`;

const EmplacementTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  .line {
    flex: 1;
    height: 1px;
    background-color: #00000081;
  }
`;

export default function GravureEmplacement({ emplacements, handleToggleEmplacement }) {
  return (
    <>
      {/* HEADER */}

      <EmplacementTitle>
        <div className="line" />
        <TitleStyle fontSize="0.6rem">Configurez Vos Emplacements</TitleStyle>
        <div className="line" />
      </EmplacementTitle>

      {/* GRAVURE EMPLACEMENT */}

      <GravureEmplacementContainer>
        <EmplacementButton
          isDisabled={!emplacements.emplacement1.enable}
          selected={emplacements.selected === "emplacement1"}
          onClick={() => handleToggleEmplacement("emplacement1")}>
          <img src={emplacements.emplacement1.enable ? "/checkmark.svg" : "/block.svg"} alt="" />
          <p>EMPLACEMENT N°1</p>
        </EmplacementButton>
        <EmplacementButton
          isDisabled={!emplacements.emplacement2.enable}
          selected={emplacements.selected === "emplacement2"}
          onClick={() => handleToggleEmplacement("emplacement2")}>
          <img src={emplacements.emplacement2.enable ? "/checkmark.svg" : "/block.svg"} alt="" />
          <p>EMPLACEMENT N°2</p>
        </EmplacementButton>
      </GravureEmplacementContainer>
    </>
  );
}
