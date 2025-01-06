import { MecanismeBoxStyle } from "../Global/SharedStyle.jsx";
import { useAddChoice } from "./AddChoice.jsx";

export default function MecanismeBox({ hoveredIndex, index, id }) {
  const addChoice = useAddChoice();

  return (
    <MecanismeBoxStyle visible={hoveredIndex === index}>
      {/* OPTION VA-ET-VIENT */}
      <p onClick={() => addChoice(id)}>Va-Et-Vient</p>

      {/* OPTION POUSSOI  */}
      <p onClick={() => addChoice(id.replace("VV", "P"))}>Poussoir</p>

      {/* OPTION VOLET-ROULANT */}
      <p onClick={() => addChoice(id.replace("VV", "VR"))}>Volet-Roulant</p>
    </MecanismeBoxStyle>
  );
}
