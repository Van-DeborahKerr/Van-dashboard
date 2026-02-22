const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// API Routes

// POST - Add new reading
app.post('/api/readings', (req, res) => {
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
app.get('/api/readings/latest', (req, res) => {
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
app.get('/api/readings/24h', (req, res) => {
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

// GET - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Charlie Backend Running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Charlie Backend running on port ${PORT}`);
});

module.exports = app;
