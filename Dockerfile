# Build stage for frontend
FROM node:20 AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

# Backend + production stage
FROM node:20

WORKDIR /app

# Copy backend package files
COPY package*.json ./

RUN npm install --production

# Copy backend code
COPY server.js .

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]
