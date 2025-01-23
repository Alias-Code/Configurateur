import styled from "@emotion/styled";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { StepDivider } from "../../utils/SharedStyle";
import { Link } from "react-router-dom";

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;

  .addBilling {
    text-decoration: underline;
    cursor: pointer;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EntryArea = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 1.5rem;

  &.textarea {
    width: 100%;
  }

  .label {
    top: 0.75rem;
    position: absolute;
    font-size: 1rem;
    color: #bdbdbd;
    transition: all 0.2s ease;
    pointer-events: none;
  }
`;

const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #4e4e4e;
  font-size: 1rem;
  outline: none;
  background-color: transparent;
  padding: 0.6rem 0;
  color: white;
  transition: border-color 0.2s ease;

  &:focus {
    border-bottom-color: white;
  }

  &:focus + .label,
  &:not(:placeholder-shown) + .label {
    color: white;
    top: -10px;
    font-size: 0.85rem;
    transform: translateY(0);
  }
`;

export default function Informations({ formData, setFormData, setCheckoutAnimation }) {
  // --- ÉTATS ET RÉFÉRENCES ---
  const [userAddresses, setUserAddresses] = useState([]);
  const autocompleteInstance = useRef(null);
  const adresseRef = useRef();

  const hasShippingAddress = userAddresses.some((address) => address.alias === "unsync-shipping");
  const hasBillingAddress = userAddresses.some((address) => address.alias === "unsync-billing");
  const isSynchronized = userAddresses.some((address) => address.alias === "sync");

  // --- FETCH USER DATA ---

  const fetchUserAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/user/getuseraddress`, {
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

  //   --- GOOGLE MAP ---

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

              setFormData((prev) => ({
                ...prev,
                address: `${streetNumber} ${route}`.trim(),
                postalCode: postalCode,
                city: city,
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

  //   --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   --- ADDRESS INFORMATIONS ---

  const addressesInformations = () => {
    if (isSynchronized) {
      return <p>Votre adresse de livraison est syhncronisé avec celle de facturation.</p>;
    } else if (hasShippingAddress) {
      return <p>Vous avez déjà une adresse de livraison remplie.</p>;
    }
  };

  return (
    <>
      <StepDivider>
        <hr />
        <span>INFORMATIONS</span>
      </StepDivider>

      <p>{addressesInformations()}</p>

      <FormGroup>
        <EntryArea>
          <Input type="text" name="fullName" placeholder=" " value={formData.fullName} onChange={handleChange} />
          <div className="label">Nom et prénom*</div>
        </EntryArea>

        <EntryArea>
          <Input type="tel" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
          <div className="label">Téléphone</div>
        </EntryArea>
      </FormGroup>

      <FormGroup>
        <EntryArea>
          <Input
            ref={adresseRef}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder=""
          />
          <div className="label">Adresse*</div>
        </EntryArea>

        <EntryArea>
          <Input
            type="text"
            name="additionalAddress"
            placeholder=" "
            value={formData.additionalAddress}
            onChange={handleChange}
          />
          <div className="label">Complément d'adresse</div>
        </EntryArea>
      </FormGroup>

      <FormGroup>
        <EntryArea>
          <Input type="text" name="postalCode" placeholder=" " value={formData.postalCode} onChange={handleChange} />
          <div className="label">Code postal*</div>
        </EntryArea>

        <EntryArea>
          <Input type="text" name="city" placeholder=" " value={formData.city} onChange={handleChange} />
          <div className="label">Ville*</div>
        </EntryArea>

        {!hasBillingAddress && (
          <Link to="../profil/adresses" onClick={() => setCheckoutAnimation(false)} className="addBilling">
            Ajoutez une adresse de facturation
          </Link>
        )}
      </FormGroup>
    </>
  );
}
