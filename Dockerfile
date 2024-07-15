# Usar una imagen base de Node.js
FROM node:18-alpine3.19

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que la aplicación va a correr
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start", "helloWorld.js"]
