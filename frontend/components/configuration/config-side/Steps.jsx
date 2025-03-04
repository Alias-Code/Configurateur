import React from "react";
import styled from "@emotion/styled";

import Couleurs from "../../steps/couleurs/Couleurs.jsx";
import Facades from "../../steps/Facades.jsx";
import Mecanismes from "../../steps/interrupteurs/Mecanismes.jsx";
import Cylindres from "../../steps/interrupteurs/Cylindres.jsx";
import Retros from "../../steps/interrupteurs/Retros.jsx";
import Prises from "../../steps/Prises/Prises.jsx";
import PrisesCourantFort from "../../steps/Prises/PrisesCourantFort.jsx";
import PrisesCourantFaible from "../../steps/Prises/PrisesCourantFaible.jsx";
import Gravures from "../../steps/Gravures.jsx";
import Socials from "./Socials.jsx";
import Variateurs from "../../steps/Variateurs.jsx";
import Liseuses from "../../steps/Liseuses.jsx";
import InvoiceViewer from "../../checkout/InvoiceViewer.jsx";

const StepsContainer = styled.div`
  width: 100%;
  padding: 0rem 1rem 2rem 1rem;
  background-color: white;
  overflow-y: auto;

  @media (max-width: 900px) {
    padding: 2rem;
    overflow-y: hidden;
    height: auto;
  }
`;

export default function Steps() {
  return (
    <StepsContainer>
      {/* <InvoiceViewer /> */}

      <Couleurs />
      <Facades />

      {/* INTERRUPTEURS */}

      <Mecanismes />
      <Cylindres />
      <Retros />
      <Variateurs />

      {/* PRISES */}

      <Prises />
      <PrisesCourantFort />
      <PrisesCourantFaible />

      {/* LISEUSES */}

      <Liseuses />

      {/* GRAVURES */}

      <Gravures />

      {/* FOOTER */}

      <Socials />
    </StepsContainer>
  );
}
