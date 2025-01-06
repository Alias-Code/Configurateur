import React from "react";
import styled from "styled-components";
import { TitleStyle } from "../../../Global/SharedStyle";

const GravureSettingsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const SettingButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.2rem;
  background-color: #e7e7e7;
  transition: all 0.5s ease;

  border: 1px solid black;
  border-radius: 8px;
  padding: 5px 25px;

  p {
    font-size: 13px;
    font-weight: bold;
  }

  img {
    width: 1.2rem;
    height: 1.2rem;
  }

  &:hover {
    background-color: white;
  }
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

export default function GravureSettings() {
  return (
    <>
      {/* HEADER */}

      <EmplacementTitle>
        <div className="line" />
        <TitleStyle fontSize="0.6rem">Choisissez vos paramètres</TitleStyle>
        <div className="line" />
      </EmplacementTitle>

      {/* GRAVURE SETTINGS */}

      <GravureSettingsContainer>
        <SettingButton>
          <img src="/font.svg" alt="" />
          <p>POLICE</p>
        </SettingButton>
        <SettingButton>
          <img src="/fontsize.svg" alt="" />
          <p>TAILLE</p>
        </SettingButton>
        <SettingButton>
          <img src="/alignement.svg" alt="" />
          <p>ALIGNEMENT</p>
        </SettingButton>
      </GravureSettingsContainer>
    </>
  );
}
