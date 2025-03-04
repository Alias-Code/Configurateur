/** @jsxImportSource @emotion/react */
import Step from "../configuration/config-side/Step.jsx";
import productInformations from "../../config/productInformations.js";
import { css } from "@emotion/react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";

// --- STYLE ---
const plaqueStyle = css`
  border: 2px solid black;
  margin-right: 1.5rem;
  cursor: pointer;

  @media (max-width: 600px) {
    margin-right: 0.5rem;
  }
`;

const plaque = ({ width, height }) => css`
  ${plaqueStyle};
  width: ${width};
  height: ${height};
`;

// --- FACADES ---

export default function Facades() {
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  return (
    <Grid container>
      <Step
        name="NOS FAÇADES"
        description="Choisissez votre façade : simple, double ou triple ainsi que son orientation verticale ou horizontale."
        category="facades"
        price="60">
        {productInformations.Facades.map((item) => (
          <div
            css={plaque({
              width: isMobile ? `${item.width / 1.8}rem` : `${item.width}rem`,
              height: isMobile ? `${item.height / 1.8}rem` : `${item.height}rem`,
            })}
            key={item.id}
            id={item.id}
            name={item.name}></div>
        ))}
      </Step>
    </Grid>
  );
}
