import { Grid } from "@mui/material";
import Steps from "../Configuration/Steps.jsx";
import productInformations from "../../productInformations.js";
import styled from "@emotion/styled";

const PriseParagraph = styled.p`
  padding-right: 1rem;
  font-weight: 700;
  font-size: 10px;
  text-align: center;
  margin-top: 0.25rem;
`;

export default function Prises() {
  return (
    <Grid container>
      <Steps
        name="NOS MECANISMES DE PRISES"
        description="Choisissez le type de prises parmi notre large gamme de choix."
        category="prises">
        {productInformations.Prises.map((item, index) => (
          <Grid
            item
            xs={item.name.includes("Courant") ? 4 : 3}
            sm={item.name.includes("Courant") ? 3 : 1.5}
            md={item.name.includes("Courant") ? 2 : 1.5}
            lg={item.name.includes("Courant") ? 1.6 : 1}
            xxl={item.name.includes("Courant") ? 1.6 : 0.75}
            key={item.id}
            id={item.id}
            name={item.name}>
            <img src={`${item.id}.png`} alt={item.alt} />
            <PriseParagraph>{item.name.replace("Prise ", "")}</PriseParagraph>
          </Grid>
        ))}
      </Steps>
    </Grid>
  );
}
