import React from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

const generateScrollAnimation = (calculationMiddle, isXs, upXXL) => keyframes`
    0% {
      opacity: 0;
      transform: translate(${calculationMiddle()}px, ${isXs ? "150px" : upXXL ? "350px" : "250px"});
    }
    30% {
      opacity: 1;
      transform: translate(calc(${calculationMiddle()}px - 40px), ${isXs ? "150px" : upXXL ? "350px" : "250px"});
    }
    60% {
      transform: translate(calc(${calculationMiddle()}px + 40px), ${isXs ? "150px" : upXXL ? "350px" : "250px"});
      opacity: 1;
    }
    80% {
      transform: translate(${calculationMiddle()}px, ${isXs ? "150px" : upXXL ? "350px" : "250px"});
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(${calculationMiddle()}px, ${isXs ? "150px" : upXXL ? "350px" : "250px"});
    }
`;

const Instruction = styled.img`
  position: absolute;
  top: 70%;
  left: 82%;
  width: 40px;
  height: 40px;
  pointer-events: none;
  padding: 0px !important;
  z-index: 9999999999;
  user-select: none;
  

  @media (max-width: 767px) {
    top: 90%;
  }

  ${({ animation, calculationMiddle, isXs, upXXL }) =>
    animation &&
    css`
      animation: ${generateScrollAnimation(calculationMiddle, isXs, upXXL)} 2.9s ease-in-out;
      transform: translate(${calculationMiddle()}px, ${isXs ? "150px" : upXXL ? "350px" : "250px"});
    `}
`;

export default function InstructionAnimation({ calculationMiddle, isXs, upXXL }) {
  return (
    <Instruction
      src="/hover.svg"
      alt="Icone de survol de la plaque"
      calculationMiddle={calculationMiddle}
      isXs={isXs}
      upXXL={upXXL}
      animation={true}
    />
  );
}
