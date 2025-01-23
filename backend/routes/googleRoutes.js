import express from "express";
import passport from "passport";
import { googleCallback } from "../controllers/googleController.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/auth/google/callback", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token manquant");
  }

  try {
    // Vérifier le token Google
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Créer un objet utilisateur à partir du payload

    const user = {
      email: payload.email,
      givenName: payload.given_name,
      familyName: payload.family_name,
    };

    // Appeler votre contrôleur googleCallback

    googleCallback(user, res);
  } catch (error) {
    console.error("Erreur de vérification du token Google :", error);
    res.status(500).json({
      message: "Erreur d'authentification Google",
      error: error.message,
    });
  }
});

export default router;
