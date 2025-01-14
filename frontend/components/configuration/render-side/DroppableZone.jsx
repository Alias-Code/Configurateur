import { useDroppable } from "@dnd-kit/core";
import styled from "@emotion/styled";

const DropZone = styled.div`
  width: 12rem;
  height: 12rem;
  position: absolute;
  transform: translate(-50%, -50%) rotate(-6deg);
  top: ${({ positiony }) => `${positiony}`};
  left: ${({ positionx }) => `${positionx}`};
`;

export default function DroppableZone({ index, positionx, positiony }) {
  const { setNodeRef } = useDroppable({
    id: `droppable-${index}`,
  });

  return (
    <DropZone ref={setNodeRef} key={`droppable-${index}`} index={index} positionx={positionx} positiony={positiony} />
  );
}
