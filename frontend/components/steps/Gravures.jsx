import React from "react";
import { Grid } from "@mui/material";
import { Button } from "../utils/SharedStyle.jsx";
import Step from "../configuration/config-side/Step.jsx";

export default function Gravures() {
  return (
    <Grid container >
      <Step
        name="VOTRE GRAVURE"
        description="Ajoutez jusqu'à 2 gravures (texte ou icône) par emplacement. Notez vos exigences en fin de commande."
        category="Gravures">
        {/* AJOUTER UNE GRAVURE */}
        <Grid item id="G-PS" name="Gravure">
          <Button bgColor="white" borderColor="black" bgColorHover="#cfaa60">
            <img src="/laser.svg" alt="Icone de laser" />
            <p>AJOUTER UNE GRAVURE</p>
          </Button>
        </Grid>
      </Step>
    </Grid>
  );
}
