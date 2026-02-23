# AdGuard Home - Upstream DNS Servers Configuration

## Your Setup
- **Primary Upstream:** 8.8.8.8 (Google DNS)
- **Secondary Upstream:** 1.1.1.1 (Cloudflare DNS)
- **Privacy Upstream:** 9.9.9.9 (Quad9)

---

## What Are Upstream DNS Servers?

Upstream DNS servers are where AdGuard sends DNS queries that aren't blocked by your blocklists.

**Flow:**
```
Your Device
    ↓
AdGuard Home (192.168.188.1:53)
    ↓ (Not in blocklist)
Upstream DNS (8.8.8.8, 1.1.1.1, 9.9.9.9)
    ↓
Internet Resolution
    ↓
Back to Your Device
```

---

## DNS Server Comparison

| Server | Provider | Speed | Privacy | Features |
|--------|----------|-------|---------|----------|
| 8.8.8.8 | Google | ⭐⭐⭐⭐⭐ Fast | ⭐⭐ Logging | DoH, DoT |
| 1.1.1.1 | Cloudflare | ⭐⭐⭐⭐⭐ Very Fast | ⭐⭐⭐⭐ Good | DoH, DoT, DNSSEC |
| 9.9.9.9 | Quad9 | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent | Malware filtering, DNSSEC |

---

## Configuration in AdGuard Home

### Step 1: Access AdGuard Dashboard
```
http://192.168.188.1:3000
```

### Step 2: Go to Settings
- Click **Settings** (left menu)
- Click **DNS Settings** tab

### Step 3: Configure Upstream DNS Servers

Under **Upstream DNS servers**, add:

```
8.8.8.8
1.1.1.1
9.9.9.9
```

**Each URL on a new line.**

### Step 4: Save

Click **Save** button at bottom right.

---

## Advanced: Encrypted DNS (DoH/DoT)

For extra privacy, use encrypted upstream DNS:

```
https://dns.google/dns-query              (Google DoH)
https://cloudflare-dns.com/dns-query      (Cloudflare DoH)
https://dns.quad9.net/dns-query           (Quad9 DoH)

tls://dns.google                          (Google DoT)
tls://1.1.1.1                             (Cloudflare DoT)
tls://dns.quad9.net                       (Quad9 DoT)
```

**Note:** Using HTTPS/TLS upstreams uses more CPU on router. Standard upstreams (8.8.8.8, etc.) are fine for van WiFi.

---

## Recommended Configuration for Charlie's Van

### Standard Setup (Recommended for van)
```
Upstream DNS Servers:
8.8.8.8
1.1.1.1
9.9.9.9
```

**Benefits:**
- ✅ Fast resolution
- ✅ Reliable
- ✅ Low CPU usage
- ✅ Good privacy with Quad9

### Privacy-First Setup (If concerned about tracking)
```
Upstream DNS Servers:
9.9.9.9
1.1.1.1
8.8.8.8
```

**Put Quad9 first** (most privacy-focused)

### Fastest Setup (For slow connections)
```
Upstream DNS Servers:
1.1.1.1
8.8.8.8
9.9.9.9
```

**Cloudflare is fastest network**

---

## How AdGuard Uses Multiple Upstreams

AdGuard can use these strategies:

### 1. **Parallel Queries** (Fastest)
- Sends query to all 3 servers simultaneously
- Uses first response received
- Slowest server doesn't slow you down
- ⭐ **Recommended for van**

### 2. **Fallback** (Most Reliable)
- Tries 8.8.8.8 first
- If no response, tries 1.1.1.1
- If no response, tries 9.9.9.9
- Works even if one server is down

### 3. **Load Balancing** (Even distribution)
- Distributes requests across all 3
- Each handles 1/3 of queries
- Better server load distribution

**AdGuard uses: Parallel Queries by default** ✅

---

## Configuration Steps in Detail

### Step-by-Step with Screenshots

1. **Open AdGuard Dashboard**
   ```
   http://192.168.188.1:3000
   ```

2. **Click Settings**
   - Left sidebar → Settings

3. **Click DNS Settings**
   - Tab at top of Settings page

4. **Find "Upstream DNS servers"**
   - Usually under DNS section

5. **Enter each server (one per line):**
   ```
   8.8.8.8
   1.1.1.1
   9.9.9.9
   ```

6. **Click Save**
   - Button at bottom right

7. **Verify in Query Log**
   - Go to Query Log
   - Watch DNS queries resolve
   - Should see responses from one of the 3 servers

---

## Testing Your Configuration

### Test 1: Check DNS Resolution
```powershell
# On your PC (PowerShell)
nslookup google.com 192.168.188.1
```

Should return IP address (e.g., 142.250.185.46)

### Test 2: Check Which Server Responds
```bash
# On router (SSH)
dig google.com @8.8.8.8
dig google.com @1.1.1.1
dig google.com @9.9.9.9
```

All three should return results.

### Test 3: Check AdGuard Query Log
1. Dashboard → **Query Log**
2. Look at "Upstream" column
3. Should see mix of 8.8.8.8, 1.1.1.1, 9.9.9.9

---

## Failover/Redundancy

If one upstream server fails:

```
Your Query
    ↓
8.8.8.8 (down)
    ↓ TIMEOUT
1.1.1.1 (responds!)
    ↓
Resolution sent to you
```

**This is why having multiple upstreams is smart.** ✅

---

## DNS Privacy Explained

### Google DNS (8.8.8.8)
- **Speed:** Very fast
- **Privacy:** Logs queries (for 48 hours)
- **Best for:** Speed-focused setups
- **Privacy rating:** ⭐⭐

### Cloudflare DNS (1.1.1.1)
- **Speed:** Extremely fast
- **Privacy:** Doesn't log IPs (respects privacy)
- **Best for:** Balance of speed + privacy
- **Privacy rating:** ⭐⭐⭐⭐

### Quad9 DNS (9.9.9.9)
- **Speed:** Good
- **Privacy:** No logging, no tracking
- **Features:** Built-in malware blocking
- **Best for:** Privacy-focused users
- **Privacy rating:** ⭐⭐⭐⭐⭐

---

## For Charlie Dashboard

### Update NETWORK_INVENTORY.md

```markdown
### DNS Configuration
- **Primary Upstream:** 8.8.8.8 (Google)
- **Secondary Upstream:** 1.1.1.1 (Cloudflare)
- **Privacy Upstream:** 9.9.9.9 (Quad9)
- **Query Strategy:** Parallel (fastest response)
- **Failover:** Automatic if server unavailable

### DNS Protection Stack
1. AdGuard Home (192.168.188.1:53)
2. 650,000+ blocklisted domains
3. 3 upstream DNS servers (redundancy)
4. All van WiFi devices protected
```

---

## Complete DNS Setup Summary

```
┌────────────────────────────────────────┐
│     Your Van WiFi Devices              │
│  (Laptop, Phone, iPad, Campers)        │
└───────────────┬────────────────────────┘
                │
        ┌───────▼──────────┐
        │  AdGuard Home    │
        │  192.168.188.1   │
        │  Port 53 (DNS)   │
        └───────┬──────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼──┐   ┌───▼──┐   ┌───▼──┐
│ 8.8.8.8 │ 1.1.1.1 │ 9.9.9.9 │
│ Google  │Cloudfl │ Quad9   │
│         │  are   │ (Privacy)│
└────────┘ └────────┘ └────────┘

+ 650,000+ domain blocklist
= Complete van DNS protection ✅
```

---

## Monitoring DNS Performance

### View Statistics
1. Dashboard → **Statistics**
2. See:
   - DNS queries processed
   - Average response time
   - Blocked percentage
   - Top queries

### Optimize if Needed
If average response time > 50ms:
- Try encrypted upstreams (DoH)
- Check internet connection
- Verify upstream servers are online

---

## Troubleshooting DNS Issues

### DNS Not Resolving
```bash
# SSH into router
ssh admin@192.168.188.1

# Check if AdGuard is running
sudo systemctl status adguardhome

# Check DNS logs
sudo journalctl -u adguardhome -f
```

### Slow DNS Resolution
- Check which upstream is slowest in Query Log
- Remove it, keep fastest 2
- Restart AdGuard

### Can't Reach Upstream Servers
```bash
# On router
ping 8.8.8.8
ping 1.1.1.1
ping 9.9.9.9
```

If any fail, check internet connection.

---

## Security Notes

✅ **Using public DNS is safe** - AdGuard adds privacy layer
✅ **Quad9 adds malware filtering** - Extra protection
✅ **Cloudflare respects privacy** - Doesn't log IPs
✅ **Google is fast** - Trade-off is logging

---

## Configuration Complete Checklist

- ✅ 8.8.8.8 (Google) added
- ✅ 1.1.1.1 (Cloudflare) added
- ✅ 9.9.9.9 (Quad9) added
- ✅ Settings saved
- ✅ Query Log shows all 3 being used
- ✅ DNS resolution working
- ✅ Network Inventory updated

---

## Summary

You now have:
- 🚀 3 redundant DNS upstream servers
- ⚡ Parallel query resolution (fastest response)
- 🔒 Privacy protection (Quad9)
- 🛡️ Malware filtering (Quad9)
- 📊 Query logging & statistics
- ✅ Automatic failover

**All van WiFi devices get this protection!**

---

**Setup Time:** 5 minutes
**Difficulty:** Very Easy
**Benefit:** Enhanced DNS resilience + privacy

Start now! 🚀

---

*Last Updated: 2026-02-23*
*For: Charlie Van Dashboard*
*Router: Kuma (192.168.188.1)*
