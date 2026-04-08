# Stage 1: Build the React frontend
FROM node:18-alpine as frontend-builder

WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend . .

RUN npm run build

# Stage 2: Build and run the backend with served frontend
FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./

# Install backend dependencies (keep lightweight)
RUN npm install

# Copy backend code
COPY backend/src ./src
COPY backend/config ./config 2>/dev/null || true
COPY backend/.env* ./
COPY backend/Procfile ./Procfile 2>/dev/null || true

# Copy built frontend from stage 1
COPY --from=frontend-builder /workspace/frontend/build ./frontend/build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
