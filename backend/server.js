import passport from "passport";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mysql from "mysql2/promise";
import winston from "winston";
import expressWinston from "express-winston";
import session from "express-session";
// import { default as RedisStore } from "connect-redis";
// import { createClient } from "redis";
import { validationResult } from "express-validator";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import googleRoutes from "./routes/googleRoutes.js";

dotenv.config();

// --- WINSTON LOGS ---

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    ...(process.env.NODE_ENV !== "production" ? [new winston.transports.Console()] : []),
  ],
});

const app = express();

// --- SÉCURITÉ INTERNE REQUÊTE ---

app.use(helmet());

app.set("trust proxy", true);

// --- SÉCURITÉ EXTERNE REQUÊTE CORS ---

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://lumicrea.fr",
        "https://configurateur-sand.vercel.app",
        "https://configurateur-production.up.railway.app",
      ];

      const vercelRegex = /^https:\/\/configurateur(-\w+)?\.vercel\.app$/;

      if (!origin || allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
  })
);

// --- LIMITE NOMBRE REQUETE ---

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});

app.use(limiter);

// --- LIMITE TAILLE REQUETE ---

app.use(
  express.json({
    limit: "50mb",
    strict: true,
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

// --- POOL CONNECTION EN CACHE ---

const dbPool = mysql.createPool({
  host: process.env.DB_HOST.trim(),
  user: process.env.DB_USER.trim(),
  password: process.env.DB_PASSWORD.trim(),
  database: process.env.DB_NAME.trim(),
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectTimeout: 20000,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

(async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log("Connecté à la base de données");
    await connection.query("SELECT 1");
    console.log("Requête réussie, connexion active");
    connection.release(); // Libérer la connexion après usage
  } catch (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
    if (err.code === "ENOTFOUND") {
      console.error("L'adresse de la base de données est introuvable. Vérifiez la configuration.");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Les informations d'identification (utilisateur/mot de passe) sont incorrectes.");
    } else if (err.code === "ETIMEDOUT") {
      console.error("La connexion à la base de données a expiré.");
    } else {
      console.error("Erreur inconnue :", err);
    }
  }
})();

// --- MIDDLEWARE SESSION ---

// const redisClient = createClient();
// redisClient.connect().catch(console.error);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// --- GOOGLE AUTH ---

app.use(passport.initialize());
app.use(passport.session());

// --- MIDDLEWARE LOGGING DES REQUÊTES ---

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    colorize: false,
  })
);

// --- GESTION CENTRALISÉE DES ERREURS ---

app.use((err, req, res, next) => {
  logger.error(`Erreur serveur: ${err.stack}`);

  res.status(500).json({
    message: "Une erreur serveur est survenue",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

// --- DEFINITION DES ROUTES ---

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use(googleRoutes);

// --- ROUTE NON TROUVÉE ---

app.use((req, res) => {
  logger.warn(`Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route non trouvée" });
});

// --- DÉMARRAGE DU SERVEUR ---

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Serveur en écoute sur le port ${PORT}`);
});

// --- ARRÊT DU SERVEUR GÉRÉ ---

process.on("SIGTERM", () => {
  logger.info("Signal SIGTERM reçu. Fermeture du serveur...");
  server.close(() => {
    logger.info("Serveur fermé");
    process.exit(0);
  });
});

export { dbPool, logger };
