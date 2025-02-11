import styled from "@emotion/styled";
import React, { useRef } from "react";
import Resume from "./Resume";
import ImagePreviewContainer from "./ImagePreviewContainer";
import { useChoicesContext } from "../../../context/ChoicesContext";

const RenderSideContainer = styled.div`
  width: 45%;
  height: 100vh;
  color: white;
  overflow-y: auto;
  background-color: #1a1a1a;

  &::-webkit-scrollbar-thumb {
    background: black;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  @media (max-width: 992px) {
    position: fixed;
    bottom: 0;
    z-index: 1001;
    transition: left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
    left: ${({ menu }) => (menu ? "0%" : "100%")};
    width: 100%;
    height: 100%;
  }
`;

export default function RenderSide({ type }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { menu, renderRef } = useChoicesContext();

  // --- RETURN ---

  return (
    <RenderSideContainer menu={menu}>
      <ImagePreviewContainer renderRef={renderRef} />
      {type !== "mobilePreview" && <Resume type="resume" className="renderSide" />}
    </RenderSideContainer>
  );
}
