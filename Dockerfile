# Dockerfile (for Vite frontend)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps


COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
