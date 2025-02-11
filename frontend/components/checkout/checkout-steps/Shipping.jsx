import styled from "@emotion/styled";
import MondialRelayPicker from "./MondialRelayPicker";
import { StepDivider, CheckboxStyle } from "../../utils/SharedStyle";

const DeliveryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  & > div {
    width: 100%;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const DeliveryOption = styled.div`
  border-radius: 8px;
  font-size: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  cursor: pointer;

  a {
    text-decoration: underline;
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
  }

  div h3 {
    font-size: 13px;
  }

  .checkbox {
    margin-left: auto;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 25px;
    transition: all 0.5s ease;
    border: ${({ isChecked }) => (isChecked ? "1px solid #245e24" : "1px solid white")};
    background-color: ${({ isChecked }) => (isChecked ? "#245e24" : "transparent")};

    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: white;
      opacity: ${({ isChecked }) => (isChecked ? "1" : "0")};
      transition: all 0.5s ease;
    }
  }
`;

export default function Shipping({ selectedDelivery, setSelectedDelivery, handleRelayPointSelect }) {
  return (
    <>
      <StepDivider>
        <hr />
        <span>CHOIX DE LIVRAISON</span>
      </StepDivider>

      <DeliveryContainer>
        <DeliveryOption
          isChecked={selectedDelivery === "Retrait - Atelier Suresnes"}
          onClick={() => setSelectedDelivery("Retrait - Atelier Suresnes")}>
          <img src="/lumicrea_icon_white.png" className="retrait" alt="" />
          <div>
            <h3>Retrait au Showroom</h3>
            <a href="https://g.co/kgs/3fmmmuB" target="_blank">
              Depuis notre Atelier
            </a>
          </div>
          <div className="checkbox">
            <p>✔</p>
          </div>
        </DeliveryOption>

        <DeliveryOption
          isChecked={selectedDelivery === "Point Relai - Mondial Relay"}
          onClick={() => setSelectedDelivery("Point Relai - Mondial Relay")}>
          <img src="/mondialrelay.svg" alt="" />
          <div>
            <h3>Livraison en Point Relais</h3>
            <p>3-5 jours ouvrés - 4.99€</p>
          </div>
          <div className="checkbox">
            <p>✔</p>
          </div>
        </DeliveryOption>

        <DeliveryOption
          isChecked={selectedDelivery === "Domicile - Colissimo"}
          onClick={() => setSelectedDelivery("Domicile - Colissimo")}>
          <img src="/colissimo.svg" alt="" />
          <div>
            <h3>Livraison à Domicile</h3>
            <p>2-4 jours ouvrés - 7.99€</p>
          </div>
          <div className="checkbox">
            <p>✔</p>
          </div>
        </DeliveryOption>
      </DeliveryContainer>

      {selectedDelivery === "Point Relai - Mondial Relay" && (
        <MondialRelayPicker onPointRelaisSelect={handleRelayPointSelect} />
      )}
    </>
  );
}
