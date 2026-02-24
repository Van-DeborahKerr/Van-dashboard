# LinkLink Hub Flash Plan - Van OS Docker Edition

## Goal
Remove Home Assistant. Flash USB-C powered hub with lean Docker-based van OS (Charlie dashboard + Ollama only).

## Current State
- Hub: Powered via USB-C
- Running: Home Assistant (HA)
- Network: 192.168.188.1 (local)
- Need: Pure van OS, no HA

## Flash Steps

### Step 1: Backup HA Config (Optional)
```bash
ssh admin@192.168.188.1
tar -czf /tmp/ha-backup-$(date +%s).tar.gz /config
scp admin@192.168.188.1:/tmp/ha-backup-*.tar.gz ~/
```

### Step 2: Access Hub Serial Console (USB)
If SSH fails:
1. Get USB-to-Serial adapter (CH340 ~$3)
2. Connect: GND→GND, TX→RX, RX→TX
3. Open PuTTY: COM port, 115200 baud
4. You now have root shell

### Step 3: Check Current OS
```bash
uname -a
df -h
docker ps
```

### Step 4: Stop HA
```bash
docker stop homeassistant
docker rm homeassistant
docker system prune -a --volumes
```

### Step 5: Pull Van OS Base Image
```bash
docker pull alpine:latest
docker pull node:18-alpine
docker pull ollama/ollama:latest
```

### Step 6: Create Van OS Compose File
```bash
cat > /opt/van-os/docker-compose.yml << 'EOF'
version: '3.8'

services:
  charlie-dashboard:
    image: charlie-van-dashboard:latest
    container_name: charlie
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
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

volumes:
  data:
  ollama:
EOF
```

### Step 7: Start Van OS Services
```bash
mkdir -p /opt/van-os /opt/data /opt/ollama
cd /opt/van-os
docker compose up -d
```

### Step 8: Pull Ollama Model
```bash
docker exec ollama ollama pull mistral
# or: docker exec ollama ollama pull neural-chat
```

### Step 9: Verify Running
```bash
docker ps
curl http://localhost:5000/api/health
curl http://localhost:11434/api/tags
```

### Step 10: Enable Auto-Start on Boot
```bash
# Add to /etc/rc.local or crontab
@reboot cd /opt/van-os && docker compose up -d
```

## Network Access (From PC 192.168.188.203)

```bash
# Dashboard
curl http://192.168.188.1:5000

# Ollama
curl http://192.168.188.1:11434/api/tags

# Browser
# http://192.168.188.1:5000 (Charlie dashboard)
```

## Local vs WiFi Button (Dashboard)

### Add to App.js - Network Toggle
```javascript
const [networkMode, setNetworkMode] = useState('local');

const NetworkToggle = () => (
  <div className="network-toggle">
    <button
      className={networkMode === 'local' ? 'active' : ''}
      onClick={() => setNetworkMode('local')}
    >
      📡 Local (192.168.188.x)
    </button>
    <button
      className={networkMode === 'wifi' ? 'active' : ''}
      onClick={() => setNetworkMode('wifi')}
    >
      🌐 WiFi/Internet
    </button>
  </div>
);
```

## Rollback to HA (If Needed)

If van OS fails:
```bash
docker stop charlie ollama
docker rm charlie ollama
docker rmi charlie-van-dashboard:latest ollama/ollama:latest

# Restore HA from backup
tar -xzf ha-backup-*.tar.gz -C /config

docker run -d \
  --name homeassistant \
  -v /config:/config \
  -p 8123:8123 \
  ghcr.io/home-assistant/home-assistant:latest
```

## File Structure

```
/opt/
├── van-os/
│   ├── docker-compose.yml (Charlie + Ollama)
│   └── .env (config)
├── data/
│   ├── charlie.db (dashboard data)
│   └── readings/ (energy logs)
└── ollama/
    ├── models/ (mistral, etc)
    └── config/
```

## Power Consumption

- Hub idle: ~2-3W
- Charlie running: +1W
- Ollama running: +2-3W
- Total: ~5-6W (USB-C powered, perfect for van)

## USB-C Power Connector

- Voltage: 5V
- Minimum current: 2A (10W recommended)
- Hub connector type: Check manual (USB-C standard)
- Safe to use with: Phone charger, solar controller USB-C output, power bank

## Next: YouTube MP4 to MP3

Once van OS is flashed and running, I'll add:
- YouTube URL input field
- Download MP4 to `/opt/data/downloads/`
- Convert to MP3 → `/opt/data/music/`
- Auto-add to Charlie DJ playlist

## Timeline

- Flash van OS: 10-15 min
- Pull Ollama model: 5-10 min
- Test all endpoints: 5 min
- **Total: 20-30 minutes to plug-and-play**

---

Ready to flash the hub now?
