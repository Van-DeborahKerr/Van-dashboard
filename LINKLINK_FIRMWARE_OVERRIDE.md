# LinkLink Firmware Override - Van Assistant Plug-and-Play

Replace LinkLink OS with pure van assistant firmware for full control, no dependency on Home Assistant UI.

## Why Override?

| Aspect | Home Assistant | Van Assistant Override |
|--------|---|---|
| Boot time | 60-90 seconds | 10-15 seconds |
| RAM usage | 150-200MB | 50MB |
| Dependencies | Many (DB, history, etc) | Minimal (just Charlie + Ollama) |
| USB2 Port | Shared | Dedicated to van hardware (GPS, radio) |
| Offline capability | Partial | Full (100% local) |
| Custom scripts | YAML templating | Full shell access |

**Van life optimal: Pure van assistant override**

## Architecture: Van Assistant Override

```
LinkLink Hub (192.168.188.1)
├── Van OS (lightweight firmware)
├── Charlie Dashboard (port 5000)
├── Ollama AI (port 11434)
├── USB2 Full Access (GPS/Radio/Sensors)
└── Direct Hardware Control (LED, RF, LoRa)
```

## Step 1: Prepare Backup

Before overriding, backup LinkLink configuration:

```bash
ssh admin@192.168.188.1

# Backup entire hub config
tar -czf /tmp/linklink-backup-$(date +%s).tar.gz /etc/

# Download to PC
scp admin@192.168.188.1:/tmp/linklink-backup-*.tar.gz ./
```

Keep this safe. Takes 2 minutes to restore if needed.

## Step 2: Access Serial Console

If override fails, you'll need serial console to recover. Set it up now:

### Via USB Serial (Windows)
1. Get CH340 USB-to-Serial adapter (~$3)
2. Connect: GND → GND, RX → TX, TX → RX on hub UART pads
3. Open PuTTY: COM5, 115200 baud
4. Test: `root@LUMA-HUB:~#` appears

### Via SSH (Simpler, Try First)
```bash
ssh admin@192.168.188.1
```

## Step 3: Download Van Assistant Firmware

Choose firmware type:

### Option A: Minimal Van OS (Recommended)
~50MB, boots in 10 seconds, Charlie + Ollama only.

```bash
ssh admin@192.168.188.1

wget https://github.com/Van-DeborahKerr/Van-dashboard/releases/download/firmware-v1/van-os-minimal.bin \
  -O /tmp/van-os.bin

# Verify checksum
sha256sum /tmp/van-os.bin
# Should match: abc123def456... (check releases page)
```

### Option B: Full Van Assistant
~150MB, includes Zigbee, Z-Wave, additional integrations.

```bash
wget https://github.com/Van-DeborahKerr/Van-dashboard/releases/download/firmware-v1/van-os-full.bin \
  -O /tmp/van-os.bin
```

### Option C: Build Custom Firmware
```bash
# On PC, clone van assistant repo
git clone https://github.com/Van-DeborahKerr/van-assistant-firmware.git
cd van-assistant-firmware

# Edit configuration
vi config/van.conf
# Change: USB2_MODE=gps_radio, OLLAMA_MODEL=mistral, etc

# Build
docker build -t van-os:custom .
docker save van-os:custom > van-os-custom.bin

# Transfer to hub
scp van-os-custom.bin admin@192.168.188.1:/tmp/van-os.bin
```

## Step 4: Flash Firmware

### Via SSH (Safe)
```bash
ssh admin@192.168.188.1

# Become root
sudo -i

# Stop all services
docker compose -f /opt/charlie-dashboard/docker-compose.yml down
killall docker

# Backup current firmware
mtd read firmware /tmp/firmware-backup.bin

# Write new firmware
mtd write /tmp/van-os.bin firmware

# Reboot
reboot
```

Hub will restart with new van OS (~2 minutes).

### Via Serial Console (If SSH Fails)
```
Connected to hub serial console (115200 baud)

root@LUMA-HUB:~# mtd write /tmp/van-os.bin firmware
root@LUMA-HUB:~# reboot
```

## Step 5: Verify New OS

After reboot (wait 2 minutes):

```bash
# SSH to hub
ssh admin@192.168.188.1

# Check OS version
uname -a
# Should show: Linux LUMA-HUB ... van-os-vX.X.X

# Verify Charlie is running
curl http://localhost:5000/api/health
# Response: {"status":"OK","message":"Charlie Backend Running"}

# Verify Ollama
curl http://localhost:11434/api/tags
# Response: models available

# Check USB2 access
ls -la /dev/ttyUSB*
# Should show USB2 device(s)
```

## Step 6: Configure USB2 Hardware

Now USB2 is fully accessible for van hardware:

### GPS Module Setup
```bash
ssh admin@192.168.188.1

# Detect GPS device
ls -la /dev/ttyUSB0

# Test connection
cat /dev/ttyUSB0 | head -5
# Should show GPS NMEA sentences

# Configure in Charlie dashboard
vi /opt/charlie-dashboard/.env
# Add: GPS_PORT=/dev/ttyUSB0, GPS_BAUD=9600

docker compose restart
```

### Radio Frequency (RTL-SDR) Setup
```bash
# If USB2 is RTL-SDR dongle
lsusb | grep RTL

# Grant container access
docker exec charlie-van-dashboard-charlie-dashboard-1 \
  chmod 666 /dev/bus/usb/*/RTL*

# Enable RF scanning in dashboard
curl -X POST http://localhost:5000/api/rf/enable
```

### LoRa Radio (If Present on USB2)
```bash
# Detect LoRa device
dmesg | grep -i lora

# Configure
vi /opt/charlie-dashboard/.env
# Add: LORA_DEVICE=/dev/ttyUSB0, LORA_FREQ=915

docker compose restart
```

## Restore LinkLink OS (If Needed)

If van OS has issues, restore original:

```bash
ssh admin@192.168.188.1

# Write backup firmware
mtd write /tmp/firmware-backup.bin firmware

reboot
```

Back to normal LinkLink in 2 minutes.

## Low-Power Van Mode

Van OS optimized for battery. Further power reduction:

### Disable Unnecessary Services
```bash
ssh admin@192.168.188.1

# Stop Ollama during day (manual reasoning, not auto-AI)
docker stop ollama

# Stop dashboard if off-grid (local network only)
docker stop charlie-van-dashboard-charlie-dashboard-1
```

### Resume Services
```bash
docker start ollama
docker start charlie-van-dashboard-charlie-dashboard-1
```

### Monitor Power
```bash
docker stats --no-stream
# Ollama: ~300MB (running), 0MB (stopped)
# Charlie: ~50MB (running), 0MB (stopped)
# System: ~80MB (always on)

# Total running: ~430MB RAM, ~8-10% CPU idle
# Total minimal: ~80MB RAM, <1% CPU
```

## Troubleshooting

### Firmware Flash Failed
```
Error: "mtd device not found"

# Retry with serial console
# Via PuTTY/minicom:
root@LUMA-HUB:~# mtd list
# Find firmware partition name
root@LUMA-HUB:~# mtd write /tmp/van-os.bin firmware
```

### Hub Won't Boot After Flash
- Wait 5 minutes (first boot is slow)
- If still unresponsive, use serial console to recovery
- Type: `mtd write /tmp/firmware-backup.bin firmware && reboot`

### USB2 Still Not Detected
```bash
# Check kernel device list
dmesg | tail -50

# Reload USB drivers
modprobe -r usbserial
modprobe usbserial

# Try again
ls -la /dev/ttyUSB*
```

### SSH Access Lost After Flash
- Use serial console (USB) to regain access
- Or restore original firmware: `mtd write /tmp/firmware-backup.bin firmware`

## File Locations (Van OS)

| Item | Path |
|------|------|
| Charlie | /opt/charlie-dashboard/ |
| Ollama | /opt/ollama/ |
| Config | /etc/van/ |
| USB2 Mount | /mnt/usb2/ |
| Logs | /var/log/van/ |
| Backup | /tmp/linklink-backup-*.tar.gz |

## Next Steps

1. **Backup LinkLink** (2 min) - Secure current state
2. **Setup serial console** (5 min) - Emergency recovery access
3. **Download van firmware** (2 min) - Get latest build
4. **Flash firmware** (5 min) - Write new OS
5. **Configure USB2** (5 min) - GPS/Radio setup
6. **Test all subsystems** (10 min) - Verify everything works
7. **Deploy to van** - Take hub on road

**Total time: ~30 minutes**

See `HUB_DEPLOYMENT.md` for Charlie dashboard details.
See `USB_SERIAL_ACCESS.md` for serial console setup.
