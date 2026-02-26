#!/bin/bash
# LinknLink iSG Box SE - Bypass HA, Start Docker Services
# Run via SSH or serial console

echo "🚀 Bypassing Home Assistant..."

# Kill HA processes
killall -9 hass 2>/dev/null || true
killall -9 python3 2>/dev/null || true
pkill -9 -f "home.assistant" || true

# Stop HA container
docker stop homeassistant 2>/dev/null || true
docker stop home-assistant 2>/dev/null || true

# Disable HA from starting
systemctl disable homeassistant 2>/dev/null || true
systemctl disable ha-supervisor 2>/dev/null || true

# Create van OS directories
mkdir -p /opt/van-os
mkdir -p /opt/data/{downloads,music,archive}
mkdir -p /opt/ollama

cd /opt/van-os

# Create minimal docker-compose
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  charlie-dashboard:
    image: charlie-van-dashboard:latest
    container_name: charlie
    ports:
      - "5000:5000"
    volumes:
      - /opt/data:/app/data
    restart: unless-stopped
    network_mode: host

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - /opt/ollama:/root/.ollama
    restart: unless-stopped
    network_mode: host
EOF

# Start services
echo "Starting van OS services..."
docker compose up -d

# Wait
sleep 5

# Test
echo ""
echo "✅ Van OS Ready!"
echo "Dashboard: http://192.168.188.1:5000"
echo "Ollama: http://192.168.188.1:11434"
echo ""
docker ps
