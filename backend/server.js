require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const PIN = process.env.DASHBOARD_PIN || '1234';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Authentication middleware
const checkPin = (req, res, next) => {
  const pin = req.headers['x-dashboard-pin'] || req.query.pin;
  
  if (PIN === 'disabled') {
    return next(); // No auth required in dev
  }
  
  if (!pin || pin !== PIN) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or missing PIN.' });
  }
  
  next();
};

// Database setup
const dbPath = path.join(__dirname, 'data', 'charlie.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      allpowers_battery INTEGER,
      allpowers_watts INTEGER,
      allpowers_voltage REAL,
      allpowers_240v_input BOOLEAN,
      ecoflow_battery INTEGER,
      ecoflow_watts INTEGER,
      ecoflow_voltage REAL,
      lifepo4_battery INTEGER,
      lifepo4_voltage REAL,
      solar_watts INTEGER,
      solar_voltage REAL,
      system_load_watts INTEGER,
      charger_status TEXT
    )
  `);
});

// SERVE STATIC FILES FIRST (no auth needed for HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Health check (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Charlie Backend Running',
    environment: NODE_ENV,
    auth_enabled: PIN !== 'disabled'
  });
});

// API Routes (with PIN auth)

// POST - Add new reading
app.post('/api/readings', checkPin, (req, res) => {
  const {
    allpowers_battery,
    allpowers_watts,
    allpowers_voltage,
    allpowers_240v_input,
    ecoflow_battery,
    ecoflow_watts,
    ecoflow_voltage,
    lifepo4_battery,
    lifepo4_voltage,
    solar_watts,
    solar_voltage,
    system_load_watts,
    charger_status
  } = req.body;

  const query = `
    INSERT INTO readings (
      allpowers_battery, allpowers_watts, allpowers_voltage, allpowers_240v_input,
      ecoflow_battery, ecoflow_watts, ecoflow_voltage,
      lifepo4_battery, lifepo4_voltage,
      solar_watts, solar_voltage,
      system_load_watts, charger_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    allpowers_battery, allpowers_watts, allpowers_voltage, allpowers_240v_input,
    ecoflow_battery, ecoflow_watts, ecoflow_voltage,
    lifepo4_battery, lifepo4_voltage,
    solar_watts, solar_voltage,
    system_load_watts, charger_status
  ];

  db.run(query, values, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Reading added successfully' });
    }
  });
});

// GET - Latest reading
app.get('/api/readings/latest', checkPin, (req, res) => {
  const query = `SELECT * FROM readings ORDER BY timestamp DESC LIMIT 1`;
  db.get(query, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row || {});
    }
  });
});

// GET - Last 24 hours of readings
app.get('/api/readings/24h', checkPin, (req, res) => {
  const query = `
    SELECT * FROM readings 
    WHERE timestamp >= datetime('now', '-24 hours')
    ORDER BY timestamp DESC
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows || []);
    }
  });
});

// GET - Stats endpoint
app.get('/api/data/stats', checkPin, (req, res) => {
  const query = `
    SELECT 
      AVG(allpowers_battery) as avg_allpowers_battery,
      AVG(ecoflow_battery) as avg_ecoflow_battery,
      AVG(lifepo4_battery) as avg_lifepo4_battery,
      AVG(solar_watts) as avg_solar_watts,
      MAX(allpowers_watts) as max_allpowers_watts,
      COUNT(*) as total_readings
    FROM readings 
    WHERE timestamp >= datetime('now', '-24 hours')
  `;
  db.get(query, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row || {});
    }
  });
});

// SPA fallback - serve index.html for any route not matching API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Charlie Backend running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Auth enabled: ${PIN !== 'disabled'}`);
});

module.exports = app;
