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
RUN npm install

# Build du projet Angular dans le WORKDIR
RUN npm run build --prod

### Étape 2 : Run ###

# Utilisation de nginx comme serveur
FROM nginx:1.27.0 AS ngi

# Copie de mon build vers un répertoire utilisable par nginx
COPY --from=build /dist/docker/dist/portfolio /var/www/portfolio

# Copie de la config nginx pour mon projet
# --> à modifier pour ne pas utiliser "default" ??
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# Exposer le port utilisé par l'application dans le container
EXPOSE 80