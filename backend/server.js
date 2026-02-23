const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PIN authentication middleware
const AUTH_PIN = process.env.AUTH_PIN || '1234';
const requireAuth = (req, res, next) => {
  const pin = req.headers['x-dashboard-pin'];
  if (pin !== AUTH_PIN) {
    return res.status(401).json({ error: 'Invalid PIN' });
  }
  next();
};

// ============ HEALTH & STATUS ============
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Charlie Backend Running',
    environment: process.env.NODE_ENV || 'development',
    auth_enabled: true,
    timestamp: new Date().toISOString()
  });
});

// ============ CAMPSITE FINDER ============
app.post('/api/camps/find', requireAuth, (req, res) => {
  const { search, lat, lon, radius } = req.body;
  
  // Mock campsite data - replace with real API calls (Hipcamp, FreeRoam, iExit, etc)
  const mockCampsites = [
    {
      id: 1,
      name: 'Rocky Mountain Dog Park',
      town: 'Boulder',
      county: 'Boulder',
      rating: 4.8,
      price: 25,
      distance: 5.2,
      dogFriendly: true,
      lat: 40.0150,
      lon: -105.2705,
      amenities: ['Water', 'Picnic Table', 'Fire Ring']
    },
    {
      id: 2,
      name: 'Peaceful Valley Campground',
      town: 'Lyons',
      county: 'Boulder',
      rating: 4.6,
      price: 20,
      distance: 12.3,
      dogFriendly: true,
      lat: 40.2266,
      lon: -105.2782,
      amenities: ['River Access', 'Hiking', 'Pet Friendly']
    },
    {
      id: 3,
      name: 'High Country Retreat',
      town: 'Nederland',
      county: 'Boulder',
      rating: 4.9,
      price: 30,
      distance: 23.5,
      dogFriendly: true,
      lat: 40.0451,
      lon: -105.5037,
      amenities: ['Mountain Views', 'Fishing', 'Dog Area']
    }
  ];

  // Filter by search term (town, county, or name)
  const filtered = mockCampsites.filter(camp => {
    const query = search.toLowerCase();
    return camp.name.toLowerCase().includes(query) ||
           camp.town.toLowerCase().includes(query) ||
           camp.county.toLowerCase().includes(query);
  });

  res.json({
    status: 'OK',
    total: filtered.length,
    results: filtered,
    search_used: search
  });
});

// ============ DJ MIXER ============
app.post('/api/dj/next', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    action: 'next',
    now_playing: {
      title: 'Midnight Drive (Next Track)',
      artist: 'Synthwave Masters',
      duration: '3:45'
    },
    queue_position: 2
  });
});

app.post('/api/dj/stop', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    action: 'stop',
    message: 'DJ stopped'
  });
});

app.get('/api/dj/status', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    playing: true,
    current_track: {
      title: 'Night Mode Ambient',
      artist: 'Chill Vibes',
      duration: '2:30',
      position: '1:15'
    },
    mode: 'night'
  });
});

// ============ RADIO / RF SCANNER ============
app.post('/api/rf/scan', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    action: 'scan',
    message: 'RF scan initiated',
    hardware: 'NESDR Mini 2 detected',
    frequencies_found: [
      { freq: '146.52', signal: -75, mode: 'FM' },
      { freq: '146.55', signal: -82, mode: 'FM' },
      { freq: '162.55', signal: -65, mode: 'FM', note: 'NOAA Weather' }
    ]
  });
});

app.get('/api/rf/status', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    hardware: 'RTL-SDR detected',
    active: true,
    current_freq: '146.52',
    signal_strength: -75
  });
});

// ============ LED CONTROL (Tapo) ============
app.post('/api/led/set', requireAuth, (req, res) => {
  const { brightness, color, mode } = req.body;
  res.json({
    status: 'OK',
    action: 'set',
    brightness: brightness || 100,
    color: color || '#ff6b9d',
    mode: mode || 'static',
    strips_updated: 2
  });
});

app.get('/api/led/status', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    strips: [
      { id: 1, brightness: 80, color: '#ff6b9d', on: true },
      { id: 2, brightness: 60, color: '#c44569', on: true }
    ]
  });
});

// ============ HAM RADIO ============
app.post('/api/radio/tune', requireAuth, (req, res) => {
  const { frequency, mode } = req.body;
  res.json({
    status: 'OK',
    frequency: frequency || '146.52',
    mode: mode || 'FM',
    tuned: true,
    signal_strength: -78
  });
});

app.get('/api/radio/frequencies', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    common_frequencies: [
      { freq: '146.52', name: 'National Calling' },
      { freq: '146.55', name: 'Local Repeater' },
      { freq: '162.55', name: 'NOAA Weather' },
      { freq: '121.5', name: 'Aviation Emergency' }
    ]
  });
});

// ============ AIRPLANE TRACKER ============
app.get('/api/planes/nearby', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    hardware: 'NESDR Mini 2',
    planes_detected: [
      { callsign: 'UAL456', altitude: 35000, speed: 485, direction: 'NE' },
      { callsign: 'DAL789', altitude: 28000, speed: 450, direction: 'SE' },
      { callsign: 'SWA123', altitude: 22000, speed: 380, direction: 'W' }
    ],
    timestamp: new Date().toISOString()
  });
});

// ============ MEDIA CONVERTER ============
app.post('/api/media/convert', requireAuth, (req, res) => {
  const { input_format, output_format, file } = req.body;
  res.json({
    status: 'OK',
    action: 'convert',
    from: input_format || 'mp4',
    to: output_format || 'mp3',
    progress: 100,
    output_file: 'converted_media.mp3'
  });
});

// ============ DATA ENTRY / READINGS ============
app.post('/api/readings/add', requireAuth, (req, res) => {
  const { battery_soc, solar_power, load_watts, temperature } = req.body;
  res.json({
    status: 'OK',
    action: 'reading_added',
    data: {
      battery_soc: battery_soc || 0,
      solar_power: solar_power || 0,
      load_watts: load_watts || 0,
      temperature: temperature || 0,
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/readings/latest', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    battery_soc: 75,
    solar_power: 250,
    load_watts: 45,
    temperature: 22,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/readings/24h', requireAuth, (req, res) => {
  res.json({
    status: 'OK',
    readings: [
      { time: '00:00', soc: 60, solar: 0, load: 40 },
      { time: '06:00', soc: 65, solar: 50, load: 45 },
      { time: '12:00', soc: 85, solar: 400, load: 100 },
      { time: '18:00', soc: 80, solar: 100, load: 80 },
      { time: '23:00', soc: 75, solar: 0, load: 50 }
    ]
  });
});

// ============ AI ASSISTANT (Minnie & Doris) ============
app.post('/api/ai/ask', requireAuth, (req, res) => {
  const { question } = req.body;
  
  // Mock AI responses based on question
  const responses = {
    'battery': 'Battery is at 75%. Solar generating 250W. You\'re good for another 6 hours at current load. - Minnie (the sharp one)',
    'where': 'You\'re near Boulder, CO. Great van life spot! - Doris (the sweet one)',
    'weather': 'Sunny today, high 72°F. Perfect camping weather! - Minnie',
    'default': 'Ask me about battery, solar, camping, or navigation! - Minnie & Doris'
  };

  let answer = responses.default;
  for (const [key, value] of Object.entries(responses)) {
    if (question.toLowerCase().includes(key)) {
      answer = value;
      break;
    }
  }

  res.json({
    status: 'OK',
    question: question,
    answer: answer,
    timestamp: new Date().toISOString()
  });
});

// ============ FALLBACK ROUTES ============
app.get('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Serve React index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Charlie Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Auth enabled: true (PIN: ${AUTH_PIN})`);
  console.log(`Open: http://localhost:${PORT}`);
});
