import productInformations from "../../../config/productInformations.js";
import styled from "@emotion/styled";
import Step from "../../configuration/config-side/Step.jsx";
import { Grid } from "@mui/material";
import { useChoicesContext } from "../../../context/ChoicesContext.jsx";

const PriseParagraph = styled.p`
  font-weight: 700;
  font-size: 10px;
  text-align: center;
  margin-top: 0.25rem;
  transform: translateY(-10px);

  @media (max-width: 600px) {
    font-size: 6px;
  }
`;

export default function PrisesCourantFaible() {
  const { idToImageName } = useChoicesContext();

  const prisesCourantFaible = productInformations.Prises.slice(2, 8);

  return (
    <Grid container>
      <Step name="PRISES COURANT FAIBLE" description="" noHr={true} category="prises-courant-faible">
        {prisesCourantFaible.map((item) => (
          <Grid item xs={3} sm={1.5} md={1.5} lg={1.5} xxl={1.5} key={item.id} id={item.id} name={item.name} draggable>
            <img src={`/mecanismes/${idToImageName(item.id + "_CL-N")}.png`} alt={item.alt} />
            <PriseParagraph>{item.name.replace("Prise ", "")}</PriseParagraph>
          </Grid>
        ))}
      </Step>
    </Grid>
  );
}
