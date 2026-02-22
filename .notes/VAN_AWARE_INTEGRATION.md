# Charlie + Van-Aware Integration

## Overview
Charlie Dashboard now includes a **Van Map** tab that connects to Van-Aware Live Map for real-time van location tracking.

---

## Setup

### 1. Clone Van-Aware Repository
```bash
git clone https://github.com/Van-DeborahKerr/Van-Aware-Live-Map.git
cd Van-Aware-Live-Map
```

### 2. Run Van-Aware Simulator (WebSocket Server)
```bash
cd simulate
npm install
npm start
```

The simulator will run on `ws://localhost:8080` (or your machine's IP).

### 3. In Charlie Dashboard
1. Go to **Van Map** tab
2. Enter WebSocket URL: `ws://your-van-device-ip:8080`
3. Click **Connect to Map**
4. Live van positions will stream in

---

## Network Access

**Same Network (Van Hotspot):**
```
Simulator IP: 192.168.x.x:8080
Charlie URL: http://192.168.x.x:5000
```

**From Phone/iPad:**
- Connect to van's WiFi hotspot
- Open Charlie at `http://192.168.x.x:5000`
- Switch to Van Map tab
- Enter simulator WebSocket URL

**Remotely (Cloud Charlie):**
- Charlie dashboard accessible from anywhere
- WebSocket URL can be remote simulator or localhost (if on same network)

---

## Features

- **Live Van Tracking** - Real-time position updates
- **Campsite Directory** - Browse markers and visited flags
- **PWA Support** - Works offline
- **Local-First** - No cloud required (runs on your network)

---

## Simulator Options

### Demo Data
Simulator includes demo van positions. Just run and it broadcasts live data.

### Custom Van Positions
Modify `simulate_positions.js` to send real GPS data or custom routes.

---

## Troubleshooting

**WebSocket connection fails:**
- Check simulator is running: `npm start` in `Van-Aware-Live-Map/simulate`
- Verify firewall allows port 8080
- Use correct IP (not localhost if connecting from another device)

**Map not showing:**
- Refresh Charlie dashboard
- Check browser console for errors
- Ensure Van-Aware simulator is sending data

**Performance issues:**
- Close other tabs
- Check network bandwidth
- Reduce update frequency in simulator

---

## Future Integration

Upcoming features:
- Direct GPS feed integration (GPRS, Bluetooth)
- Energy dashboard + map sync
- Route history visualization
- Campsite rating overlay

---

## Privacy & Security

- **Local-first by default** - Runs on your van's network
- **No cloud tracking** - Data stays on your devices
- **PIN-protected Charlie** - Secure access to dashboard + map
- **Private simulator** - Only trusted devices can see positions

For remote access over internet, consider VPN or SSH tunneling instead of exposing ports directly.

---

## Monorepo Structure

```
charlie-van-dashboard/
├── backend/         → Energy API & auth
├── frontend/        → React dashboard (Energy + Map tab)
├── docker/          → Multi-stage Dockerfile
└── docker-compose.yml

Van-Aware-Live-Map/ (external repo)
├── simulate/        → WebSocket simulator
├── scripts/         → Geocoding tools
└── index.html       → Standalone map
```

To integrate further, create a unified backend that feeds both Charlie energy data and Van-Aware map data.
