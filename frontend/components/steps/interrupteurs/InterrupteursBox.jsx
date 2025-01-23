import { MecanismeBoxStyle } from "../../utils/SharedStyle.jsx";
import { useAddChoice } from "../../utils/AddChoice.jsx";

export default function InterrupteursBox({ hoveredIndex, index, id }) {
  const addChoice = useAddChoice();

  return (
    <MecanismeBoxStyle
      visible={hoveredIndex === index}
      onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic
    >
      <p onClick={() => addChoice(id, "click")}>Va-Et-Vient</p>
      <p onClick={() => addChoice(id.replace("VV", "P"), "click")}>Poussoir</p>
      <p onClick={() => addChoice(id.replace("VV", "VR"), "click")}>Volet-Roulant</p>
    </MecanismeBoxStyle>
  );
}
