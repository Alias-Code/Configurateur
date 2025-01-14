import Steps from "../configuration/config-side/StepContainer.jsx";
import productInformations from "../../config/productInformations.js";
import { Grid } from "@mui/material";

export default function Collections() {
  return (
    <Grid container>
      <Steps name="" description="" category="collections" noHr={true}>
        {productInformations.Collections.map((item, index) => (
          <Grid item xs={8} sm={8} md={6} lg={6} xl={6} key={item.id} id={item.id} name={item.name}>
            <img src={`${item.id}.png`} alt={item.name} />
          </Grid>
        ))}
      </Steps>
    </Grid>
  );
}
