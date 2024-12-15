# Koristi Node.js sliku za izgradnju
FROM node:22

# Postavi radni direktorijum
WORKDIR /app

# Kopiraj package.json i instaliraj zavisnosti
COPY package.json ./
RUN npm install

# Kopiraj ostatak aplikacije
COPY . .

# Izgradite Angular aplikaciju
RUN npm run build --prod

# Instaliraj http-server za posluživanje build-ovane aplikacije
RUN npm install -g http-server

# Pokreni http-server na portu 4200 i posluži build-ovanu aplikaciju
CMD ["http-server", "dist/", "-p", "4200"]

EXPOSE 4200