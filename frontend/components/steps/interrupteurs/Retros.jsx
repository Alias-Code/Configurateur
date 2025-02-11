import productInformations from "../../../config/productInformations.js";
import Step from "../../configuration/config-side/Step.jsx";
import InterrupteursBox from "./InterrupteursBox.jsx";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useNotificationsContext } from "../../../context/NotificationsContext.jsx";
import { useChoicesContext } from "../../../context/ChoicesContext.jsx";

export default function Retros() {
  const { setNotifications } = useNotificationsContext();
  const { idToImageName } = useChoicesContext();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const retros = productInformations.Retros.slice(0, 6);

  // --- HANDLERS ---

  const handleMouseOver = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseOut = () => {
    setHoveredIndex(null);
  };

  const handleClick = (index) => {
    setHoveredIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // --- RENDU ---

  return (
    <Grid container>
      <Step name="INTERRUPTEURS RETRO" description="" noHr={true} category="retros">
        {retros.map((item, index) => (
          <Grid
            onMouseEnter={() => handleMouseOver(index)}
            onMouseLeave={handleMouseOut}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(index);
            }}
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
            <img
              onClick={() => {
                if (!window.matchMedia("(hover: none)").matches) {
                  setNotifications({
                    content: "Veuillez choisir une option de mécanisme dans le menu.",
                    type: "error",
                  });
                }
              }}
              src={`/mecanismes/${idToImageName(item.id + "_CL-N")}.png`}
              alt={item.name}
            />
            <InterrupteursBox hoveredIndex={hoveredIndex} index={index} id={item.id} />
          </Grid>
        ))}
      </Step>
    </Grid>
  );
}
