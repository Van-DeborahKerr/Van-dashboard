# Charlie - Van Dashboard Cloud Deployment

## Option 1: Render (Recommended - Free Tier)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up (free tier available)

2. **Connect GitHub**
   - Link your GitHub account
   - Authorize Render

3. **Deploy**
   - Click "New +" → "Web Service"
   - Select repository: `Van-dashboard`
   - Build command: `npm install --prefix backend && npm run build --prefix frontend`
   - Start command: `node backend/server.js`
   - Environment variables:
     ```
     NODE_ENV=production
     DASHBOARD_PIN=your-secure-pin-here
     ```

4. **Access**
   - Your dashboard: `https://your-app.onrender.com`
   - Default PIN: `1234` (set your own in environment variables)

---

## Option 2: Railway (Free Tier)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy**
   - Click "New Project" → "Deploy from GitHub"
   - Select `Van-dashboard` repo
   - Add environment variables:
     ```
     NODE_ENV=production
     DASHBOARD_PIN=your-secure-pin-here
     PORT=5000
     ```

3. **Access**
   - Your dashboard URL provided by Railway

---

## Option 3: Fly.io (Free Tier)

1. **Install flyctl**
   ```powershell
   choco install flyctl  # Windows
   # or download from https://fly.io/docs/getting-started/installing-flyctl/
   ```

2. **Initialize**
   ```bash
   fly auth login
   fly launch --name charlie-van-dashboard
   ```

3. **Set Environment Variables**
   ```bash
   fly secrets set DASHBOARD_PIN=your-secure-pin-here
   fly secrets set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

---

## Using Your Remote Dashboard

### From PC
```
https://your-app-url.com
PIN: (whatever you set)
```

### From Phone/iPad
- Same URL in browser
- Bookmark for quick access
- Works on WiFi or mobile data

### From Van
- Access via Kuma Router over EE network
- Or use the cloud URL from anywhere

---

## Security Tips

- Change PIN from default `1234` to something unique
- Use HTTPS (all options above provide SSL automatically)
- Don't share your dashboard URL publicly
- PIN is sent in request headers (not visible in URL)

---

## Local Testing Before Cloud Deployment

```bash
cd charlie-van-dashboard

# Set PIN
$env:DASHBOARD_PIN = "my-pin-1234"

# Run with docker-compose
docker-compose up --build

# Access at http://localhost:5000
```

---

## Monitoring Your Deployment

- **Render**: Dashboard → Logs
- **Railway**: Project → Deployments → Logs
- **Fly**: `fly logs`

---

## Free Tier Limits

| Service | Memory | Storage | Bandwidth |
|---------|--------|---------|-----------|
| Render  | 512MB  | None    | Included  |
| Railway | 1GB    | 5GB     | Included  |
| Fly.io  | 3 x shared | Included | Included |

All are sufficient for Charlie's lightweight data logging.
