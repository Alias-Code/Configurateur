import styled from "@emotion/styled";
import { useState } from "react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { useAuthContext } from "../../../context/AuthContext";
import { TitleStyle } from "../../utils/SharedStyle";

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  z-index: 999999999;
`;

const Modal = styled.div`
  background: white;
  padding: 1.5rem;
  padding-top: 2rem;
  border-radius: 10px;
  width: 100%;
  min-width: 300px;
  max-width: ${({ type }) => (type ? "600px" : "300px")};
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: left;
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform: scale(0.5);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: 0.2s ease;

  &.open {
    opacity: 1;
    transform: scale(1);
  }

  &.close {
    opacity: 0;
    transform: scale(0.5);
  }

  .inputGroup {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  .entryarea {
    position: relative;
    flex: 1;

    .label {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.2s ease;
      background-color: white;
      padding: 0 0.3rem;
      font-size: 0.85rem;
      z-index: 2;
    }
  }

  h2 {
    text-align: center;
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ReturnButton = styled.img`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.5rem;
  transition: all 0.2s ease;
  background-color: transparent;

  &:focus,
  &:valid {
    border-color: #1a1a1a;
  }

  &:focus + .label,
  &:valid + .label {
    transform: translate(-10px, -30px) scale(0.85);
    font-weight: bold;
  }
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: transparent;
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

  a {
    text-decoration: underline;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    appearance: none;
    width: 1rem;
    height: 1rem;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &:checked {
      background-color: #1a1a1a;
      border-color: #1a1a1a;
    }

    &:checked::before {
      content: "✔";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.6rem;
    }
  }
`;

const SubmitButton = styled.button`
  width: ${({ type }) => (type ? "50%" : "100%")};
  padding: 10px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.75rem;
  cursor: pointer;
  margin: 0 auto;

  &:hover {
    background-color: #333;
  }
`;

const HrContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Line = styled.hr`
  flex-grow: 1;
  border: none;
  border-top: 1.5px solid black;
  margin: 0 10px;
`;

const CenteredText = styled.span`
  font-size: 0.55rem;
  font-weight: 100;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: black;
`;

const EyeButton = styled.button`
  display: flex;
  background: none;
  border: none;
  position: absolute;
  z-index: 4000;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);

  img {
    height: 1.2rem;
    width: 1.2rem;
    cursor: pointer;
  }
`;

export default function SignUp({ isSignUpOpen, setSignUpOpen, setSignInOpen, modalAnimation, setModalAnimation }) {
  const { login } = useAuthContext();
  const { setNotifications } = useNotificationsContext();
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("");
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    tel: "",
    password: "",
    adresse: "",
    siret: "",
    societe: "",
    profession: "",
    cgu: false,
    newsletter: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTypeChange = (userType) => {
    setType(userType);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleCloseSignUp = () => {
    setModalAnimation("close");
    setTimeout(() => {
      setSignUpOpen(false);
      setType("");
    }, 500);
  };

  const handleReturn = () => {
    setModalAnimation("close");
    setTimeout(() => {
      setSignUpOpen(false);
      if (!type) {
        setSignInOpen(true);
      } else {
        setType("");
        setSignUpOpen(true);
      }
      setTimeout(() => {
        setModalAnimation("open");
      }, 50);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^[0-9]{10}$/;

    let messages = [];

    if (!formData.prenom || !formData.nom) {
      messages.push("Veuillez entrer votre prénom et nom.");
    }

    if (!emailRegex.test(formData.email)) {
      messages.push("Veuillez entrer une adresse mail valide.");
    }

    if (!telRegex.test(formData.tel)) {
      messages.push("Veuillez entrer un numéro de téléphone valide.");
    }

    if (formData.password.length < 5) {
      messages.push("Veuillez entrer un mot de passe de 5 caractères minimum.");
    }

    if (type === "professionnel") {
      if (!formData.siret) {
        messages.push("Veuillez entrer un numéro SIRET.");
      }
      if (!formData.societe) {
        messages.push("Veuillez entrer le nom de votre société.");
      }
    }

    if (!formData.cgu) {
      messages.push("Veuillez accepter les conditions générales d'utilisation.");
    }

    if (messages.length > 0) {
      setNotifications((prev) => ({
        ...prev,
        content: [...prev.content, ...messages],
        type: "error",
      }));
    } else {
      // --- INSCRIPTION ---

      const { prenom, nom, email, tel, password, adresse, siret, societe, profession, newsletter } = formData;

      const dataToSend = {
        prenom,
        nom,
        email,
        tel,
        password,
        ...(type === "professionnel" ? { adresse, siret, societe, profession } : {}),
        newsletter,
      };

      try {
        const response = await fetch(`http://localhost:3000/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setNotifications({
            content: [data.message || "Une erreur est survenue."],
            type: "error",
          });
        } else {
          handleCloseSignUp();
          login(data.token);
          setTimeout(() => {
            setNotifications({
              content: ["Inscription réalisée avec succès."],
              type: "success",
            });
          }, 5300);
        }
      } catch (error) {
        setNotifications({
          content: ["Une erreur est survenue lors de l'inscription."],
          type: "error",
        });
      }
    }
  };

  // --- RETURN ---

  return (
    <Overlay isOpen={isSignUpOpen} onClick={handleCloseSignUp}>
      <Modal className={modalAnimation} type={type} onClick={(e) => e.stopPropagation()}>
        <div className="topform">
          <CloseButton onClick={handleCloseSignUp}>&times;</CloseButton>
          <ReturnButton onClick={handleReturn} src="/back.svg" alt="Icône pour retourner en arrière" />
        </div>

        {/* PARTICULIER OU PRO (STOCKÉ DANS TYPE) */}

        {type === "" && (
          <>
            <SubmitButton onClick={() => handleTypeChange("particulier")}>Je suis un particulier</SubmitButton>
            <HrContainer>
              <Line />
              <CenteredText>ou</CenteredText>
              <Line />
            </HrContainer>
            <SubmitButton onClick={() => handleTypeChange("professionnel")}>Je suis un professionnel</SubmitButton>
          </>
        )}

        {/* FORM */}

        {type !== "" && (
          <>
            <TitleStyle>
              {type === "particulier"
                ? "Inscrivez-vous en tant que particulier"
                : "Inscrivez-vous en tant que professionnel"}
            </TitleStyle>
            <div className="inputGroup">
              <div className="entryarea">
                <Input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                <div className="label">Prénom*</div>
              </div>
              <div className="entryarea">
                <Input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                <div className="label">Nom*</div>
              </div>
            </div>
            <div className="inputGroup">
              <div className="entryarea">
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <div className="label">Email*</div>
              </div>
              <div className="entryarea">
                <Input type="tel" name="tel" value={formData.tel} onChange={handleChange} required />
                <div className="label">Téléphone*</div>
              </div>
            </div>
            <div className="entryarea">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="label">Mot de passe*</div>
              <EyeButton onClick={togglePasswordVisibility}>
                <img src="eye.svg" alt="Icône pour afficher le mot de passe" />
              </EyeButton>
            </div>

            {type === "professionnel" && (
              <>
                <div className="entryarea">
                  <Input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
                  <div className="label">Adresse*</div>
                </div>
                <div className="inputGroup">
                  <div className="entryarea">
                    <Input type="text" name="siret" value={formData.siret} onChange={handleChange} required />
                    <div className="label">SIRET*</div>
                  </div>
                  <div className="entryarea">
                    <Input type="text" name="societe" value={formData.societe} onChange={handleChange} required />
                    <div className="label">Nom de société*</div>
                  </div>
                </div>
                <div className="entryarea">
                  <Select name="profession" value={formData.profession} onChange={handleChange} required>
                    <option value="">Sélectionnez une profession*</option>
                    <option value="Architecte">Architecte</option>
                    <option value="Technicien">Éléctricien</option>
                    <option value="Installeur">Installateur</option>
                    <option value="Distrubuteur / Revendeur">Distrubuteur / Revendeur</option>
                    <option value="Autre">Autre</option>
                  </Select>
                </div>
              </>
            )}

            {/* FOOTER */}

            <CheckboxContainer>
              <Checkbox>
                <input type="checkbox" name="cgu" checked={formData.cgu} onChange={handleCheckboxChange} />
                <label htmlFor="acceptCGU">
                  J'accepte les{" "}
                  <a
                    href="https://lumicrea.fr/content/3-nos-conditions-generales-de-ventes?id_employee=1&adtoken=a19859276d263a2b0502e6a9e082692f&uid=3070101"
                    target="_blank">
                    Conditions Générales d'Utilisation
                  </a>
                </label>
              </Checkbox>
              <Checkbox>
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="subscribeNewsletter">S'inscrire à la newsletter</label>
              </Checkbox>
            </CheckboxContainer>

            <SubmitButton onClick={handleSubmit}>Créer le compte</SubmitButton>
          </>
        )}
      </Modal>
    </Overlay>
  );
}
