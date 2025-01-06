# Utiliser Node.js 20
FROM node:20-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier tous les fichiers du projet
COPY . .

# Définir les variables d'environnement
ENV NODE_ENV=production

# Exposer le port
EXPOSE 3000

# Lancer le serveur
CMD ["node", "backend/server.js"]
