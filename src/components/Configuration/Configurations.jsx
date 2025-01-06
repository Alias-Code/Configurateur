import React from "react";
import styled from "@emotion/styled";

import Collections from "../Steps/Collections.jsx";
import Couleurs from "../Steps/Couleurs.jsx";
import Facades from "../Steps/Facades.jsx";
import Mecanismes from "../Steps/Mecanismes.jsx";
import Cylindres from "../Steps/Cylindres.jsx";
import Retros from "../Steps/Retros.jsx";
import Prises from "../Steps/Prises.jsx";
import Gravures from "../Steps/Gravures/Gravures.jsx";
import InvoiceViewer from "../Order/InvoiceViewer.jsx";
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
