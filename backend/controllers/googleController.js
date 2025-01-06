import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const googleCallback = async (user, res) => {
  try {
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non authentifié." });
    }

    const { email, givenName, familyName } = user;

    let existingUser = await User.findByEmail(email);

    if (existingUser) {
      // SIGN IN

      const token = jwt.sign({ userId: existingUser.id_customer }, process.env.SECRET_KEY, {
        expiresIn: "90d",
        algorithm: "HS256",
      });

      return res.status(200).json({
        message: "Connexion via Google réalisée avec succès. EN BAS LE TOKEN",
        token,
      });
    } else {
      // SIGN UP

      const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

      const newUser = {
        id_shop_group: 1,
        id_shop: 1,
        id_gender: 1,
        id_default_group: 1,
        id_lang: 1,
        id_risk: 1,
        company: null,
        siret: null,
        ape: null,
        firstname: givenName,
        lastname: familyName,
        email: email,
        phone: null,
        profession: null,
        passwd: null,
        last_passwd_gen: currentDate,
        birthday: null,
        newsletter: 0,
        ip_registration_newsletter: null,
        newsletter_date_add: null,
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
        algorithm: "HS256",
      });

      return res.status(201).json({
        message: "Inscription via Google réalisée avec succès.",
        token,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion ou de l'inscription via Google :", error);
    res.status(500).json({
      message: "Erreur lors de la connexion ou de l'inscription via Google.",
    });
  }
};
