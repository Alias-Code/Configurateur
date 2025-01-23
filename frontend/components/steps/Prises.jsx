import productInformations from "../../config/productInformations.js";
import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import Step from "../configuration/config-side/Step.jsx";

const PriseParagraph = styled.p`
  padding-right: 1rem;
  font-weight: 700;
  font-size: 10px;
  text-align: center;
  margin-top: 0.25rem;

  @media (max-width: 600px) {
    font-size: 5px;
  }
`;

export default function Prises() {
  return (
    <Grid container>
      <Step
        name="NOS MECANISMES DE PRISES"
        description="Choisissez le type de prises parmi notre large gamme de choix."
        category="prises">
        {productInformations.Prises.map((item) => (
          <Grid
            item
            xs={item.name.includes("Courant") ? 4 : 3}
            sm={item.name.includes("Courant") ? 3 : 1.5}
            md={item.name.includes("Courant") ? 2 : 1.5}
            lg={item.name.includes("Courant") ? 1.6 : 1}
            xxl={item.name.includes("Courant") ? 1.6 : 0.75}
            key={item.id}
            id={item.id}
            name={item.name}
            draggable>
            <img src={`${item.id}.png`} alt={item.alt} />
            <PriseParagraph>{item.name.replace("Prise ", "")}</PriseParagraph>
          </Grid>
        ))}
      </Step>
    </Grid>
  );
}
