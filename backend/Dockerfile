# Dockerfile for Node.js Backend
FROM node:16

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
