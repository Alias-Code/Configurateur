import { Grid } from "@mui/material";
import React, { useState } from "react";
import productInformations from "../../productInformations.js";
import Steps from "../Configuration/Steps.jsx";
import MecanismeBox from "../Configuration/MecanismeBox.jsx";

export default function Retros() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const retros = productInformations.Retros.slice(0, 6);

  // --- HANDLERS ---

  const handleMouseOver = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseOut = () => {
    setHoveredIndex(null);
  };

  // --- RENDU ---

  return (
    <Grid container>
      <Steps name="INTERRUPTEURS RETRO" description="" noHr={true} category="retros">
        {retros.map((item, index) => (
          <Grid
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseOut}
            item
            xs={3.01}
            sm={1.75}
            md={1.5}
            lg={1}
            xxl={0.75}
            key={item.id}
            id={item.id}
            name={item.name}>
            <MecanismeBox hoveredIndex={hoveredIndex} index={index} id={item.id} />
            <img src={`${item.id}.png`} alt={item.name} />
          </Grid>
        ))}
      </Steps>
    </Grid>
  );
}
