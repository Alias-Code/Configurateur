import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  // --- SIMPLE AUTH VERIFICATION ---

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ["HS256"] });
    req.user = { userId: decoded.userId }; // Utilisation de l'ID stocké dans le token JWT
    return next(); // Passe au prochain middleware ou contrôleur
  } catch (err) {
    console.error("Erreur de vérification du JWT:", err);
  }

  // --- GOOGLE AUTH VERIFICATION ---

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Assure-toi d'utiliser l'ID client de Google
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;

    // Vérifie si l'utilisateur existe dans la base de données et récupère l'id_customer

    // const idCustomer = await getCustomerIdFromGoogleId(googleId);
    const idCustomer = 20189;

    if (!idCustomer) {
      return res.sendStatus(404); // Si l'utilisateur n'est pas trouvé
    }

    req.user = { userId: idCustomer };

    return next();
  } catch (err) {
    console.error("Erreur de vérification du token Google:", err);
    return res.sendStatus(403);
  }
};

export default authenticateToken;
