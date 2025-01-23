import Step from "../configuration/config-side/Step.jsx";
import productInformations from "../../config/productInformations.js";
import { Grid } from "@mui/material";

export default function Collections() {
  return (
    <Step container>
      <Steps name="" description="" category="collections" noHr={true}>
        {productInformations.Collections.map((item) => (
          <Grid item xs={8} sm={8} md={6} lg={6} xl={6} key={item.id} id={item.id} name={item.name}>
            <img src={`${item.id}.png`} alt={item.name} />
          </Grid>
        ))}
      </Steps>
    </Step>
  );
}
