import React from "react";
import styled from "@emotion/styled";

const SocialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin: 3rem 0 1rem 0;

  img {
    width: 25%;

    @media (max-width: 900px) {
      width: 50%;
    }
  }

  div {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 3rem;

    img {
      width: 1.7rem;
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
`;

export default function Socials() {
  return (
    <SocialsContainer>
      <img src="/logo_lumicrea.webp" alt="Logo de marque LUMICREA" />
      <div>
        <a href="https://instagram.com/lumicrea.officiel" target="_blank">
          <img src="/instagram.svg" alt="Logo de marque Instagram" />
        </a>
        <a href="https://facebook.com/lumicrea.officiel" target="_blank">
          <img src="/facebook.svg" alt="Logo de marque Facebook" />
        </a>
        <a href="https://youtube.com/@lumicreasociete269" target="_blank">
          <img src="/youtube.svg" alt="Logo de marque YouTube" />
        </a>
        <a href="https://linkedin.com/company/lumicrea" target="_blank">
          <img src="/linkedin.svg" alt="Logo de marque LinkedIn" />
        </a>
        <a href="https://pinterest.fr/lumicreafr/_created/" target="_blank">
          <img src="/pinterest.svg" alt="Logo de marque Pinterest" />
        </a>
      </div>
    </SocialsContainer>
  );
}
