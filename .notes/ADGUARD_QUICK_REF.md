# AdGuard Home - Quick Reference

## Installation (One Command)

```bash
# SSH into router first
ssh admin@192.168.188.1

# Then run the installer
bash < <(curl -s https://raw.githubusercontent.com/Van-DeborahKerr/Van-dashboard/master/.notes/install-adguard.sh)
```

Or manually:
```bash
cd /tmp
wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm.tar.gz
tar xvf AdGuardHome_linux_arm.tar.gz
sudo mv AdGuardHome /opt/AdGuardHome
sudo chmod +x /opt/AdGuardHome/AdGuardHome
cd /opt/AdGuardHome && sudo ./AdGuardHome
```

## Access Dashboard

```
http://192.168.188.1:3000
```

## Essential Commands

| Command | Purpose |
|---------|---------|
| `sudo systemctl status adguardhome` | Check if running |
| `sudo journalctl -u adguardhome -f` | View live logs |
| `sudo systemctl restart adguardhome` | Restart service |
| `sudo systemctl stop adguardhome` | Stop service |
| `sudo systemctl start adguardhome` | Start service |

## Network Setup

### Set AdGuard as Primary DNS

**In Router Settings (192.168.188.1):**
1. Go to DHCP/DNS settings
2. Set Primary DNS: `127.0.0.1`
3. Set Secondary DNS: `8.8.8.8`
4. Save and restart

### Verify DNS is Working

```bash
# On any device on the network
nslookup google.com 192.168.188.1

# Should resolve and show 192.168.188.1 as server
```

## Initial Configuration

### 1. Set Admin Password
- Dashboard → Settings → Users
- Add strong password

### 2. Add Blocklists
- Filters → DNS blocklists
- Enable:
  - EasyList
  - uBlock filters
  - AdGuard CNAME trackers

### 3. Enable Query Log
- Settings → General
- Enable query log
- Set retention: 7 days

### 4. Parental Control (Optional)
- Parental control → Enable
- Select categories to block
- Add allowed/blocked domains

## Troubleshooting

### Port 3000 Already in Use
```bash
# Edit config
sudo nano /opt/AdGuardHome/AdGuardHome.yaml

# Change http port
# http:
#   address: 0.0.0.0:8080

sudo systemctl restart adguardhome
```

### Service Won't Start
```bash
# Check logs
sudo journalctl -u adguardhome -n 50

# Reset config
sudo systemctl stop adguardhome
sudo rm /opt/AdGuardHome/AdGuardHome.yaml
sudo systemctl start adguardhome
```

### High CPU Usage
```bash
# Disable query log
# Or reduce retention period
# Settings → General → Query log retention
```

## Custom DNS Rules

Add in Filters → Custom filtering rules:

```
# Block ads
||ads.google.com^
||doubleclick.net^

# Block trackers  
||google-analytics.com^
||facebook.com^

# Allow important service
@@||cdn.example.com^

# Block entire category
||*.ads.com^
```

## Performance

- **CPU:** < 5% (minimal)
- **Memory:** ~40MB
- **DNS Latency:** < 1ms
- **Network Impact:** Negligible

## Security

- ✅ Change default password
- ✅ Use strong credentials
- ✅ Enable HTTPS (Settings)
- ✅ Backup AdGuardHome.yaml
- ✅ Keep updated

## For Charlie Dashboard

Once AdGuard is running:
1. Update `NETWORK_INVENTORY.md` with DNS info
2. Note query logs for monitoring
3. Can integrate stats into Charlie later
4. All van WiFi devices get automatic filtering

---

**Status:** Ready for installation
**Router:** Kuma (MediaTek MT7902)
**Network:** 192.168.188.0/24
**Dashboard Port:** 3000
