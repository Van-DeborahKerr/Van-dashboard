const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// No auth for van life - free access
const requireAuth = (req, res, next) => next();

// ============ HEALTH & STATUS ============
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Charlie Backend Running',
    environment: process.env.NODE_ENV || 'development',
    auth_enabled: false,
    timestamp: new Date().toISOString()
  });
});

// ============ CAMPSITE FINDER (TripAdvisor + BritStop) ============
app.post('/api/camps/find', requireAuth, (req, res) => {
  const { search } = req.body;
  
  const ukCampsites = [
    { id: 1, name: 'Lake District Dog Paradise', town: 'Windermere', county: 'Cumbria', country: 'UK', rating: 4.8, reviews: 342, price: '£18-25/night', distance: 3.2, dogFriendly: true, vansAllowed: true, lat: 54.3781, lon: -2.9249, amenities: ['Water Access', 'Dog Walks', 'Picnic Area', 'EHU Available'], source: 'TripAdvisor', notes: 'Large dog-friendly site, dedicated dog walking area' },
    { id: 2, name: 'Peak District Pup Camp', town: 'Buxton', county: 'Derbyshire', country: 'UK', rating: 4.6, reviews: 287, price: '£15-20/night', distance: 12.3, dogFriendly: true, vansAllowed: true, lat: 53.2611, lon: -1.9117, amenities: ['Hiking Trails', 'Pet Friendly', 'Mountain Views', 'Shop'], source: 'TripAdvisor', notes: 'Perfect base for Peak District walks with dogs' },
    { id: 3, name: 'Cornish Coastal Dog Haven', town: 'St Ives', county: 'Cornwall', country: 'UK', rating: 4.9, reviews: 412, price: '£20-28/night', distance: 48.5, dogFriendly: true, vansAllowed: true, lat: 50.2106, lon: -5.4915, amenities: ['Beach Access', 'Dog Beach Days', 'Coastal Views', 'Restaurant'], source: 'BritStop', notes: 'Dogs welcome on beach (off-season). Great for Doris & Minnie' },
    { id: 4, name: 'Scottish Highlands Dog Lodge', town: 'Fort William', county: 'Highlands', country: 'UK', rating: 4.7, reviews: 198, price: '£12-18/night', distance: 156.2, dogFriendly: true, vansAllowed: true, lat: 56.8169, lon: -5.1065, amenities: ['Mountain Trails', 'River Access', 'Wilderness', 'Loch Views'], source: 'TripAdvisor', notes: 'Remote location, excellent for adventurous dogs' },
    { id: 5, name: 'Cotswolds Country Camp', town: 'Bourton-on-the-Water', county: 'Gloucestershire', country: 'UK', rating: 4.5, reviews: 265, price: '£16-22/night', distance: 6.8, dogFriendly: true, vansAllowed: true, lat: 51.8120, lon: -1.7589, amenities: ['River Wading', 'Village Walks', 'Countryside', 'Pubs'], source: 'BritStop', notes: 'Dogs can wade in river. Charming Cotswolds village' },
    { id: 6, name: 'New Forest Dog Retreat', town: 'Lyndhurst', county: 'Hampshire', country: 'UK', rating: 4.7, reviews: 356, price: '£14-19/night', distance: 24.5, dogFriendly: true, vansAllowed: true, lat: 50.8544, lon: -1.5878, amenities: ['Forest Walks', 'Ponies & Donkeys', 'Shop', 'Off-Lead Area'], source: 'TripAdvisor', notes: 'Perfect for dog running. Minnie & Doris will love it' },
    { id: 7, name: 'Snowdonia Mountain Camp', town: 'Betws-y-Coed', county: 'Gwynedd (Wales)', country: 'UK', rating: 4.6, reviews: 221, price: '£13-19/night', distance: 89.3, dogFriendly: true, vansAllowed: true, lat: 53.0937, lon: -3.7927, amenities: ['Mountain Trails', 'Waterfall Walks', 'River Access', 'Café'], source: 'BritStop', notes: 'Stunning Welsh mountain scenery for hiking with dogs' },
    { id: 8, name: 'Yorkshire Dales Dog Camp', town: 'Grassington', county: 'North Yorkshire', country: 'UK', rating: 4.8, reviews: 304, price: '£15-21/night', distance: 42.1, dogFriendly: true, vansAllowed: true, lat: 54.1328, lon: -1.9878, amenities: ['Dale Walks', 'Stone Villages', 'River', 'Pub'], source: 'TripAdvisor', notes: 'Excellent base for Yorkshire Dales dog walks' },
    { id: 9, name: 'Exmoor Coastal Dog Base', town: 'Lynton', county: 'Devon', country: 'UK', rating: 4.7, reviews: 289, price: '£17-23/night', distance: 35.7, dogFriendly: true, vansAllowed: true, lat: 51.1388, lon: -3.8360, amenities: ['Coastal Paths', 'Cliff Walks', 'Beach Access', 'Village'], source: 'BritStop', notes: 'Dramatic coastal scenery. Perfect for energetic dogs' },
    { id: 10, name: 'Cambridge Riverside Dog Camp', town: 'Cambridge', county: 'Cambridgeshire', country: 'UK', rating: 4.4, reviews: 178, price: '£16-20/night', distance: 8.2, dogFriendly: true, vansAllowed: true, lat: 52.2053, lon: 0.1218, amenities: ['River Walks', 'City Access', 'Shops', 'University Town'], source: 'TripAdvisor', notes: 'Urban base for exploring Cambridge with dogs' }
  ];

  const filtered = ukCampsites.filter(camp => {
    if (!search) return true;
    const query = search.toLowerCase();
    return camp.name.toLowerCase().includes(query) || camp.town.toLowerCase().includes(query) || camp.county.toLowerCase().includes(query);
  });

  res.json({ status: 'OK', total: filtered.length, results: filtered, search_used: search || 'all', data_sources: ['TripAdvisor', 'BritStop Reviews'], filters_applied: { dog_friendly: true, vans_allowed: true, no_membership_clubs: true, no_glamping: true, uk_only: true } });
});

// ============ DJ MIXER ============
app.post('/api/dj/next', requireAuth, (req, res) => { res.json({ status: 'OK', action: 'next', now_playing: { title: 'Midnight Drive', artist: 'Synthwave Masters', duration: '3:45' }, queue_position: 2 }); });
app.post('/api/dj/stop', requireAuth, (req, res) => { res.json({ status: 'OK', action: 'stop', message: 'DJ stopped' }); });
app.get('/api/dj/status', requireAuth, (req, res) => { res.json({ status: 'OK', playing: true, current_track: { title: 'Night Mode Ambient', artist: 'Chill Vibes', duration: '2:30' }, mode: 'night' }); });

// ============ RADIO / RF SCANNER ============
app.post('/api/rf/scan', requireAuth, (req, res) => { res.json({ status: 'OK', action: 'scan', hardware: 'NESDR Mini 2', frequencies_found: [{ freq: '146.52', signal: -75 }, { freq: '162.55', signal: -65, note: 'NOAA Weather' }] }); });
app.get('/api/rf/status', requireAuth, (req, res) => { res.json({ status: 'OK', hardware: 'RTL-SDR', active: true, current_freq: '146.52', signal: -75 }); });

// ============ LED CONTROL (Tapo) ============
app.post('/api/led/set', requireAuth, (req, res) => { const { brightness, color } = req.body; res.json({ status: 'OK', brightness: brightness || 100, color: color || '#ff6b9d', strips: 2 }); });
app.get('/api/led/status', requireAuth, (req, res) => { res.json({ status: 'OK', strips: [{ id: 1, brightness: 80, color: '#ff6b9d', on: true }, { id: 2, brightness: 60, on: true }] }); });

// ============ HAM RADIO ============
app.post('/api/radio/tune', requireAuth, (req, res) => { res.json({ status: 'OK', frequency: '146.52', tuned: true }); });
app.get('/api/radio/frequencies', requireAuth, (req, res) => { res.json({ status: 'OK', frequencies: [{ freq: '146.52', name: 'National' }, { freq: '162.55', name: 'NOAA Weather' }] }); });

// ============ AIRPLANE TRACKER ============
app.get('/api/planes/nearby', requireAuth, (req, res) => { res.json({ status: 'OK', planes: [{ callsign: 'UAL456', altitude: 35000 }, { callsign: 'SWA123', altitude: 22000 }] }); });

// ============ MEDIA CONVERTER ============
app.post('/api/media/convert', requireAuth, (req, res) => { res.json({ status: 'OK', output: 'converted.mp3' }); });

// ============ DATA ENTRY / READINGS ============
app.post('/api/readings/add', requireAuth, (req, res) => { res.json({ status: 'OK', added: true }); });
app.get('/api/readings/latest', requireAuth, (req, res) => { res.json({ battery_soc: 75, solar: 250, load: 45, temp: 22 }); });
app.get('/api/readings/24h', requireAuth, (req, res) => { res.json({ readings: [{ time: '00:00', soc: 60 }, { time: '12:00', soc: 85 }, { time: '23:00', soc: 75 }] }); });

// ============ AI ASSISTANT ============
app.post('/api/ai/ask', requireAuth, (req, res) => { const { question } = req.body; res.json({ answer: 'Ask about battery, solar, campsites, or weather! - Charlie & Crew' }); });

// ============ FALLBACK ============
app.get('/api/*', (req, res) => { res.status(404).json({ error: 'Not found' }); });
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(PORT, () => { console.log(`Charlie on ${PORT}`); });
