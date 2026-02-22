# Charlie - Van Dashboard Project
**Owner:** Bill & Deborah Shackel  
**Team:** Minnie (guardian) & Doris (dopey sister) 🐾  
**Start Date:** 2026-02-22  
**Objective:** Energy monitoring dashboard for van/home (240V & 12V power tracking) with AI assistance from our furry team

## Requirements (To Be Confirmed)
- [ ] Hardware/data source identified
- [ ] Display metrics defined (watts, voltage, battery %, trends)
- [ ] Access method confirmed (PC, phone, iPad)
- [ ] Infrastructure decided (local/cloud/Raspberry Pi)

## Infrastructure & Deployment
- **Cloud Tier:** Free tier (lightweight, cost-free)
- **Fallback:** Local PC if memory becomes an issue
- **Cloud Options:** DigitalOcean App Platform, Railway, Render, or Fly.io (all have free tiers)

## Energy Monitoring Hardware & Apps
- **Van Power Station:** AllPowers 2500 Plus (monitors 240V input & 12V battery discharge)
- **Primary Battery:** LiFePO4 Lithium @ DC House 2560 (12V system)
- **Solar:** 2x 250W panels on roof (500W total)
- **MPPT Charge Controller:** Eco Worthy BT 2 (via Bluetooth)
- **Battery-to-Battery Charger:** Sterling Power Pro Bat B2B BB1230 (12V/30A)
- **Data Sources:** AllPowers app, EcoFlow app, Solarmate app (+ Bluetooth MPPT if available)

## Power Flow Architecture
```
240V Hook-up (16A) → AllPowers 2500 Plus → 12V System
                           ↓
                    (if no 240V input)
                    Draws from battery

Solar 500W → MPPT (Eco Worthy BT2) → Battery-to-Battery Charger → DC House 2560 (LiFePO4)
                                              ↓
                                        12V Van System
```

## Key Monitoring Points
1. **240V Input Status** (present or not)
2. **AllPowers Battery %** (discharge state)
3. **LiFePO4 Battery %** (DC House 2560)
4. **Solar Input (Watts)** from MPPT
5. **12V System Load (Watts)**
6. **Charger Status** (Sterling B2B - charging/idle)

## Network Setup
- **Mobile (Van):** Kuma Router on EE network
- **Home (Stationary):** ISG LinkLink SE
- **Note:** Home Assistant login issues on ISG LinkLink SE (to troubleshoot)

## Architecture Plan
```
Van/Home → [Power Sensors] → [Backend API] → [Database] → [Web Dashboard]
                                   ↑
                            Docker Container
                         (Raspberry Pi or PC)
```

## Current Status
- Project structure created
- Awaiting hardware/data source details from Bill

## The Team 🐾

### Minnie - The Guardian
- Sharp, alert rescue dog (4 years old)
- Personality: Focused, practical, detail-oriented
- Role in Charlie: AI assistant for critical alerts and optimization
- Favorite: Making sure everything's running safely

### Doris - The Sweet Sister
- Dopey, lovable rescue dog (4 years old)
- Personality: Friendly, encouraging, slightly silly
- Role in Charlie: AI assistant for encouragement and adventure vibes
- Favorite: Just happy to be along for the journey

### Bill & Deborah
- Van lifers with Minnie & Doris
- Traveling UK in the van
- Home base when not traveling
- Using Charlie to monitor energy, location, and stay connected

## Next Steps
1. Confirm energy monitoring hardware
2. Design API endpoints
3. Build React dashboard
4. Containerize with Docker
5. Deploy and test
