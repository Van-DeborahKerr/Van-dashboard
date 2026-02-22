# Charlie + Next.js AI Chatbot Integration

## Overview
Charlie Dashboard now includes an **AI Assistant** tab that can connect to a Next.js AI Chatbot for intelligent conversations about your van energy system.

---

## Two Operating Modes

### 1. **Local Mode (Default)**
- No external chatbot needed
- Basic keyword-based responses about energy, solar, batteries
- Runs entirely in Charlie dashboard
- Works offline

### 2. **Connected Mode (Full AI)**
- Connect to a deployed Next.js AI Chatbot
- Full LLM capabilities (OpenAI, xAI, etc.)
- Can answer complex questions
- Requires running chatbot server

---

## Setup Local Mode (Recommended First)

1. In Charlie Dashboard → **AI Assistant** tab
2. Leave the URL field blank or with default `http://localhost:3000`
3. Click **Use Local Mode**
4. Start chatting!

Local responses include:
- "Tell me about the battery" → Battery optimization tips
- "How's the solar?" → Solar panel guidance
- "Where am I?" → Van location integration
- "Weather forecast?" → Weather-based advice

---

## Setup Connected Mode (Full AI)

### Option A: Deploy Next.js Chatbot to Cloud

**Deploy to Vercel (1-click):**
```
https://vercel.com/templates/next.js/nextjs-ai-chatbot
```

1. Click Deploy
2. Configure AI provider (xAI, OpenAI, etc.)
3. Get your deployment URL: `https://your-chatbot.vercel.app`
4. In Charlie AI Assistant → Enter URL
5. Click **Connect to Chatbot**

**Environment Variables Needed:**
```
AI_GATEWAY_API_KEY=your-key
DATABASE_URL=your-database
AUTH_SECRET=random-secret
```

### Option B: Run Locally (Development)

```bash
git clone https://github.com/Van-DeborahKerr/nextjs-ai-chatbot.git
cd nextjs-ai-chatbot
npm install
npm run dev
```

Runs on `http://localhost:3000`

In Charlie:
1. AI Assistant tab
2. Enter: `http://your-van-pc-ip:3000`
3. Click **Connect to Chatbot**

---

## Features in Connected Mode

Once connected to full chatbot:
- **Chat history** - Conversations saved
- **Artifacts** - Generated code, documents, spreadsheets
- **Multi-turn conversations** - Context-aware responses
- **File uploads** - Share logs, data for analysis
- **Web search** - Look up campsites, weather, routes
- **Real-time streaming** - Live response generation

---

## Integration with Charlie Data

The AI Assistant can reference:
- **Energy readings** - Battery %, power draw, solar input
- **Van location** - From Van-Aware Live Map
- **System status** - AllPowers, EcoFlow, LiFePO4, Sterling charger
- **Historical trends** - 24-hour power graphs

Ask it:
- "What was my peak power usage today?"
- "Is solar performing well at this location?"
- "Suggest an efficient charging schedule"
- "What's a good campsite near me?"

---

## API Integration (Future)

To send real-time Charlie data to chatbot:

```javascript
// Send latest reading to chatbot context
const context = {
  battery: latestReading.lifepo4_battery,
  solar: latestReading.solar_watts,
  location: mapLocation,
  timestamp: new Date()
};

// Send with each message
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: userInput,
    context: context
  })
});
```

---

## Running Both Systems

**Terminal 1 - Charlie Dashboard:**
```bash
cd charlie-van-dashboard
docker-compose up
# Runs on http://localhost:5000
```

**Terminal 2 - Next.js AI Chatbot (optional):**
```bash
cd nextjs-ai-chatbot
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - Van-Aware Simulator (optional):**
```bash
cd Van-Aware-Live-Map/simulate
npm start
# Runs on ws://localhost:8080
```

All three systems communicate through Charlie's unified dashboard.

---

## Switching Between Modes

1. AI Assistant tab → Change URL
2. Click **Reconnect** to switch providers
3. Local mode automatically falls back if chatbot unavailable

---

## Environment Variables

Set in `charlie-van-dashboard/.env`:

```
# AI Chatbot
REACT_APP_CHATBOT_URL=http://localhost:3000  # Or cloud URL
REACT_APP_AI_ENABLED=true

# Optional: Pre-populate chatbot session
REACT_APP_CHATBOT_SESSION_ID=your-session-id
```

---

## Troubleshooting

**AI Assistant stuck on "Thinking..."**
- Check chatbot server is running
- Verify URL is correct
- Check network connection
- Browser console for errors

**Local mode not responding**
- Refresh page
- Check browser cache
- Clear localStorage

**Can't connect to remote chatbot**
- Verify deployment is live
- Check CORS is enabled on chatbot
- Use VPN/same network for local development

---

## Cost Considerations

**Local Mode:**
- Free
- No API costs
- Offline capable

**Connected Mode (Cloud):**
- Vercel deployment: ~$10-20/month
- LLM API costs: Variable (xAI, OpenAI, etc.)
- Database: Neon free tier available

Free tier options:
- Vercel: Hobby plan
- Neon: Free Postgres
- xAI: Limited free tier

---

## Next Steps

1. Try local mode first (built-in responses)
2. Deploy chatbot to Vercel if you want full AI
3. Connect Charlie to your chatbot
4. Start asking questions about your van!

Enjoy Charlie with AI-powered insights! 🚐✨
