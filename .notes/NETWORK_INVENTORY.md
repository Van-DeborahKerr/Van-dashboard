# Charlie Van Dashboard - Network & Hardware Inventory

## Network Configuration

### Primary Router (Kuma Router on EE)
**SSID:** LTE-WiFi_EED5
**Protocol:** Wi-Fi 4 (802.11n)
**Security:** WPA2-Personal
**Manufacturer:** MediaTek, Inc.
**Model:** MediaTek Wi-Fi 6E MT7902 Wireless LAN Card
**Driver Version:** 3.4.2.1304
**Network Band:** 2.4 GHz (Channel 1)
**Speed:** 300/300 Mbps (Receive/Transmit)

### Network Details
**IPv4 Address:** 192.168.188.203
**IPv4 Default Gateway:** 192.168.188.1
**IPv4 DNS Servers:** 192.168.188.1 (Unencrypted)
**IPv6 Link-Local:** fe80::3640:2f05:5d75:9aea%6
**MAC Address:** 50:2E:91:7E:E3:92

---

## Hardware Inventory

### Power Systems
- **Van Power Station:** AllPowers 2500 Plus
- **Primary Battery:** LiFePO4 Lithium @ DC House 2560 (12V)
- **Solar Panels:** 2x 250W (500W total) on roof
- **MPPT Charge Controller:** Eco Worthy BT 2 (Bluetooth)
- **Battery-to-Battery Charger:** Sterling Power Pro Bat B2B BB1230 (12V/30A)
- **Inverter:** AllPowers (240V/12V)
- **Hook-up:** 240V @ 16A input

### Radio & Monitoring
- **SDR Dongle:** NESDR Mini 2 (RTL-SDR)
  - **Vendor ID:** 0BDA
  - **Product ID:** 2838
  - **Status:** Connected & Detected ✓
  - **Frequency Range:** 24-1700 MHz
  - **Use Cases:** ADS-B tracking, ham radio monitoring, aircraft tracking

### Lighting & Control
- **LED Strips:** 2x Tapo LED (controllable via Tapo app)
- **LED Strip Set 1:** Ambient lighting
- **LED Strip Set 2:** Accent lighting
- **Control Method:** Tapo app integration with Charlie Dashboard

### Entertainment & Media
- **DJ Equipment:** (Software-based in Charlie Dashboard)
- **Projector:** Aurzen (controlled via 433MHz IR)
- **TV:** LG (web-based control)
- **Speakers:** Bluetooth speaker for TV sound
- **Media Conversion:** MP4 to MP3/AAC/WAV/FLAC (via Charlie Dashboard)

### Navigation & Tracking
- **Primary Map System:** Van-Aware Live Map (WebSocket)
- **GPS Tracking:** Integrated in Dashboard
- **Router/Hotspot:** Kuma Router (EE network)
- **Backup Location:** ISG LinkLink SE (at home)

### Temperature & Environment
- **Van Temperature Monitoring:** Required for Minnie & Doris comfort
- **Climate Control:** Needs integration with LED controls for ambient settings

### Computing Devices
- **Van PC:** Running Charlie Dashboard
- **Router IP:** 192.168.188.1
- **PC IP:** 192.168.188.203
- **Backup:** Home ISG LinkLink SE

---

## Network Access Points

### Local (Van WiFi - Kuma Router)
- Dashboard: `http://192.168.188.203:5000`
- API: `http://192.168.188.203:5000/api`
- Van-Aware: `ws://192.168.188.1:8080` (if simulator running)

### Home (ISG LinkLink SE)
- Access via ISG network when at home base
- Note: Occasionally has Home Assistant login issues

### Remote (Cloud - TBD)
- Render/Railway/Fly.io deployment
- URL: `https://your-charlie-dashboard.onrender.com` (example)

---

## Team & Crew

### Humans
- **Bill** - Van lifer, captain
- **Deborah** - Co-navigator, adventure partner
- **Charlie** - Tech wizard (AI-assisted)

### Canine Crew
- **Minnie** - 4-year-old rescue dog, sharp guardian (AI personality)
- **Doris** - 4-year-old rescue dog, sweet dopey sister (AI personality)

---

## Software Stack

- **Backend:** Node.js + Express + SQLite
- **Frontend:** React (11 tabs)
- **Container:** Docker + docker-compose
- **Authentication:** PIN-based (default: 1234)
- **Data Polling:** 20-minute intervals
- **Cloud Ready:** Render, Railway, Fly.io free tier

---

## Integration Points

- **AllPowers App** → Energy readings
- **EcoFlow App** → Battery data
- **Solarmate App** → Solar input data
- **NESDR Mini 2** → ADS-B aircraft tracking
- **Van-Aware** → Live map & GPS
- **Tapo App** → LED strip control
- **Next.js AI Chatbot** → Optional full AI integration
- **Google Maps** → Campsite directions

---

## Connectivity Status

- ✅ WiFi: Connected (LTE-WiFi_EED5)
- ✅ Network: 192.168.188.0/24
- ✅ Internet: Via Kuma Router (EE)
- ✅ NESDR Mini 2: Detected (VID_0BDA:PID_2838)
- ✅ Dashboard: Running on port 5000
- 🟡 AI Chatbot: Optional (not yet deployed)
- 🟡 Home ISG: Available (with login issues)

---

## Next Steps

1. Test dashboard access from phone/iPad on van WiFi
2. Integrate real energy data from apps
3. Test ADS-B tracking with NESDR Mini 2
4. Configure Tapo LED strips
5. Deploy to cloud for remote access
6. Resolve ISG Home Assistant login issues
7. Optional: Deploy AI chatbot

---

**Last Updated:** 2026-02-22
**Project:** Charlie - Van Dashboard
**Repository:** https://github.com/Van-DeborahKerr/Van-dashboard.git
