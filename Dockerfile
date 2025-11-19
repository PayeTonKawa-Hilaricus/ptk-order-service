# --- 1. BUILD STAGE ---
FROM node:18-alpine As development

# Répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Build de l'application (pour vérifier que ça compile)
RUN npm run build