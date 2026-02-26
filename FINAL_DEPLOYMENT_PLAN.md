# LinknLink iSG Box SE - Final Deployment Plan

## Current Access
- FTP: 192.168.188.78:2036
- Network: 192.168.188.1 (hub)
- PC: 192.168.188.203

## Option 1: Keep Existing OS + Disable HA (Fast)
**Time: 5 minutes**

Via FTP or SSH:
```bash
# Stop HA
docker stop homeassistant
systemctl disable homeassistant

# Create van OS compose
mkdir -p /opt/van-os
cat > /opt/van-os/docker-compose.yml << 'EOF'
version: '3.8'
services:
  charlie-dashboard:
    image: charlie-van-dashboard:latest
    container_name: charlie
    ports: ["5000:5000"]
    volumes: ["/opt/data:/app/data"]
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports: ["11434:11434"]
    volumes: ["/opt/ollama:/root/.ollama"]
    restart: unless-stopped
EOF

# Start services
cd /opt/van-os
docker compose up -d
```

**Result:** Charlie on 5000, HA disabled but OS unchanged

---

## Option 2: Flash Fresh OS (Full Reset)
**Time: 30 minutes**

### Prerequisites
- Windows PC
- USB A-to-A cable
- Rockchip Driver Assistant (installed)
- FactoryTool.exe (downloaded)
- iSG Box SE OS image (MD5: 290E585B8373BFCAFBAB2EC24B312377)

### Steps
1. Extract FactoryTool, open FactoryTool.exe
2. Click Firmware → Select OS .img file
3. Click Run (tool waits for device)
4. Find reset button hole (bottom of AV jack)
5. Insert paperclip/screwdriver into hole, press reset button
6. While holding reset, connect USB A-to-A cable to **USB2 port** on iSG Box
7. Release reset when FactoryTool detects device
8. Wait for flash to complete (green progress bar)
9. Disconnect cable, power on iSG Box
10. Boot into fresh OS (2-3 minutes)
11. SSH in and run van OS setup

**Then:** Run BYPASS_HA_START_DOCKER.sh to start Charlie + Ollama

---

## Recommendation

**🟢 Option 1 (Fastest)** - Use existing OS, just disable HA
- Pro: No flashing, no risk of bricking
- Pro: 5 minutes done
- Pro: Same reliable hardware
- Con: Keeps iSG/HA framework (uses more RAM)

**🟡 Option 2 (Cleanest)** - Fresh OS image
- Pro: Pure Linux, minimal overhead
- Pro: Full control, no HA bloat
- Con: 30 minutes + flashing tools needed
- Con: Small risk if interrupted

---

## I Recommend: Option 1 ✅

**Why:**
1. Hub is already stable
2. HA just needs to be stopped
3. Docker runs fine on top
4. No flashing risk
5. 5 minutes vs 30 minutes

**Command to run via FTP terminal:**

```bash
# Connect via FTP, open terminal, paste:

docker stop homeassistant 2>/dev/null || true
systemctl disable homeassistant 2>/dev/null || true
mkdir -p /opt/van-os /opt/data /opt/ollama

cat > /opt/van-os/docker-compose.yml << 'EOF'
version: '3.8'
services:
  charlie-dashboard:
    image: charlie-van-dashboard:latest
    container_name: charlie
    ports: ["5000:5000"]
    volumes: ["/opt/data:/app/data"]
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports: ["11434:11434"]
    volumes: ["/opt/ollama:/root/.ollama"]
    restart: unless-stopped
EOF

cd /opt/van-os && docker compose up -d
docker exec ollama ollama pull mistral

echo "✅ Charlie on 5000, Ollama on 11434"
```

---

## Next Steps

1. **Choose Option 1 or 2**
2. **If Option 1:** Run the command above via FTP terminal
3. **If Option 2:** Get USB cable + FactoryTool ready, I'll guide through flashing
4. **Test:** Open http://192.168.188.1:5000

**Which option?** Tell me and I'll finish it.
