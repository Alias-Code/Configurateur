import productInformations from "../../config/productInformations.js";
import Step from "../configuration/config-side/Step.jsx";
import { Grid } from "@mui/material";
import { useChoicesContext } from "../../context/ChoicesContext.jsx";

export default function Liseuses() {
  const { idToImageName } = useChoicesContext();

  const liseuses = productInformations.Liseuses;

  return (
    <Grid container>
      <Step
        name="NOS LISEUSES"
        description="Choisissez une liseuse parmi notre gamme, uniquement pour le premier emplacement d'une plaque."
        category="liseuses">
        {liseuses.map((item) => (
          <Grid item xs={3} sm={1.4} md={1.6} lg={1.75} xxl={2} key={item.id} id={item.id} name={item.name} draggable>
            <img src={`/mecanismes/${idToImageName(item.id)}.png`} alt={item.alt} />
          </Grid>
        ))}
      </Step>
    </Grid>
  );
}
