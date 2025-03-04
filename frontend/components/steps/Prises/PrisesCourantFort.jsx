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

export default function PrisesCourantFort() {
  const { idToImageName } = useChoicesContext();

  const prisesCourantFort = productInformations.Prises.slice(0, 2);

  return (
    <Grid container>
      <Step name="PRISES COURANT FORT" description="" noHr={true} category="prises-courant-fort" price="40">
        {prisesCourantFort.map((item, index) => (
          <Grid
            item
            xs={3}
            sm={2.5}
            md={2}
            lg={1.6}
            xxl={1.6}
            key={item.id}
            id={item.id}
            name={item.name}
            sx={{ margin: index === 0 ? "1.5rem 2rem 0 0" : index === 1 ? "1.5rem 0 0 2rem" : "" }}
            draggable>
            <img src={`/mecanismes/${idToImageName(item.id + "_CL-N")}.png`} alt={item.alt} />
            <PriseParagraph>{item.name.replace("Prise ", "")}</PriseParagraph>
          </Grid>
        ))}
      </Step>
    </Grid>
  );
}
