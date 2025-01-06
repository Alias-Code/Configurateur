import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// --- GET USER DETAILS ---

export const getUserDetails = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const { passwd, ...userDetails } = user;

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'utilisateur:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- UPDATE PASSWORD ---

export async function updatePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword || newPassword.length < 5) {
    return res.status(400).json({ message: "Veuillez entrer des mots de passe valides." });
  }

  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    let isPasswordValid = false;

    if (user.passwd.startsWith("$2b$") || user.passwd.startsWith("$2a$") || user.passwd.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(oldPassword, user.passwd);
    } else if (user.passwd.length === 32) {
      isPasswordValid = crypto.createHash("md5").update(oldPassword).digest("hex") === user.passwd;
    } else {
      return res.status(500).json({ message: "Erreur serveur : type de hachage inconnu." });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "L'ancien mot de passe est incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.updatePassword(userId, hashedNewPassword);

    return res.status(200).json({ message: "Votre mot de passe a été mis à jour avec succès." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

export async function deleteAccount(req, res) {
  const userId = req.user.userId;

  try {
    const deleteUser = await User.deleteAccount(userId);

    if (deleteUser) {
      return res.status(200).json({ message: "Compte supprimé avec succès." });
    } else {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
