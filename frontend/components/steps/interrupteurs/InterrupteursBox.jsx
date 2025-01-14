import { MecanismeBoxStyle } from "../../utils/SharedStyle.jsx";
import { useAddChoice } from "../../utils/AddChoice.jsx";

export default function InterrupteursBox({ hoveredIndex, index, id }) {
  const addChoice = useAddChoice();

  return (
    <MecanismeBoxStyle visible={hoveredIndex === index}>
      {/* OPTION VA-ET-VIENT */}
      <p onClick={() => addChoice(id)}>Va-Et-Vient</p>

      {/* OPTION POUSSOIR */}
      <p onClick={() => addChoice(id.replace("VV", "P"))}>Poussoir</p>

      {/* OPTION VOLET-ROULANT */}
      <p onClick={() => addChoice(id.replace("VV", "VR"))}>Volet-Roulant</p>
    </MecanismeBoxStyle>
  );
}
