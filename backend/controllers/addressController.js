import UserAddresses from "../models/UserAddresses.js";

// --- CREATE ADDRESS ---

export async function createAddress(req, res) {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Erreur" });
  }

  const { fullName, phone, address, additionalAddress, postalCode, city, typeOfAddress } = req.body;

  const id_customer = req.user.userId;

  let messages = [];

  if (!fullName) {
    messages.push("Veuillez votre nom et prénom.");
  }

  if (!address || (additionalAddress && additionalAddress.length <= 5)) {
    messages.push("Veuillez entrer une adresse valide.");
  }

  if (!city) {
    messages.push("Veuillez entrer une ville.");
  }

  if (postalCode && (isNaN(postalCode) || postalCode.length > 5)) {
    messages.push("Veuillez entrer un code postal valide.");
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (phone && !phoneRegex.test(phone)) {
    messages.push("Veuillez entrer un numéro de téléphone valide.");
  }

  if (messages.length > 0) {
    return res.status(400).json({ messages });
  }

  const date_now = new Date().toISOString().slice(0, 19).replace("T", " ");

  const newAddress = {
    id_country: 8,
    id_state: null,
    id_customer: id_customer,
    id_manufacturer: 0,
    id_supplier: 0,
    id_warehouse: 0,
    alias: typeOfAddress,
    company: null,
    lastname: fullName.split(" ")[0],
    firstname: fullName.split(" ")[1],
    address1: address,
    address2: additionalAddress,
    postcode: postalCode,
    city: city,
    other: null,
    phone: phone,
    phone_mobile: null,
    vat_number: null,
    dni: null,
    date_add: date_now,
    date_upd: date_now,
    active: 1,
    deleted: 0,
  };

  try {
    const result = await UserAddresses.createAddress(newAddress);

    return res.status(201).json({ message: result.message, id_address: result.id_customer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- DELETE ADDRESS ---

export const deleteAddress = async (req, res) => {
  const userId = req.user.userId;

  try {
    const deletedAddress = await UserAddresses.deleteAddress(userId, req.body.type);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Adresse non trouvée" });
    }

    return res.status(200).json({ message: "Adresse supprimée avec succès", deletedAddress });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'adresse :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- GET USER ADDRESS ---

export const getUserAddress = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userAddresses = await UserAddresses.findUserAddress(userId);

    return res.status(200).json(userAddresses || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des adresses", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
