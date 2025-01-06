import { useEffect, useRef, useState } from "react";
import { useNotificationsContext } from "../../../../Context/NotificationsContext";
import { TitleStyle, CheckboxStyle } from "../../../Global/SharedStyle";
import { Loader } from "@googlemaps/js-api-loader";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EntryArea = styled.div`
  position: relative;
  .label {
    font-family: "Roboto Flex", sans-serif;
    font-variation-settings: "wght" 400;
    transition: font-variation-settings 1s ease;
    position: absolute;
    z-index: -1;
    transform: translateY(-50%);
    top: 50%;
    transition: all 0.3s ease;
    background-color: ${({ theme }) => theme.backgroundColor};
    font-size: 0.95rem;
    color: ${({ theme }) => theme.labelColor};
  }
`;

const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  font-size: 1rem;
  font-weight: normal;
  outline: none;
  background-color: transparent;
  padding: 0.75rem 0.75rem 0.25rem 0rem;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.textColor};

  &:focus {
    border-color: ${({ theme }) => theme.borderColor};
  }

  &:not(:placeholder-shown) {
    border-color: ${({ theme }) => theme.borderColor};
  }

  &:focus + .label,
  &:not(:placeholder-shown) + .label {
    color: ${({ theme }) => theme.textColor};
    transition: all 0.3s ease;
    font-size: 0.7rem;
    top: 2px;
    z-index: 1;
    font-variation-settings: "wght" 700;
  }
`;

const CheckboxContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  padding: 10px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;
  margin-top: 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  img {
    width: 1.2rem;
    height: 1.2rem;
  }

  p {
    text-transform: capitalize;
  }

  &:hover {
    background-color: #245e24;
  }
`;

// --- FORMULAIRE ADRESSE ---

export default function AddressForm({
  type,
  onAddressCreated,
  formData,
  setFormData,
  useForBilling,
  onUseForBillingChange,
}) {
  const adresseRef = useRef();
  const theme = useTheme();
  const autocompleteInstance = useRef(null);
  const { setNotifications } = useNotificationsContext();

  const [localFormData, setLocalFormData] = useState(formData);

  // --- SYHNCRONISATION ---

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // --- GOOGLE PLACE ---

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          version: "weekly",
          libraries: ["places"],
        });

        const { Autocomplete } = await loader.importLibrary("places");

        if (adresseRef.current) {
          autocompleteInstance.current = new Autocomplete(adresseRef.current, {
            componentRestrictions: { country: "fr" },
            fields: ["address_components", "formatted_address", "geometry"],
            types: ["address"],
          });

          autocompleteInstance.current.addListener("place_changed", () => {
            const place = autocompleteInstance.current.getPlace();

            if (place.address_components) {
              let streetNumber = "";
              let route = "";
              let postalCode = "";
              let city = "";

              place.address_components.forEach((component) => {
                const types = component.types;

                if (types.includes("street_number")) {
                  streetNumber = component.long_name;
                }
                if (types.includes("route")) {
                  route = component.long_name;
                }
                if (types.includes("postal_code")) {
                  postalCode = component.long_name;
                }
                if (types.includes("locality")) {
                  city = component.long_name;
                }
              });

              // Mettre à jour le localFormData avec toutes les nouvelles valeurs
              setLocalFormData((prev) => ({
                ...prev,
                address: `${streetNumber} ${route}`.trim(),
                postalCode,
                city,
              }));
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Google Maps:", error);
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(autocompleteInstance.current);
      }
    };
  }, []);

  // --- HANDLE CHANGE ---

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    if (inputType === "checkbox") {
      onUseForBillingChange?.(checked);
    } else {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --- CREATE ADDRESS ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    let messages = [];

    if (!localFormData.fullName) {
      messages.push("Veuillez entrer votre prénom et nom.");
    }

    if (!localFormData.address || !localFormData.postalCode || !localFormData.city) {
      messages.push("Veuillez entrer une adresse valide.");
    }

    if (localFormData.phone && !phoneRegex.test(localFormData.phone)) {
      messages.push("Veuillez entrer un numéro de téléphone valide.");
    }

    if (messages.length > 0) {
      setNotifications({
        content: messages,
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const typeOfAddress = type === "unsync-shipping" && useForBilling ? "sync" : type;

    try {
      const response = await fetch("http://localhost:3000/api/address/createuseraddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...localFormData,
          typeOfAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotifications({
          content: [data.message || "Une erreur est survenue."],
          type: "error",
        });
      } else {
        setNotifications({
          content: ["Création de l'adresse réalisée avec succès."],
          type: "success",
        });
        onAddressCreated();
      }
    } catch (error) {
      setNotifications({
        content: ["Une erreur est survenue lors de la création de l'adresse."],
        type: "error",
      });
    }
  };

  // --- RETURN ---

  return (
    <div>
      <TitleStyle className="subtitle" fontSize="0.9rem" color={theme.textColor}>
        Adresse de {type.split("-")[1] === "billing" ? "facturation" : "livraison"} :
      </TitleStyle>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <EntryArea>
            <Input type="text" name="fullName" value={localFormData.fullName} onChange={handleChange} placeholder="" />
            <div className="label">Nom & Prénom*</div>
          </EntryArea>

          <EntryArea>
            <Input type="tel" name="phone" value={localFormData.phone} onChange={handleChange} placeholder="" />
            <div className="label">Téléphone (Optionnel)</div>
          </EntryArea>
        </FormGroup>
        <FormGroup>
          <EntryArea>
            <Input
              ref={adresseRef}
              type="text"
              name="address"
              value={localFormData.address}
              onChange={handleChange}
              placeholder=""
            />
            <div className="label">Adresse*</div>
          </EntryArea>

          <EntryArea>
            <Input
              type="text"
              name="additionalAddress"
              value={localFormData.additionalAddress}
              onChange={handleChange}
              placeholder=""
            />
            <div className="label">Complément d'adresse (Optionnel)</div>
          </EntryArea>
        </FormGroup>
        <FormGroup>
          <EntryArea>
            <Input
              type="text"
              name="postalCode"
              value={localFormData.postalCode}
              onChange={handleChange}
              placeholder=""
            />
            <div className="label">Code postal*</div>
          </EntryArea>

          <EntryArea>
            <Input type="text" name="city" value={localFormData.city} onChange={handleChange} placeholder="" />
            <div className="label">Ville*</div>
          </EntryArea>
        </FormGroup>
        {type === "unsync-shipping" && (
          <CheckboxContainer>
            <CheckboxStyle>
              <input
                type="checkbox"
                id="useForBilling"
                name="useForBilling"
                checked={useForBilling}
                onChange={handleChange}
              />
              <label>Sauvegarder la même adresse pour la facturation</label>
            </CheckboxStyle>
          </CheckboxContainer>
        )}
        <SubmitButton type="submit">
          <img src="/save.svg" alt="" />
          <p>Enregistrer l'Adresse de {type.split("-")[1] === "billing" ? "facturation" : "livraison"}</p>
        </SubmitButton>
      </form>
    </div>
  );
}
