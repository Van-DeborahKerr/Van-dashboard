# Installing AdGuard Home on Kuma Router - Step by Step

## Your Setup
- **Router:** Kuma Router (MediaTek MT7902)
- **Network:** LTE-WiFi_EED5 (192.168.188.0/24)
- **Router IP:** 192.168.188.1
- **Admin Access:** Via SSH

---

## STEP 1: SSH Into Router

Open Command Prompt/PowerShell on your PC and SSH into the router:

```powershell
ssh admin@192.168.188.1
```

You may be asked to accept the host key. Type `yes` and press Enter.

**Expected output:**
```
The authenticity of host '192.168.188.1' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

---

## STEP 2: Check Router Architecture

Once logged in, check what CPU type your router has:

```bash
uname -m
```

**You should see one of:**
- `armv7l` = 32-bit ARM (most common)
- `aarch64` = 64-bit ARM
- `x86_64` = x86 processor

**Note this down - you'll need it for the download.**

---

## STEP 3: Download AdGuard Home

Navigate to `/tmp` directory:

```bash
cd /tmp
```

**For armv7l (most likely):**
```bash
wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm.tar.gz
```

**For aarch64:**
```bash
wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm64.tar.gz
```

**For x86_64:**
```bash
wget https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_amd64.tar.gz
```

Wait for download to complete. You should see progress.

---

## STEP 4: Extract the Archive

```bash
tar xvf AdGuardHome_linux_arm.tar.gz
```

(Replace `_arm` with `_arm64` or `_amd64` if needed)

You'll see file extraction progress.

---

## STEP 5: Install to /opt

```bash
sudo mv AdGuardHome /opt/AdGuardHome
sudo chmod +x /opt/AdGuardHome/AdGuardHome
```

If prompted for password, enter your router admin password.

---

## STEP 6: Create Systemd Service

Create a service file so AdGuard starts automatically:

```bash
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
```

---

## STEP 7: Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable adguardhome
sudo systemctl start adguardhome
```

---

## STEP 8: Verify It's Running

```bash
sudo systemctl status adguardhome
```

You should see:
```
● adguardhome.service - AdGuard Home
   Loaded: loaded (/etc/systemd/system/adguardhome.service; enabled; vendor preset: enabled)
   Active: active (running)
```

If you see `Active: active (running)` ✅ - Success!

---

## STEP 9: Access AdGuard Dashboard

Open your browser and go to:

```
http://192.168.188.1:3000
```

You should see the AdGuard Home setup page!

---

## STEP 10: Initial Setup

1. **Welcome Page** - Click "Get Started"
2. **Admin Interface Settings** - Leave defaults, click "Next"
3. **DNS Server Settings** - Leave defaults, click "Next"
4. **DHCP Server** - Choose "Skip" (optional), click "Next"
5. **Set Password** - Create admin username and password
6. **Final Setup** - Click "Open Dashboard"

Now you're in AdGuard Home! 🎉

---

## STEP 11: Configure Blocklists

1. Go to **Filters** → **DNS blocklists**
2. Enable these blocklists:
   - ✅ AdGuard DNS filter
   - ✅ EasyList
   - ✅ uBlock filters
   - ✅ AdGuard CNAME trackers

3. Click "Save"

---

## STEP 12: Configure Router DNS

Your van WiFi devices need to use AdGuard as their DNS.

**Option A: Automatic (DHCP)**
- Go to **Settings** → **DHCP**
- Enable DHCP server
- Let AdGuard handle it

**Option B: Manual**
- Configure each device's DNS to: `192.168.188.1`

---

## STEP 13: Verify It's Working

On any device on the van WiFi:

**Windows/Mac:**
```powershell
nslookup google.com 192.168.188.1
```

**Linux/Android:**
```bash
dig google.com @192.168.188.1
```

You should see results. If it works, AdGuard is filtering DNS! ✅

---

## Useful Commands

### Check Status
```bash
sudo systemctl status adguardhome
```

### View Live Logs
```bash
sudo journalctl -u adguardhome -f
```

Press `Ctrl+C` to exit.

### Restart Service
```bash
sudo systemctl restart adguardhome
```

### Stop Service
```bash
sudo systemctl stop adguardhome
```

### Start Service
```bash
sudo systemctl start adguardhome
```

---

## Troubleshooting

### Dashboard Won't Load (http://192.168.188.1:3000)

**Check if service is running:**
```bash
sudo systemctl status adguardhome
```

**View error logs:**
```bash
sudo journalctl -u adguardhome -n 50
```

**Restart service:**
```bash
sudo systemctl restart adguardhome
```

### Port 3000 Already in Use

Edit configuration:
```bash
sudo nano /opt/AdGuardHome/AdGuardHome.yaml
```

Find this section:
```yaml
http:
  address: 0.0.0.0:3000
```

Change 3000 to another port (e.g., 8080):
```yaml
http:
  address: 0.0.0.0:8080
```

Press `Ctrl+O` to save, `Ctrl+X` to exit.

Restart:
```bash
sudo systemctl restart adguardhome
```

### High CPU Usage

Disable query logging:
1. Dashboard → Settings → General
2. Query Log → Disable
3. Save

---

## Next Steps for Charlie Dashboard

Once AdGuard is running:

1. **Update Network Inventory**
   ```bash
   # On your PC, edit this file:
   charlie-van-dashboard/.notes/NETWORK_INVENTORY.md
   
   # Add:
   ### DNS Configuration
   - **Primary DNS (AdGuard Home):** 192.168.188.1:53
   - **Ad Blocking Status:** ✅ Active
   ```

2. **All van WiFi devices now get:**
   - ✅ Ad blocking
   - ✅ Tracker blocking
   - ✅ Malware protection
   - ✅ Query logging

3. **Future:** Can add AdGuard stats widget to Charlie Dashboard

---

## Security Notes

⚠️ **Important:**
- ✅ Change your admin password (done in setup)
- ✅ Keep AdGuard updated
- ✅ Backup AdGuardHome.yaml regularly
- ✅ Use HTTPS in production (Settings → HTTPS)

---

## Summary

You now have:
- **Network-wide ad blocking** via AdGuard Home
- **All van WiFi devices** automatically filtered
- **Query logging** to see DNS activity
- **Customizable rules** for specific domains
- **Dashboard** at `http://192.168.188.1:3000`

**Everything integrated with Charlie Van Dashboard!** 🚐

---

**Status:** Ready for installation
**Time Estimate:** 10-15 minutes
**Difficulty:** Easy
**Support:** Check logs if issues: `sudo journalctl -u adguardhome -f`
