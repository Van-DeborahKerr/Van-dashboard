# LinkLink Hub Flash via Serial Console

## Quick Steps

### 1. Connect USB Serial Cable
- Get CH340 USB-to-Serial adapter (~$3)
- Connect: GND→GND, RX→TX, TX→RX
- Open PuTTY: COM5 (or your port), 115200 baud

### 2. Get Root Shell
Press Enter a few times until you see:
```
root@LUMA-HUB:~#
```

### 3. Verify Docker
```bash
docker ps
docker version
```

### 4. Download Flash Script
```bash
cd /tmp
wget https://raw.githubusercontent.com/Van-DeborahKerr/Van-dashboard/feature/hub-deployment-ssh/FLASH_VAN_OS.sh
chmod +x FLASH_VAN_OS.sh
```

### 5. Run Flash Script
```bash
./FLASH_VAN_OS.sh
```

**This will:**
- Stop Home Assistant
- Remove old containers
- Create van OS directories
- Build Charlie dashboard
- Start services
- Pull Ollama model (mistral)
- Verify everything works

### 6. Test (After 5 min)
From PC (192.168.188.203):
```bash
curl http://192.168.188.1:5000/api/health
curl http://192.168.188.1:11434/api/tags
```

Should see:
```
{"status":"OK","message":"Charlie Backend Running",...}
{"models":[{"name":"mistral:latest",...}]}
```

### 7. Enable Auto-Start
```bash
echo "@reboot cd /opt/van-os && docker compose up -d" | crontab -
```

---

## If Script Fails

### Manual Steps
```bash
# 1. Stop HA
docker stop homeassistant
docker rm homeassistant

# 2. Create directories
mkdir -p /opt/van-os /opt/data /opt/ollama

# 3. Create docker-compose.yml (copy from VAN_OS_FLASH_PLAN.md)
vi /opt/van-os/docker-compose.yml

# 4. Build Charlie
cd /tmp
git clone https://github.com/Van-DeborahKerr/Van-dashboard.git
cd Van-dashboard
docker build -t charlie-van-dashboard:latest -f docker/Dockerfile .

# 5. Start services
cd /opt/van-os
docker compose up -d

# 6. Pull model
docker exec ollama ollama pull mistral

# 7. Test
curl http://localhost:5000/api/health
```

## Rollback to HA
```bash
docker stop charlie ollama
docker rm charlie ollama
docker rmi charlie-van-dashboard:latest ollama/ollama:latest

# Restore HA (if you kept backup)
docker run -d --name homeassistant \
  -v /config:/config \
  -p 8123:8123 \
  ghcr.io/home-assistant/home-assistant:latest
```

---

## Troubleshooting

### SSH Times Out
- Use serial console instead
- SSH may be blocked by HA

### Docker Image Pull Fails
- Check internet: `ping 8.8.8.8`
- Retry pull: `docker pull node:18-alpine`

### Ollama Pull Slow
- Takes 5-10 min for mistral (4GB)
- Don't interrupt - let it finish

### Services Won't Start
- Check logs: `docker logs charlie`
- Check compose: `docker compose config`
- Free disk: `docker system df`

### USB Serial Not Found
- Windows: Install CH340 driver
- Linux: `lsusb` to find port
- Mac: `ls /dev/tty.*`

---

## Success Indicators

✅ **Docker compose up -d** - No errors
✅ **docker ps** - Shows charlie + ollama running
✅ **curl http://localhost:5000/api/health** - Returns JSON
✅ **curl http://localhost:11434/api/tags** - Shows mistral
✅ **Browser: http://192.168.188.1:5000** - Dashboard loads

---

**Total time: 20-30 minutes** (mostly waiting for image pulls)
