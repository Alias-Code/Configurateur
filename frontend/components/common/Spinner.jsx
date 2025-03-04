import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const spinAndPause = keyframes`
  0% { transform: rotate(0deg); }
  40% { transform: rotate(360deg); }
  50% { transform: rotate(360deg); }
  90% { transform: rotate(720deg); }
  100% { transform: rotate(720deg); }
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
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 99999999;
  transition: all 0.5s ease;
`;

const SpinnerCircle = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 4px solid rgba(0, 0, 0, 0.5);
  border-top-color: #cfaa60;
  border-radius: 50%;
  animation: ${spinAndPause} 2.5s infinite ease-in-out;
`;

export default function Spinner() {
  return (
    <SpinnerContainer>
      <SpinnerCircle />
    </SpinnerContainer>
  );
}
