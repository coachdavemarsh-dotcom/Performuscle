FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy only the server code — no Vite, no frontend
COPY server/ ./server/

EXPOSE 3001

CMD ["node", "server/index.js"]
