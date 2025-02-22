import styled from "@emotion/styled";
import { StepDivider } from "../../utils/SharedStyle";

const PaymentContainer = styled.div`
  display: flex;
  gap: 1rem;

  & > div {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PaymentOption = styled.div`
  border-radius: 8px;
  font-size: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;

  img {
    width: 2.5rem;
    height: 2.5rem;
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
    filter: invert(1);
  }

  h3 {
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

export default function PaymentMethod({ selectedPayment, setSelectedPayment }) {
  return (
    <>
      <StepDivider>
        <hr />
        <span>CHOIX DU PAIEMENT</span>
      </StepDivider>

      <PaymentContainer>
        <PaymentOption
          isChecked={selectedPayment === "Carte Bancaire"}
          onClick={() => setSelectedPayment("Carte Bancaire")}>
          <img src="creditcart.svg" alt="" />
          <div>
            <h3>Carte bancaire</h3>
            <p>Paiement sécurisé en ligne</p>
          </div>
          <div className="checkbox">
            <p>✔</p>
          </div>
        </PaymentOption>

        <PaymentOption
          isChecked={selectedPayment === "Virement Bancaire"}
          onClick={() => setSelectedPayment("Virement Bancaire")}>
          <img src="banktransfer.svg" alt="" />
          <div>
            <h3>Virement bancaire</h3>
            <p>Effectuez un virement après avoir passé commande</p>
          </div>
          <div className="checkbox">
            <p>✔</p>
          </div>
        </PaymentOption>
      </PaymentContainer>
    </>
  );
}
