# Multi-stage build for Charlie Van Dashboard

# Stage 1: Build frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --prefer-offline --no-audit 2>&1 || npm install --legacy-peer-deps --no-audit
COPY frontend/src ./src
COPY frontend/public ./public
RUN npm run build 2>&1 && ls -la build/

# Stage 2: Build backend and runtime
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production --prefer-offline --no-audit

# Copy backend code
COPY backend/ ./

# Copy built frontend into backend public directory
RUN mkdir -p public
COPY --from=frontend-builder /app/frontend/build/ public/
RUN ls -la public/

# Create data directory for SQLite
RUN mkdir -p data

# Expose port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
