# LinkLink Hub - USB2 Home Assistant Plug-and-Play Setup

Enable Home Assistant directly on LinkLink hub via USB2 port for automated van life management.

## Overview

**LinkLink Hub USB2 Purpose:**
- USB2 is typically the **extension/accessory port**
- Can mount USB storage, devices, or passthrough to containers
- Home Assistant runs as Docker service on hub OS
- Dashboard (Charlie) runs alongside on same hub

## Architecture

```
LinkLink Hub (192.168.188.1)
├── Home Assistant (port 8123) ← USB2 for device access
├── Charlie Dashboard (port 5000)
└── Ollama AI (port 11434)
```

All accessible from 192.168.188.203 (PC) and van network.

## Quick Deploy: Home Assistant on USB2

### Prerequisites
- Hub has Docker + Docker Compose installed
- USB2 port is free
- 2GB+ available disk space

### Step 1: SSH into Hub
```bash
ssh admin@192.168.188.1
```

### Step 2: Create Home Assistant Container

Create `/opt/home-assistant/docker-compose.yml`:

```yaml
version: '3.8'

services:
  home-assistant:
    image: ghcr.io/home-assistant/home-assistant:latest
    container_name: home-assistant
    restart: unless-stopped
    privileged: true
    network_mode: host
    volumes:
      - home-assistant-config:/config
      - /run/dbus:/run/dbus:ro
      - /dev:/dev:ro  # USB2 device access
    environment:
      TZ: UTC
    ports:
      - "8123:8123"

  # Optional: Zigbee/Matter coordination (if USB2 is Zigbee stick)
  zigbee2mqtt:
    image: koenkk/zigbee2mqtt:latest
    container_name: zigbee2mqtt
    restart: unless-stopped
    volumes:
      - zigbee2mqtt-config:/app/data
      - /run/udev:/run/udev:ro
      - /dev/ttyUSB0:/dev/ttyUSB0  # If USB2 is Zigbee device
    environment:
      TZ: UTC
    ports:
      - "8080:8080"
    depends_on:
      - home-assistant

volumes:
  home-assistant-config:
  zigbee2mqtt-config:
```

### Step 3: Deploy
```bash
mkdir -p /opt/home-assistant
cd /opt/home-assistant

# Create docker-compose.yml (paste above YAML)
vi docker-compose.yml

# Start services
docker compose up -d
```

### Step 4: Access & Configure
- **From PC:** http://192.168.188.1:8123
- **Setup wizard** runs on first access
- Create admin account
- Configure timezone: UTC (or your location)

### Step 5: Auto-Start on Hub Boot
```bash
# Add to hub crontab
crontab -e

# Add this line:
@reboot cd /opt/home-assistant && docker compose up -d
```

## USB2 Device Detection

### Check What's on USB2
```bash
ssh admin@192.168.188.1

# List USB devices
lsusb

# Check device path
ls -la /dev/ttyUSB*
ls -la /dev/tty*
```

### Common USB2 Devices

| Device | Path | Home Assistant Integration |
|--------|------|---------------------------|
| Zigbee Stick (Sonoff, ITEAD) | /dev/ttyUSB0 | Zigbee2MQTT or ZHA |
| Z-Wave Controller | /dev/ttyUSB0 | Z-Wave JS |
| RTL-SDR (Radio) | /dev/bus/usb/* | RTL433 addon |
| GPS Module | /dev/ttyUSB0 | GPS integration |
| Environmental Sensor | /dev/ttyUSB0 | MQTT or serial addon |

### Grant Container Access to USB2
```bash
docker exec home-assistant \
  chown root:dialout /dev/ttyUSB0
docker exec home-assistant \
  chmod 666 /dev/ttyUSB0
```

## Home Assistant + Charlie Dashboard Integration

Both services run on same hub. Integrate them:

### Add Charlie Dashboard as Custom Integration
In Home Assistant:
1. Go to Settings → Devices & Services → Custom Repositories
2. Add: `https://github.com/Van-DeborahKerr/Van-dashboard`
3. Install as custom component
4. Configure API endpoint: `http://localhost:5000/api`

### Automation Examples

**Monitor Charlie Battery Status in Home Assistant:**
```yaml
# /config/automations.yaml
- alias: "Low Battery Alert"
  trigger:
    platform: template
    value_template: "{{ state_attr('sensor.charlie_battery', 'soc') | float(0) < 20 }}"
  action:
    service: notify.mobile_app_van
    data:
      message: "Charlie battery below 20%"
      title: "Van Alert"
```

**Control van systems from Home Assistant UI:**
```yaml
- alias: "DJ Auto-Start at Sunset"
  trigger:
    platform: sun
    event: sunset
  action:
    service: rest_command.dj_start
    data:
      url: "http://localhost:5000/api/dj/start"
```

## Low-Power Mode (Van Battery Life)

Home Assistant typically uses 100-150MB RAM, 5-10% CPU idle.

### Disable Heavy Integrations
```bash
# Via Home Assistant UI:
Settings → System → Stop unnecessary services
```

### Stop Services on Low Battery
```bash
# Create automation in Home Assistant
- alias: "Stop HA on Low Battery"
  trigger:
    platform: numeric_state
    entity_id: sensor.charlie_battery
    below: 15
  action:
    service: homeassistant.stop
```

### Monitor Power Usage
```bash
ssh admin@192.168.188.1
docker stats home-assistant
```

## Troubleshooting

### USB2 Device Not Found
```bash
ssh admin@192.168.188.1

# Check dmesg logs
dmesg | grep -i usb | tail -20

# Verify container has device access
docker exec home-assistant ls -la /dev/
```

### Home Assistant Slow/Unresponsive
```bash
# Check hub disk space
df -h

# Free up space
docker system prune -a --volumes

# Restart HA
docker compose restart home-assistant
```

### USB2 Permissions Error in Container
```bash
# Run HA with proper permissions
docker compose down
docker compose up -d --privileged
```

## USB2 Override for Van Assistant

If USB2 is unplugged or you want full van control:

### Install LinkLink Override Firmware
This replaces Home Assistant with pure van assistant:

```bash
ssh admin@192.168.188.1

# Backup current config
tar -czf /tmp/linklink-backup.tar.gz /etc/

# Flash van assistant firmware
wget https://github.com/your-van-assistant/firmware/releases/download/latest/van-os.bin
mtd write van-os.bin firmware
reboot
```

After reboot: van assistant runs natively, full control.

## File Locations

| Item | Path |
|------|------|
| Home Assistant Config | /opt/home-assistant/home-assistant-config/ |
| Zigbee2MQTT Config | /opt/home-assistant/zigbee2mqtt-config/ |
| Docker Compose | /opt/home-assistant/docker-compose.yml |
| Cron (auto-start) | crontab -e |
| Hub OS Config | /etc/config/ |

## Next Steps

1. **Check USB2 device type** - `lsusb` on hub
2. **Deploy Home Assistant** - Follow Step 1-4 above
3. **Test Charlie API from HA** - Create automation
4. **Configure USB2 integration** - Zigbee/Z-Wave/GPS
5. **Setup van assistant fallback** - Local Ollama override

See `HUB_DEPLOYMENT.md` for Charlie dashboard info.
See `USB_SERIAL_ACCESS.md` for emergency console access.
