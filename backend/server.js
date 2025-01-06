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

// --- SÉCURITÉ EXTERNE REQUÊTE ---

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://lumicrea.fr",
        "https://configurateur-sand.vercel.app",
      ];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// --- LIMITE NOMBRE REQUETE ---

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  min: 100,
  message: "Trop de requêtes, veuillez réessayer plus tard",
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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

dbPool
  .getConnection()
  .then((connection) => {
    console.log("Connecté à la base de données");
    return connection.query("SELECT 1");
  })
  .then(() => {
    console.log("Requête réussie, connexion active");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
  });

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

// --- GOOGLE AUTH ---

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // À mettre à true en production avec HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
