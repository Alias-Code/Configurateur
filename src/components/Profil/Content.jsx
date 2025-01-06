import styled from "styled-components";
import { Routes, Route, Navigate } from "react-router-dom";
import TableauDeBord from "./Sections/TableauDeBord";
import Commandes from "./Sections/Orders/Orders";
import Devis from "./Sections/Invoices";
import DetailsDuCompte from "./Sections/DetailsDuCompte";
import Adresses from "./Sections/Adresses/Address";

const ContentContainer = styled.div`
  border: 1px solid black;
  height: 100%;
  width: 100%;
  padding: 2rem;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow-y: auto;
`;

export default function Content() {
  return (
    <ContentContainer>
      <Routes>
        {/* TABLEAU DE BORD */}
        <Route path="/" element={<Navigate to="tableau-de-bord" replace />} />

        {/* NAVIGATION */}
        <Route path="tableau-de-bord" element={<TableauDeBord />} />
        <Route path="commandes" element={<Commandes />} />
        <Route path="devis" element={<Devis />} />
        <Route path="details-du-compte" element={<DetailsDuCompte />} />
        <Route path="adresses" element={<Adresses />} />

        {/* REDIRECTION INCONNU */}
        <Route path="*" element={<Navigate to="tableau-de-bord" replace />} />
      </Routes>
    </ContentContainer>
  );
}
