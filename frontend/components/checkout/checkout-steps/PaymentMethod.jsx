import styled from "@emotion/styled";
import { StepDivider } from "../../utils/SharedStyle";

const PaymentContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PaymentOption = styled.div`
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

  img {
    width: 2.5rem;
    height: 2.5rem;
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
    
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
          <div className="checkbox">
            <p>✔</p>
          </div>
          <img src="creditcart.svg" alt="" />
          <div>
            <h3>Carte bancaire</h3>
            <p>Paiement sécurisé en ligne</p>
          </div>
        </PaymentOption>

        <PaymentOption
          isChecked={selectedPayment === "Virement Bancaire"}
          onClick={() => setSelectedPayment("Virement Bancaire")}>
          <div className="checkbox">
            <p>✔</p>
          </div>
          <img src="banktransfer.svg" alt="" />
          <div>
            <h3>Virement bancaire</h3>
            <p>Effectuez un virement après avoir passé commande</p>
          </div>
        </PaymentOption>
      </PaymentContainer>
    </>
  );
}
