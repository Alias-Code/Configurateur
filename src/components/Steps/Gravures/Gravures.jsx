import { Grid } from "@mui/material";
import Steps from "../../Configuration/Steps.jsx";
import styled from "@emotion/styled";
import { useState } from "react";

// --- STYLE ---

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0.5rem 0.9rem;
  width: fit-content;
  background: white;
  color: black;
  border-radius: 10px;
  border: 1px solid black;
  overflow: hidden;
  transition: color 0.5s ease;
  margin-bottom: 1rem;

  p {
    padding-left: 0.2rem;
    padding-top: 0.1rem;
    font-weight: 700;
    font-size: 0.7rem;
    text-transform: uppercase;
    position: relative;
    z-index: 1;
  }

  img {
    width: 1.6rem;
    height: 1.6rem;
    padding: 0;
    position: relative;
    transform: translateY(2px);
  }
`;

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
          <Button>
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
