const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

});

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Charlie Backend Running' });
});

// Fallback: serve React index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Charlie Backend running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});
