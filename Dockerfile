# Utiliser Node.js 20
FROM node:20-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Installation des dépendances
# Copier package.json ET package-lock.json
COPY package*.json ./

# Installation en mode production
RUN npm ci --only=production

# Copier les fichiers source
COPY . .

# Définir les variables d'environnement
ENV NODE_ENV=production

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]