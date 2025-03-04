import styled from "@emotion/styled";
import AddressForm from "./AddressForm";
import AddressDisplay from "./AddressDisplay";
import React, { useEffect, useState } from "react";
import { TitleStyle, StepDivider } from "../../../utils/SharedStyle";
import { useNotificationsContext } from "../../../../context/NotificationsContext";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../../../App";

const AdressesContainer = styled.div`
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    box-shadow: ${({ theme }) => `0 0 0px 1000px ${theme.backgroundColor} inset !important`};
    -webkit-box-shadow: ${({ theme }) => `0 0 0px 1000px ${theme.backgroundColor} inset !important`};
    -webkit-text-fill-color: ${({ theme }) => `${theme.textColor} !important`};
  }

  hr {
    border: 0.5px solid black;
    margin: 1rem 0;
    width: 100%;
  }

  .subtitle {
    margin: 1.5rem 0;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SharedAddressMessage = styled.div`
  background-color: #e8f5e9;
  color: black;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  width: fit-content;
`;

// --- COMPOSANT PRINCIPAL ---

function Adresses({ isCheckout, checkoutFormData, setCheckoutFormData }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const [addressFormData, setAddressFormData] = useState({
    shipping: {
      fullName: "",
      phone: "",
      address: "",
      additionalAddress: "",
      postalCode: "",
      city: "",
    },
    billing: {
      fullName: "",
      phone: "",
      address: "",
      additionalAddress: "",
      postalCode: "",
      city: "",
    },
    useForBilling: isCheckout ? true : false,
  });

  const formData = isCheckout ? checkoutFormData : addressFormData;
  const setFormData = isCheckout ? setCheckoutFormData : setAddressFormData;

  const [userAddresses, setUserAddresses] = useState([]);
  const { setNotifications } = useNotificationsContext();

  const hasShippingAddress = userAddresses.some((address) => address.alias === "unsync-shipping");
  const hasBillingAddress = userAddresses.some((address) => address.alias === "unsync-billing");
  const isSynchronized = userAddresses.some((address) => address.alias === "sync");

  // --- FETCH USER DATA ---

  const fetchUserAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/address/getuseraddress`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUserAddresses(data);
    } catch (error) {
      setNotifications({ content: error.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  // --- HANDLERS ---

  const handleAddressDeleted = (type, isSync) => {
    if (isSync) {
      setUserAddresses((prevAddresses) => {
        const addressToDelete = type === "sync-shipping" ? "unsync-billing" : "unsync-shipping";
        return [{ ...prevAddresses[0], alias: addressToDelete }];
      });
    } else {
      setUserAddresses((prevAddresses) => prevAddresses.filter((address) => address.alias !== type));
    }
  };

  const handleAddressCreated = () => {
    fetchUserAddresses();
  };

  // --- RETURN ---

  return (
    <ThemeProvider theme={isCheckout ? darkTheme : lightTheme}>
      <AdressesContainer>
        {!isCheckout ? (
          <HeaderContainer>
            <TitleStyle fontWeight="700">Consultez vos adresses</TitleStyle>
            {isSynchronized && (
              <SharedAddressMessage>
                Vous utilisez une adresse identique pour la livraison et la facturation.
              </SharedAddressMessage>
            )}
          </HeaderContainer>
        ) : (
          <StepDivider>
            <hr />
            <span>INFORMATIONS</span>
          </StepDivider>
        )}

        {/* DISPLAY SYHNCRONISÉ */}

        {isSynchronized &&
          userAddresses.map((address, index) => (
            <>
              <AddressDisplay
                isCheckout={isCheckout}
                key={`${index}-shipping`}
                address={address}
                type="sync-shipping"
                onAddressDeleted={handleAddressDeleted}
              />
              <AddressDisplay
                isCheckout={isCheckout}
                key={`${index}-billing`}
                address={address}
                type="sync-billing"
                onAddressDeleted={handleAddressDeleted}
              />
            </>
          ))}

        {/*DISPLAY NON SYHNCRONISÉ */}

        {!isSynchronized &&
          userAddresses.map((address) => (
            <AddressDisplay
              isCheckout={isCheckout}
              key={address.id_address}
              address={address}
              type={address.alias}
              onAddressDeleted={handleAddressDeleted}
            />
          ))}

        {/* FORMUALIRE */}

        {!isSynchronized && (
          <>
            {!hasShippingAddress && (
              <>
                {!isCheckout && <hr />}

                {/* JE PASSE UN SET FORM DATA CUSTOM QUI UPDATE LE SHIPPING ET LE BILLING SI SYHNCRO */}

                <AddressForm
                  type="unsync-shipping"
                  onAddressCreated={handleAddressCreated}
                  formData={formData.shipping}
                  useForBilling={formData.useForBilling}
                  setFormData={(newData) => {
                    setFormData((prev) => ({
                      ...prev,
                      shipping: newData,
                      billing: prev.useForBilling ? newData : prev.billing,
                    }));
                  }}
                  onUseForBillingChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      useForBilling: checked,
                      billing: checked ? prev.shipping : prev.billing,
                    }));
                  }}
                />
              </>
            )}

            {((!isCheckout && !hasBillingAddress) || (isCheckout && !hasBillingAddress && !formData.useForBilling)) && (
              <>
                {!isCheckout && <hr />}
                <AddressForm
                  type="unsync-billing"
                  onAddressCreated={handleAddressCreated}
                  formData={formData.billing}
                  setFormData={(newData) => {
                    setFormData((prev) => ({
                      ...prev,
                      billing: newData,
                    }));
                  }}
                />
              </>
            )}
          </>
        )}
      </AdressesContainer>
    </ThemeProvider>
  );
}

export default Adresses;
