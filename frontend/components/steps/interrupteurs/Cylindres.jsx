import Steps from "../../configuration/config-side/StepContainer.jsx";
import productInformations from "../../../config/productInformations.js";
import InterrupteursBox from "./InterrupteursBox.jsx";
import React, { useState } from "react";
import { Grid } from "@mui/material";

export default function Cylindres() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cylindres = productInformations.Cylindres.slice(0, 6);

  // --- HANDLERS ---

  const handleMouseOver = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseOut = () => {
    setHoveredIndex(null);
  };

  // --- RENDER ---

  return (
    <Grid container>
      <Steps name="INTERRUPTEURS CYLINDRES" description="" noHr={true} category="cylindres">
        {cylindres.map((item, index) => (
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
            name={item.name}
            draggable>
            <img src={`${item.id}.png`} alt={item.alt} />
            <InterrupteursBox hoveredIndex={hoveredIndex} index={index} id={item.id} />
          </Grid>
        ))}
      </Steps>
    </Grid>
  );
}
