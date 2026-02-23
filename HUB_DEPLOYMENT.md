# Charlie Dashboard - Hub Deployment Guide

Deploy Charlie dashboard directly on the hub (192.168.188.1) for persistent local operation.

## Prerequisites

- Hub with SSH access enabled
- Hub has Docker installed (or compatible runtime)
- Hub has sufficient disk space (~500MB)
- Network: hub on 192.168.188.1, PC on 192.168.188.203

## Quick Deploy (5 minutes)

### 1. SSH into Hub
```bash
ssh admin@192.168.188.1
# Password: [your hub admin password]
```

### 2. Clone Dashboard Repo
```bash
git clone https://github.com/Van-DeborahKerr/Van-dashboard.git /opt/charlie-dashboard
cd /opt/charlie-dashboard
```

### 3. Build & Run with Docker Compose
```bash
docker compose up -d --build
```

Dashboard accessible at: **http://192.168.188.1:5000**

### 4. Verify Running
```bash
docker ps | grep charlie
curl http://192.168.188.1:5000/api/health
```

## Configuration

### Environment Variables
Edit `docker-compose.yml` to customize:
```yaml
environment:
  NODE_ENV: production
  PORT: 5000
  DB_PATH: /app/data/charlie.db
```

### Data Persistence
SQLite database stored in Docker volume `charlie-data`. Data survives container restarts.

### Access from PC (192.168.188.203)
```bash
curl http://192.168.188.1:5000
# or open browser: http://192.168.188.1:5000
```

## Low-Power Mode (Van Life)

For extended runtime on battery:

### Stop Services When Not Needed
```bash
ssh admin@192.168.188.1
docker compose stop
```

### Auto-Start on Hub Boot
Add to hub crontab:
```bash
@reboot cd /opt/charlie-dashboard && docker compose up -d
```

### Monitor Power Usage
```bash
ssh admin@192.168.188.1
docker stats --no-stream
```

Expected idle: 50-100MB RAM, <5% CPU

## Troubleshooting

### Dashboard Returns Blank Page
```bash
ssh admin@192.168.188.1
docker logs charlie-van-dashboard-charlie-dashboard-1
```

### Port 5000 Already in Use
```bash
docker compose down
docker compose up -d
```

### Can't Connect from PC
```bash
# Test network from PC:
ping 192.168.188.1
curl -v http://192.168.188.1:5000
```

### SSH Connection Refused
Hub may need SSH enabled. Check hub admin console or try USB serial console access.

## USB Serial Access (If SSH Unavailable)

### Serial Console Method
1. Connect hub USB to PC
2. Install CH340 driver (if needed)
3. Access via `minicom` / `PuTTY` at 115200 baud
4. Enable SSH: `uci set network.ssh.enable=1 && uci commit && /etc/init.d/sshd restart`

## Backup & Restore

### Backup Dashboard Data
```bash
ssh admin@192.168.188.1
docker exec charlie-van-dashboard-charlie-dashboard-1 tar -czf /app/data/backup.tar.gz /app/data/charlie.db
scp admin@192.168.188.1:/app/data/backup.tar.gz ./charlie-backup.tar.gz
```

### Restore
```bash
scp ./charlie-backup.tar.gz admin@192.168.188.1:/tmp/
ssh admin@192.168.188.1
docker exec charlie-van-dashboard-charlie-dashboard-1 tar -xzf /tmp/backup.tar.gz -C /app/data/
```

## Next: Van Assistant Integration

Once deployed:
1. Test all 11 dashboard tabs
2. Configure Ollama AI integration (local reasoning)
3. Set up radio frequency scanning
4. Enable GPS tracking & campsite finder

See `ARCHITECTURE.md` for system design.
