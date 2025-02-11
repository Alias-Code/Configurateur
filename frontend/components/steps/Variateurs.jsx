import productInformations from "../../config/productInformations.js";
import { useChoicesContext } from "../../context/ChoicesContext.jsx";
import Step from "../configuration/config-side/Step.jsx";
import { Grid } from "@mui/material";

export default function Variateurs() {
  const { idToImageName } = useChoicesContext();

  return (
    <Grid container>
      <Step name="NOS VARIATEURS" description="" noHr={true} category="variateurs">
        {productInformations.Variateurs.map((item) => (
          <Grid
            item
            xs={3.01}
            sm={2}
            md={1.75}
            lg={1.5}
            xxl={1.25}
            key={item.id}
            id={item.id}
            name={item.name}
            draggable>
            <img src={`/mecanismes/${idToImageName(item.id)}.png`} alt={item.alt} />
          </Grid>
        ))}
      </Step>
    </Grid>
  );
}
