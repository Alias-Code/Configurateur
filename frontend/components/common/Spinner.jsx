import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const blurFadeIn = keyframes`
  0% {
    backdrop-filter: blur(0px);
    background-color: rgba(255, 255, 255, 0);
  }
  100% {
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 99999999;
  transition: all 0.5s ease;
  animation: ${blurFadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  .spinner {
    border: 4px solid rgba(255, 255, 255, 1);
    border-top: 4px solid #cfaa60;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    animation: ${spin} 1.5s ease-in-out infinite;
  }
`;

export default function Spinner() {
  return (
    <SpinnerContainer>
      <div className="spinner"></div>
    </SpinnerContainer>
  );
}
