### Étape 1 : Build ###

# Utilisation de Node pour build et compiler le code
FROM node:22 AS build

# Création d'un répertoire virtuel dans l'image docker
WORKDIR /dist/docker

# Clean de NPM pour s'assurer qu'on utilise les dernières versions des packages
# et qu'il n'y a pas de fichiers corrompus/périmés
# https://www.geeksforgeeks.org/how-to-clear-the-cache-in-npm/
RUN npm cache clean --force

# Copie des fichiers 
# de la machine locale (premier argument)
# vers le répertoire virtuel de Docker (deuxième argument)
COPY . .

# Installation des dépendances
RUN npm install --legacy-peer-deps

# Build du projet Angular dans le WORKDIR
RUN npm run build --prod

### Étape 2 : Run ###

# Utilisation de nginx comme serveur
FROM nginx:stable-alpine AS ngi

# Copie de mon build vers un répertoire utilisable par nginx
COPY --from=build /dist/docker/dist/portfolio/browser /usr/share/nginx/html

# Copie de la config nginx pour mon projet
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# Exposer le port utilisé par l'application dans le container
EXPOSE 80

# > ChatGPT
# L'intérêt de cette commande est de s'assurer que le conteneur reste actif aussi longtemps 
# que Nginx est en fonctionnement. Si Nginx se terminait ou était exécuté en mode démon (background), 
# le conteneur se terminerait immédiatement après le démarrage, car le processus principal se terminerait.
CMD ["nginx", "-g", "daemon off;"]