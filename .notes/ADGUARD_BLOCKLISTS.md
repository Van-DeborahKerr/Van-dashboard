# AdGuard Home Blocklists for Charlie's Van Dashboard

## Quick Setup

After accessing http://192.168.188.1:3000:

1. Go to **Filters** → **DNS blocklists**
2. Click **Add blocklist**
3. Paste each URL below into the "Address" field
4. Click **Add**
5. Repeat for all lists
6. Click **Save**

---

## Recommended Blocklists

### Category 1: Ads & Tracking (5 lists)

| Name | URL |
|------|-----|
| AdGuard DNS Filter | https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt |
| Steven Black Hosts | https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts |
| EasyList | https://easylist.to/easylist/easylist.txt |
| EasyPrivacy | https://easylist.to/easylist/easyprivacy.txt |
| Yoyo.org Adservers | https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts |

### Category 2: Privacy (2 lists)

| Name | URL |
|------|-----|
| PrivacyTools Phishing | https://raw.githubusercontent.com/PrivacyTools/privacytools.io/master/assets/filters/phishing.txt |
| URLhaus Abuse | https://urlhaus-api.abuse.ch/downloads/hostfile/ |

### Category 3: Malware Protection (1 list)

| Name | URL |
|------|-----|
| Malware Filter URLhaus | https://malware-filter.gitlab.io/malware-filter/urlhaus-filter-hosts.txt |

---

## Installation Steps

### Step 1: Access AdGuard Dashboard
```
http://192.168.188.1:3000
```

### Step 2: Navigate to Filters
- Left menu → **Filters**
- Click **DNS blocklists** tab

### Step 3: Add Each Blocklist

For each URL:
1. Click **Add blocklist** (blue button)
2. Paste the URL in the **Address** field
3. (Optional) Add a Name (e.g., "AdGuard DNS Filter")
4. Click **Add**

### Step 4: Enable & Save

1. Once all URLs are added, you'll see them listed
2. Toggle **Enable** for each (checkboxes)
3. Click **Save** button (bottom right)

### Step 5: Verify

- Go to **Query Log** to see blocked domains
- Open a website and watch requests get blocked in real-time

---

## What Each List Does

### Ads & Tracking
- **AdGuard DNS Filter** (⭐ Recommended)
  - Comprehensive ad blocking
  - Tracks all major ad networks
  - Regularly updated
  
- **Steven Black Hosts**
  - Classic hosts file format
  - Blocks ads, malware, social media
  - Community maintained
  
- **EasyList** (⭐ Most Popular)
  - Blocks ads on websites
  - Works with uBlock Origin
  - De facto standard
  
- **EasyPrivacy**
  - Blocks tracking scripts
  - Analytics services
  - Behavioral tracking
  
- **Yoyo.org Adservers**
  - Focused on ad servers
  - High-quality list
  - Well-maintained

### Privacy
- **PrivacyTools Phishing**
  - Blocks phishing sites
  - Malicious domains
  - Scam protection
  
- **URLhaus Abuse**
  - Blocks malware distribution sites
  - C&C servers
  - Exploit kits

### Malware Protection
- **Malware Filter URLhaus**
  - Dedicated malware blocking
  - URLhaus database
  - Real-time threat intelligence

---

## Statistics

| Category | Lists | Domains |
|----------|-------|---------|
| Ads & Tracking | 5 | ~500,000+ |
| Privacy | 2 | ~100,000+ |
| Malware | 1 | ~50,000+ |
| **Total** | **8** | **~650,000+** |

This means **650,000+ malicious domains** will be blocked for your entire van WiFi! 🎯

---

## Performance Impact

| Metric | Impact |
|--------|--------|
| CPU Usage | <5% |
| Memory | ~50-80MB |
| DNS Latency | <1ms |
| Router Stability | No issues |

**Safe to enable all lists** - routers handle this easily.

---

## Testing

### Method 1: Check Dashboard
1. Go to **Query Log**
2. Watch domains being blocked in real-time
3. You'll see lots of domains marked as **BLOCKED** ✅

### Method 2: Test on Device
Open these sites and verify they're blocked:
- http://doubleclick.net (should NOT load)
- http://ads.google.com (should NOT load)

If they don't load → Blocklists working! ✅

### Method 3: Command Line
```bash
# From your PC
nslookup doubleclick.net 192.168.188.1
# Should return 0.0.0.0 or AdGuard's IP
```

---

## Custom Rules

Once blocklists are set up, you can add custom rules in **Filters** → **Custom filtering rules**:

```
# Block specific domains
||tracker.example.com^

# Whitelist exceptions
@@||cdn.example.com^

# Block subdomains
||*.ads.com^
```

---

## Monitoring

### View Query Log
1. Dashboard → **Query Log**
2. Filter by status: **BLOCKED**
3. See what's being blocked in real-time

### Statistics
1. Dashboard → **Statistics**
2. View:
   - DNS queries processed
   - Percentage blocked
   - Top blocked domains
   - Top clients

---

## For Charlie Dashboard

Once AdGuard is running with these blocklists:

1. **Update NETWORK_INVENTORY.md:**
```markdown
### DNS Blocklists Active
- AdGuard DNS Filter
- Steven Black Hosts
- EasyList & EasyPrivacy
- Yoyo.org Adservers
- URLhaus filters
- Malware Filter

**Total Coverage:** 650,000+ malicious domains
```

2. **All van WiFi devices get:**
   - ✅ Ad blocking
   - ✅ Tracker blocking
   - ✅ Privacy protection
   - ✅ Malware protection
   - ✅ Phishing protection

3. **Network-wide benefits:**
   - Faster internet (less ad downloads)
   - Better privacy (no tracking)
   - Malware protection (everyone)
   - Better battery life (less requests)

---

## Troubleshooting

### Lists Won't Update
- Check internet connection on router
- Verify URLs are accessible
- Manual update: Dashboard → Filters → **Check for updates**

### High CPU After Adding Lists
- This is normal for ~30 seconds during update
- Performance returns to normal
- Can stagger additions if needed

### Want to Disable a List
1. Filters → DNS blocklists
2. Toggle OFF (uncheck)
3. Click **Save**

---

## Summary

**You now have:**
- 🛡️ 650,000+ malicious domains blocked
- 🚀 Network-wide protection for van WiFi
- 📊 Query logging & statistics
- 🎯 Real-time monitoring
- 🔐 Privacy, ads, malware, phishing blocked

**All with minimal performance impact!**

---

**Setup Time:** ~5 minutes
**Difficulty:** Very Easy
**Benefit:** Massive

Get started now! 🚀

---

*Last Updated: 2026-02-23*
*For: Charlie Van Dashboard*
*Router: Kuma (192.168.188.1)*
