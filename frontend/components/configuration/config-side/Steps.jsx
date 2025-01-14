import React from "react";
import styled from "@emotion/styled";

import Collections from "../../steps/Collections.jsx";
import Couleurs from "../../steps/couleurs/Couleurs.jsx";
import Facades from "../../steps/Facades.jsx";
import Mecanismes from "../../steps/Mecanismes.jsx";
import Cylindres from "../../steps/interrupteurs/Cylindres.jsx";
import Retros from "../../steps/interrupteurs/Retros.jsx";
import Prises from "../../steps/Prises.jsx";
import Gravures from "../../steps/gravures/Gravures.jsx";
import Socials from "./Socials.jsx";

const ConfigurationSideContainer = styled.div`
  width: 100%;
  padding: 0rem 1rem 2rem 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;

  @media (max-width: 900px) {
    padding: 2rem;
  }
`;

export default function Configuration() {
  return (
    <ConfigurationSideContainer>
      {/* <InvoiceViewer /> */}
      {/* <Collections /> */}
      <Couleurs />
      <Facades />
      <Mecanismes />
      <Cylindres />
      <Retros />
      <Prises />
      <Gravures />
      <Socials />
    </ConfigurationSideContainer>
  );
}
