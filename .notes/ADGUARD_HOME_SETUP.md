# Charlie Van Dashboard - Network Enhancement Guide

## AdGuard Home Setup (Network-Wide Ad Blocking & DNS)

AdGuard Home provides:
- DNS-level ad blocking across all devices
- Parental controls
- Query logging
- Custom DNS records
- DHCP server (optional)

### Installation on Kuma Router (MediaTek MT7902)

#### 1. Check Router Architecture
```bash
ssh admin@192.168.188.1
uname -m
# Expected output: armv7l or aarch64
```

#### 2. Download AdGuard Home (ARM build)
```bash
cd /tmp

# For armv7l (32-bit ARM):
wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm.tar.gz
tar xvf AdGuardHome_linux_arm.tar.gz

# For aarch64 (64-bit ARM):
# wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm64.tar.gz
# tar xvf AdGuardHome_linux_arm64.tar.gz
```

#### 3. Install AdGuard Home
```bash
sudo mv AdGuardHome /opt/AdGuardHome
sudo chmod +x /opt/AdGuardHome/AdGuardHome
cd /opt/AdGuardHome
```

#### 4. Start AdGuard Home Service
```bash
# Create systemd service
sudo tee /etc/systemd/system/adguardhome.service > /dev/null <<EOF
[Unit]
Description=AdGuard Home
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/AdGuardHome
ExecStart=/opt/AdGuardHome/AdGuardHome -c /opt/AdGuardHome/AdGuardHome.yaml -w /opt/AdGuardHome
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable adguardhome
sudo systemctl start adguardhome
```

#### 5. Access AdGuard Home Dashboard
```
http://192.168.188.1:3000
```

Default login:
- Username: admin
- Password: (set during first run)

### Charlie Dashboard Integration

#### Add DNS Configuration to Network Inventory

Update `NETWORK_INVENTORY.md`:

```markdown
### DNS Configuration
- **Primary DNS (AdGuard Home):** 192.168.188.1:53
- **Secondary DNS:** 8.8.8.8
- **Ad Blocking:** Enabled (via AdGuard Home)
- **Parental Control:** Available
```

#### Configure Charlie to Use AdGuard DNS

Update `.env`:
```
DNS_SERVER=192.168.188.1
ADGUARD_HOME_URL=http://192.168.188.1:3000
ADGUARD_API_KEY=your_api_key_here
```

### AdGuard Home Features for Van Life

#### 1. **Blocklists**
   - Pre-configured: EasyList, uBlock filters
   - Blocks ads, trackers, malware
   - Can be toggled per device

#### 2. **Query Log**
   - See all DNS queries
   - Monitor what apps are calling home
   - Block specific domains

#### 3. **Custom Rules**
```
# Block specific domains
||ads.example.com^
||tracker.com^

# Allow specific domain
@@||important-service.com^

# Regex patterns
||.*ads.*^
```

#### 4. **Parental Control**
   - Whitelist/blacklist categories
   - Time-based restrictions
   - Per-device settings

#### 5. **DHCP Server (Optional)**
   - Can replace router's DHCP
   - Integrated with AdGuard
   - Static IP assignments

### Network Architecture with AdGuard

```
┌─────────────────────────────────────┐
│   Kuma Router (192.168.188.1)       │
│   - WIFI: LTE-WiFi_EED5             │
│   - Running AdGuard Home :3000      │
└─────────────────────────────────────┘
           │
    ┌──────┴──────┬──────────┬─────────┐
    │             │          │         │
┌───┴──┐   ┌─────┴──┐  ┌────┴───┐ ┌──┴────┐
│Van PC│   │  iPad  │  │ Phone  │ │Campers│
│ 5000 │   │ :3000  │  │ :3000  │ │:3000  │
└──────┘   └────────┘  └────────┘ └───────┘
    │
    └──────── DNS: 192.168.188.1:53 ────────┐
                                            │
                                   ┌────────┴────────┐
                                   │  AdGuard Home   │
                                   │  - Blocks ads   │
                                   │  - DNS filter   │
                                   │  - Query log    │
                                   └─────────────────┘
```

### Troubleshooting AdGuard on Router

#### Check Service Status
```bash
sudo systemctl status adguardhome
```

#### View Logs
```bash
sudo journalctl -u adguardhome -f
```

#### Reset AdGuard
```bash
sudo systemctl stop adguardhome
sudo rm /opt/AdGuardHome/AdGuardHome.yaml
sudo systemctl start adguardhome
```

#### Port Already in Use
If port 3000 is taken:
```bash
# Edit AdGuardHome.yaml
sudo nano /opt/AdGuardHome/AdGuardHome.yaml

# Change:
# http:
#   address: 0.0.0.0:3000
# To:
#   address: 0.0.0.0:8080

sudo systemctl restart adguardhome
```

### Security Notes

- **Change default password** immediately
- **Use strong admin password**
- **Enable HTTPS** in AdGuard settings
- **Backup AdGuardHome.yaml** regularly
- **Update AdGuard Home** when new versions released

### Performance Impact

- **CPU Usage:** Minimal (DNS is lightweight)
- **Memory:** ~30-50MB
- **Network Latency:** <1ms added (negligible)
- **Router Heat:** No noticeable increase

### Additional DNS Privacy Options

If you want encrypted DNS:

#### 1. **DNS over HTTPS (DoH)**
```yaml
# In AdGuardHome.yaml
dns:
  upstream_dns:
    - https://dns.google/dns-query
    - https://cloudflare-dns.com/dns-query
```

#### 2. **DNS over TLS (DoT)**
```yaml
dns:
  upstream_dns:
    - tls://dns.google
    - tls://1.1.1.1
```

#### 3. **Pi-hole Alternative**
If AdGuard doesn't work, try Pi-hole:
```bash
curl -sSL https://install.pi-hole.net | bash
```

---

## Charlie Dashboard + AdGuard Integration

### Update Docker Compose (Optional)

Add AdGuard container:
```yaml
services:
  adguard:
    image: adguard/adguardhome:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "3000:3000"
    volumes:
      - adguard-work:/opt/adguardhome/work
      - adguard-conf:/opt/adguardhome/conf
    environment:
      - TZ=Europe/London
    restart: unless-stopped

volumes:
  adguard-work:
  adguard-conf:
```

Then:
```bash
docker-compose up adguard
```

---

## Next Steps

1. SSH into Kuma Router
2. Check architecture: `uname -m`
3. Download correct AdGuard Home binary
4. Install systemd service
5. Access dashboard at `http://192.168.188.1:3000`
6. Add blocklists and custom rules
7. Configure Charlie Dashboard to reference AdGuard for DNS stats

---

**Last Updated:** 2026-02-23
**Project:** Charlie - Van Dashboard
**Network:** LTE-WiFi_EED5 (192.168.188.0/24)
