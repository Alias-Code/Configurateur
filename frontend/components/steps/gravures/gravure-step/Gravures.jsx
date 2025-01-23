import { Grid } from "@mui/material";
import { Button } from "../../../Global/SharedStyle.jsx";
import { useState } from "react";
import Steps from "../../../configuration/config-side/Step.jsx";
import styled from "@emotion/styled";

// --- GRAVURES ---

export default function Gravures() {
  // const [showGravure, setShowGravure] = useState(false);

  // const toggleModal = () => setShowGravure((prev) => !prev);

  return (
    <Grid container>
      <Steps
        name="VOTRE GRAVURE"
        description="Ajoutez jusqu'à 2 gravures (texte ou icône) par emplacement. Notez vos exigences en fin de commande."
        category="gravures">
        {/* AJOUTER UNE GRAVURE */}

        <Grid item id="G-PS" name="Gravure">
          <Button bgColor="white" borderColor="black" bgColorHover="#cfaa60">
            <img src="/laser.svg" alt="Icone de laser" />
            <p>AJOUTER UNE GRAVURE</p>
          </Button>
        </Grid>

        {/* GRAVURE SETTINGS */}
        {/* {showGravure && <GravureModal onClose={toggleModal} />} */}
      </Steps>
    </Grid>
  );
}
