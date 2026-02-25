#!/bin/bash
# Van OS Flash Script - LinkLink Hub via Serial Console
# Run this on the hub after USB serial connection established

set -e

echo "🚐 Van OS Flash - Starting..."
echo "================================"

# Step 1: Stop existing services
echo "📍 Step 1: Stopping services..."
docker ps -a | grep -q homeassistant && docker stop homeassistant || true
docker ps -a | grep -q home-assistant && docker stop home-assistant || true
sleep 2

# Step 2: Remove old containers
echo "📍 Step 2: Removing old containers..."
docker rm homeassistant home-assistant 2>/dev/null || true
docker system prune -af 2>/dev/null || true

# Step 3: Create van OS directories
echo "📍 Step 3: Creating directories..."
mkdir -p /opt/van-os
mkdir -p /opt/data/{downloads,music,archive}
mkdir -p /opt/ollama

# Step 4: Create docker-compose.yml
echo "📍 Step 4: Creating docker-compose.yml..."
cat > /opt/van-os/docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  charlie-dashboard:
    image: charlie-van-dashboard:latest
    container_name: charlie
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
    volumes:
      - /opt/data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - /opt/ollama:/root/.ollama
    environment:
      OLLAMA_HOST: 0.0.0.0:11434
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
COMPOSE_EOF

# Step 5: Pull images
echo "📍 Step 5: Pulling Docker images..."
docker pull node:18-alpine
docker pull ollama/ollama:latest

# Step 6: Pull Charlie dashboard from GitHub
echo "📍 Step 6: Pulling Charlie dashboard..."
cd /tmp
git clone https://github.com/Van-DeborahKerr/Van-dashboard.git 2>/dev/null || cd Van-dashboard && git pull
cd Van-dashboard
docker build -t charlie-van-dashboard:latest -f docker/Dockerfile . --progress=plain

# Step 7: Start van OS services
echo "📍 Step 7: Starting van OS services..."
cd /opt/van-os
docker compose up -d

# Step 8: Wait for services
echo "📍 Step 8: Waiting for services to be ready..."
sleep 10

# Step 9: Pull Ollama model
echo "📍 Step 9: Pulling Ollama model (mistral)..."
docker exec ollama ollama pull mistral

# Step 10: Verify
echo "📍 Step 10: Verifying services..."
docker ps

# Step 11: Test endpoints
echo ""
echo "🎉 Van OS Flash Complete!"
echo "================================"
echo "✅ Charlie Dashboard: http://192.168.188.1:5000"
echo "✅ Ollama API: http://192.168.188.1:11434"
echo "✅ Health check: curl http://192.168.188.1:5000/api/health"
echo ""
echo "📁 Data directories:"
echo "   Downloads: /opt/data/downloads/"
echo "   Music: /opt/data/music/"
echo "   Archive: /opt/data/archive/"
echo ""
echo "🔄 To enable auto-start on boot, add to /etc/rc.local:"
echo "   cd /opt/van-os && docker compose up -d"
