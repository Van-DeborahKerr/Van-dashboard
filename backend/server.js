const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple HTML for testing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Charlie - Van Dashboard</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        .container {
          text-align: center;
          padding: 40px;
          max-width: 600px;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin: 10px 0; opacity: 0.9; }
        .login-box {
          background: rgba(0,0,0,0.2);
          padding: 30px;
          border-radius: 10px;
          margin-top: 30px;
        }
        input {
          padding: 12px;
          font-size: 1.1em;
          border: none;
          border-radius: 5px;
          width: 100%;
          margin: 10px 0;
          text-align: center;
          letter-spacing: 2px;
        }
        button {
          padding: 12px 30px;
          background: #00ff96;
          color: #1a1a2e;
          border: none;
          border-radius: 5px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          margin-top: 15px;
          transition: all 0.3s;
        }
        button:hover {
          background: #00cc7f;
          transform: translateY(-2px);
        }
        .features {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }
        .feature {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 8px;
          font-size: 0.9em;
        }
        .feature span { font-size: 2em; display: block; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎧 Charlie</h1>
        <h2 style="font-size: 1.5em; margin-bottom: 20px;">Van Energy Dashboard</h2>
        <p>Built by Charlie • Powered by Bill, Deborah, Minnie & Doris</p>
        
        <div class="login-box">
          <p style="margin-bottom: 20px;">Enter PIN to access dashboard</p>
          <input type="password" id="pin" placeholder="Enter PIN" maxlength="6" value="1234">
          <button onclick="login()">🚀 Access Dashboard</button>
        </div>

        <div class="features">
          <div class="feature"><span>⚡</span>Energy</div>
          <div class="feature"><span>📍</span>Maps</div>
          <div class="feature"><span>🎧</span>DJ</div>
          <div class="feature"><span>✈️</span>Planes</div>
          <div class="feature"><span>💡</span>LED</div>
          <div class="feature"><span>📻</span>Radio</div>
        </div>

        <div class="features" style="margin-top: 20px;">
          <div class="feature"><span>🏕️</span>Campsites</div>
          <div class="feature"><span>🎬</span>Media</div>
          <div class="feature"><span>🧠</span>AI</div>
          <div class="feature"><span>🗺️</span>GPS</div>
        </div>
      </div>

      <script>
        function login() {
          const pin = document.getElementById('pin').value;
          if (pin === '1234' || pin === '') {
            alert('✓ Access Granted!\\n\\nWelcome to Charlie Dashboard');
            // In production, this would redirect to the React app
            console.log('Login successful');
          } else {
            alert('✗ Invalid PIN');
          }
        }
        document.getElementById('pin').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') login();
        });
      </script>
    </body>
    </html>
  `);
});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Charlie Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Charlie Backend running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});
