import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcrypt";

dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.passwd) {
      return res.status(500).json({ message: "Erreur serveur : mot de passe introuvable" });
    }

    let isPasswordValid = false;

    if (user.passwd.startsWith("$2b$") || user.passwd.startsWith("$2a$") || user.passwd.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(password, user.passwd);
    } else if (user.passwd.length === 32) {
      isPasswordValid = crypto.createHash("md5").update(password).digest("hex") === user.passwd;
    } else {
      return res.status(500).json({ message: "Erreur serveur : type de hachage inconnu" });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect. Veuillez réessayer." });
    }

    const token = jwt.sign({ userId: user.id_customer }, process.env.SECRET_KEY, {
      expiresIn: "90d",
    });

    return res.status(200).json({ message: "Connexion réalisée avec succès.", token });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

export async function signup(req, res) {
  const { prenom, nom, email, tel, password, siret, profession, societe, newsletter } = req.body;

  try {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "Vous êtes déjà inscrit, veuillez vous connecter." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const newUser = {
      id_shop_group: 1,
      id_shop: 1,
      id_gender: 1,
      id_default_group: 1,
      id_lang: 1,
      id_risk: 1,
      company: societe || null,
      siret: siret || null,
      ape: null,
      firstname: prenom,
      lastname: nom,
      email: email,
      phone: tel,
      profession: profession || null,
      passwd: hashedPassword,
      last_passwd_gen: currentDate,
      birthday: null,
      newsletter: newsletter ? 1 : 0,
      ip_registration_newsletter: newsletter ? req.ip : null,
      newsletter_date_add: newsletter ? currentDate : null,
      optin: 0,
      website: null,
      outstanding_allow_amount: 0.0,
      show_public_prices: 0,
      max_payment_days: 60,
      secure_key: crypto.randomBytes(16).toString("hex"),
      note: null,
      active: 1,
      is_guest: 0,
      deleted: 0,
      reset_password_token: null,
      reset_password_validity: null,
      date_add: currentDate,
      date_upd: currentDate,
    };

    const result = await User.createUser(newUser);

    const token = jwt.sign({ userId: result.id_customer }, process.env.SECRET_KEY, {
      expiresIn: "90d",
    });

    return res.status(201).json({ message: "Inscription réalisée avec succès.", token });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription.",
      error: error.message || error,
    });
  }
}

// --- CHECK AUTH ---

export async function checkAuth(userId) {
  try {
    const user = await User.findById(userId);
    return user ? true : false;
  } catch (error) {
    console.error("Erreur lors de la vérification de connexion / inscription :", error);
    throw new Error("Erreur serveur");
  }
}
