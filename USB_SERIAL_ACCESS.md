# LinkLink Hub - USB Serial & SSH Access Guide

Access and configure hub for Charlie dashboard deployment.

## USB Port Types on Hub

Most hub devices have:
- **1x USB-C (Management/Debug)** - UART serial console
- **1-2x USB-A (Extension)** - Standard USB ports
- **1x RJ45 (Ethernet)** - Network

## Method 1: SSH (Recommended - No Hardware Needed)

### Quick SSH
```bash
ssh admin@192.168.188.1
# Default password varies (check hub manual or label)
```

If SSH is disabled, use Method 2 (USB Serial).

## Method 2: USB Serial Console (Full Control)

### Hardware Setup
1. **Get USB-to-Serial adapter**
   - CH340 (cheapest, ~$3)
   - CP2102 (more reliable)
   - FTDI (most expensive but industry standard)

2. **Connect to Hub's UART Pins**
   - Hub typically has 3-4 pads on PCB:
     - GND (Ground) - black wire
     - RX (Receive) - white wire
     - TX (Transmit) - green wire
     - VCC (Power) - red wire (often not needed)

3. **Connect to PC**
   - USB adapter to PC
   - RX → TX on hub
   - TX → RX on hub
   - GND → GND on hub

### Windows: PuTTY Setup
1. Install CH340 driver: https://wiki.keyestudio.com/How_to_use_CH340
2. Device Manager → Find COM port (e.g., COM5)
3. Open PuTTY:
   - Connection type: Serial
   - Serial line: COM5
   - Speed: 115200
   - Data bits: 8, Stop bits: 1, Parity: None
   - Click Open

### Linux/Mac: minicom
```bash
# List ports
ls /dev/tty*

# Connect (replace ttyUSB0 with your port)
minicom -D /dev/ttyUSB0 -b 115200
```

### Hub Console Access
Once connected, press Enter 2-3 times. You'll see:
```
BusyBox v1.27.2 built-in shell (ash)
root@LUMA-HUB:~#
```

You now have **root shell access**.

## Enable SSH on Hub (via Serial Console)

If SSH is disabled, enable it:

```bash
# Check SSH status
/etc/init.d/sshd status

# Enable SSH
uci set network.ssh.enable=1
uci commit
/etc/init.d/sshd restart

# Verify
/etc/init.d/sshd status
# Should show: running
```

Now SSH access works: `ssh admin@192.168.188.1`

## Van Assistant Override via USB Serial

With serial console access, you can:

### 1. Install Ollama (Local AI Reasoning)
```bash
wget https://ollama.ai/install.sh -O - | sh
ollama pull mistral
ollama serve &
```

### 2. Override Default Assistant
```bash
# Edit dashboard config
vi /opt/charlie-dashboard/.env
# Add: OLLAMA_HOST=http://localhost:11434

# Restart dashboard
docker compose restart
```

### 3. Disable Cloud Dependencies
```bash
# Kill any cloud-sync processes
pkill -f "cloud\|openai\|aws"

# Set local-only mode
uci set charlie.ai.mode=local
uci commit
```

### 4. Enable Radio Frequency Access
```bash
# Grant docker access to /dev/rtl_sdr (if hardware present)
docker exec charlie-van-dashboard-charlie-dashboard-1 \
  chmod 666 /dev/rtl*
```

## Firmware Wipe & Reset (Full Control)

If hub is unresponsive:

```bash
# Via serial console, become root
root@LUMA-HUB:~#

# Backup current config
tar -czf /tmp/config-backup.tar.gz /etc/config/

# Reset to factory (WARNING: deletes all config)
mtd erase rootfs_data
reboot
```

## Port Mapping for Van Life

| Function | Port | Access | Notes |
|----------|------|--------|-------|
| Dashboard UI | 5000 | HTTP | Main app (browser) |
| REST API | 5000 | HTTP | Programmatic access |
| Ollama AI | 11434 | HTTP | Local reasoning |
| DJ Mixer | 5001 | WS | Websocket stream |
| Radio Scan | /dev/rtl | Device | Requires RTL-SDR USB |
| GPS | /dev/ttyUSB0 | Serial | USB GPS module |
| LoRa | /dev/ttyUSB1 | Serial | Optional radio module |

## Troubleshooting

### Serial Connection Shows Garbage
- Check baud rate (should be 115200)
- Try 9600 if 115200 doesn't work

### No Hub Response Over Serial
- Check USB adapter is recognized: `lsusb` (Linux/Mac) or Device Manager (Windows)
- Verify TX/RX aren't swapped
- Try touching GND wire first to reset hub

### SSH Times Out
```bash
# Via serial console
netstat -tuln | grep 22
# Should show port 22 listening
```

### Docker Compose Not Available on Hub
```bash
# Install Docker Compose on hub (via serial)
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

## Reference: Default Hub Credentials

| Hub Model | Default User | Default Pass | SSH Port |
|-----------|--------------|--------------|----------|
| LUMA 7 | admin | admin | 22 |
| LUMA Router | admin | admin123 | 22 |
| Generic OpenWrt | root | (password) | 22 |
| Generic DD-WRT | root | admin | 22 |

Check hub manual or label for exact credentials.

## Next Steps

1. **Connect via SSH or Serial**
2. **Enable SSH if needed**
3. **Clone dashboard repo**
4. **Run `docker compose up -d`**
5. **Access at http://192.168.188.1:5000**
6. **Deploy van assistant via Ollama**

See `HUB_DEPLOYMENT.md` for full deployment.
