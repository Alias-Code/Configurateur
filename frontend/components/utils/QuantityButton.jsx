import React from "react";
import styled from "@emotion/styled";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useCartContext } from "../../context/CartContext";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
  border: 1px solid white;
  border-radius: 10px;
  font-weight: bold;
  height: 2.2rem;
  width: auto;

  button {
    color: white;
    font-size: 1rem;
    padding: 0.4rem 0.6rem;
    transform: scale(1);
    transition: transform 0.5s ease;
    cursor: pointer;

    &:hover {
      transition: transform 0.5s ease;
      transform: scale(1.3);
    }
  }

  input {
    width: 2rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
    text-align: center;

    &:focus {
      outline: none;
    }
  }
`;

export default function QuantityButton({ number, setNumber, type, itemIndex }) {
  const { setChoices } = useChoicesContext();
  const { setConfigurations } = useCartContext();

  // --- INCREASE NUMBER CHOICES OR DIRECTLY FROM CART ---

  const increaseNumber = () => {
    if (type === "resume") {
      setChoices((prevChoices) => ({
        ...prevChoices,
        quantity: prevChoices.quantity < 999 ? prevChoices.quantity + 1 : prevChoices.quantity,
      }));
      setNumber((prevNumber) => (prevNumber < 999 ? prevNumber + 1 : prevNumber));
    } else {
      let panier = localStorage.getItem("configurations");
      panier = JSON.parse(panier);

      const newQuantity = panier[`config${itemIndex}`].quantity + 1;

      if (newQuantity < 999) {
        panier[`config${itemIndex}`].quantity = newQuantity;
        localStorage.setItem("configurations", JSON.stringify(panier));
        setConfigurations(JSON.stringify(panier));
        setNumber(newQuantity);
      }
    }
  };

  const decreaseNumber = () => {
    if (type === "resume") {
      setChoices((prevChoices) => ({
        ...prevChoices,
        quantity: prevChoices.quantity > 1 ? prevChoices.quantity - 1 : prevChoices.quantity,
      }));
      setNumber((prevNumber) => (prevNumber > 1 ? prevNumber - 1 : prevNumber));
    } else {
      let panier = localStorage.getItem("configurations");
      panier = JSON.parse(panier);

      if (panier[`config${itemIndex}`].quantity > 1) {
        const newQuantity = quantity - 1;

        panier[`config${itemIndex}`].quantity = newQuantity;
        localStorage.setItem("configurations", JSON.stringify(panier));

        setConfigurations(JSON.stringify(panier));
        setNumber(newQuantity);
      }
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value < 999) {
      setNumber(value);

      if (type === "resume") {
        setChoices((prevChoices) => ({
          ...prevChoices,
          quantity: value,
        }));
      } else {
        let panier = localStorage.getItem("configurations");
        panier = JSON.parse(panier);
        panier[`config${itemIndex}`].quantity = value;
        localStorage.setItem("configurations", JSON.stringify(panier));
        setConfigurations(JSON.stringify(panier));
      }
    }
  };

  return (
    <ButtonContainer>
      <button onClick={decreaseNumber}>-</button>
      <input type="text" value={number} onChange={handleChange} />
      <button onClick={increaseNumber}>+</button>
    </ButtonContainer>
  );
}
