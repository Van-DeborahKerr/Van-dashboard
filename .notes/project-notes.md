# Charlie - Van Dashboard Project
**Owner:** Bill  
**Start Date:** 2026-02-22  
**Objective:** Energy monitoring dashboard for van/home (240V & 12V power tracking)

## Requirements (To Be Confirmed)
- [ ] Hardware/data source identified
- [ ] Display metrics defined (watts, voltage, battery %, trends)
- [ ] Access method confirmed (PC, phone, iPad)
- [ ] Infrastructure decided (local/cloud/Raspberry Pi)

## Infrastructure & Deployment
- **Cloud Tier:** Free tier (lightweight, cost-free)
- **Fallback:** Local PC if memory becomes an issue
- **Cloud Options:** DigitalOcean App Platform, Railway, Render, or Fly.io (all have free tiers)

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

## Next Steps
1. Confirm energy monitoring hardware
2. Design API endpoints
3. Build React dashboard
4. Containerize with Docker
5. Deploy and test
