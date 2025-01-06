import React from "react";
import styled from "styled-components";
import { TitleStyle } from "../../../Global/SharedStyle";

const EmplacementTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;

  .line {
    flex: 1;
    height: 1px;
    background-color: #00000081;
  }
`;

export default function GravureSettingsSelection() {
  return (
    <EmplacementTitle>
      <div className="line" />
      <TitleStyle fontSize="0.6rem">Ajustez le paramètre choisis</TitleStyle>
      <div className="line" />
    </EmplacementTitle>
  );
}
