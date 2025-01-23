import React, { useState } from "react";
import styled from "@emotion/styled";
import { ChevronRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import ImagePreviewContainer from "./ImagePreviewContainer";
import { useChoicesContext } from "../../../context/ChoicesContext";

const MobileRenderPreviewContainer = styled.div`
  width: ${({ isExpanded }) => (isExpanded ? "20rem" : "11rem")};
  height: ${({ isExpanded }) => (isExpanded ? "20rem" : "11rem")};
  position: absolute;
  z-index: 99999;
  right: 0;
  top: 0;
  transform: ${({ menu }) => (menu ? "translateX(300px)" : "translateX(0)")};
  transition: all 0.4s ease-in-out;
  overflow: hidden;

  .menuContainer {
    position: relative;
    width: 100%;
    height: 100%;
  }

  img {
    border-bottom-left-radius: 5px;
  }
`;

const ResizeButton = styled.div`
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  transition: all 0.3s ease;
  transform: translateY(-100%);

  &:hover {
    background: white;
  }
`;

const DetailsButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  font-size: 8px;
  font-weight: 500;
  opacity: ${({ isExpanded }) => (isExpanded ? "1" : "0")};
  transition: all 0.3s ease;

  p {
    font-weight: bold;
    transform: translateY(1px);
  }

  &:hover {
    background: white;
  }
`;

export default function MobileRenderPreview() {
  const { menu, setMenu, choices } = useChoicesContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMenu = () => setMenu((prev) => !prev);

  const handleResize = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const hasColorAndFacade = choices?.couleur?.id && choices?.facade?.id;

  if (!hasColorAndFacade) return null;

  return (
    <MobileRenderPreviewContainer menu={menu} isExpanded={isExpanded} onClick={handleResize}>
      <div className="menuContainer">
        <ImagePreviewContainer type="mobilePreview" />

        <ResizeButton>{isExpanded ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}</ResizeButton>

        <DetailsButton isExpanded={isExpanded} onClick={handleMenu}>
          <p>VOIR DETAILS</p>
          <ChevronRight size={12} />
        </DetailsButton>
      </div>
    </MobileRenderPreviewContainer>
  );
}
