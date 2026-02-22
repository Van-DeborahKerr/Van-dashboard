import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>🎧 Charlie - Van Life Dashboard</h1>
          <p className="tagline">Energy Monitoring • Navigation • Entertainment • AI Assistant</p>
          <p className="subtitle">Built for Bill, Deborah, Minnie & Doris</p>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Energy Dashboard</h3>
          <p>Real-time monitoring of AllPowers, EcoFlow, LiFePO4, and Solar systems. Track battery levels, power draw, and system status.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">📍</span>
          <h3>Van Tracking</h3>
          <p>Live GPS tracking with Van-Aware integration. Know exactly where you are and plan your next adventure.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🏕️</span>
          <h3>Campsite Finder</h3>
          <p>Find dog-friendly campsites near you. Filter by distance, rating, and price. Get instant directions.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🎧</span>
          <h3>DJ Mixer</h3>
          <p>Day and night music modes. Control turntables, faders, and EQ settings. Perfect for entertainment.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">✈️</span>
          <h3>Airplane Tracker</h3>
          <p>Real-time aircraft tracking using NESDR Mini 2. Watch planes flying overhead with live data.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">📻</span>
          <h3>Ham Radio</h3>
          <p>Software-defined radio interface for amateur radio enthusiasts. Monitor 2m and 70cm bands.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">💡</span>
          <h3>LED Control</h3>
          <p>Control 2 Tapo LED strips in your van. Adjust colors, brightness, and lighting modes.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🎬</span>
          <h3>Media Converter</h3>
          <p>Convert MP4 to MP3 and other formats. Drag and drop to convert your video content easily.</p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🧠</span>
          <h3>AI Assistant</h3>
          <p>Meet Minnie (sharp & alert) and Doris (sweet & dopey). Get smart advice about your van systems.</p>
        </div>
      </div>

      <div className="team-section">
        <h2>Meet the Team 🐾</h2>
        <div className="team-grid">
          <div className="team-member">
            <span className="team-icon">🎧</span>
            <h3>Charlie</h3>
            <p>The tech wizard who built this system</p>
          </div>
          <div className="team-member">
            <span className="team-icon">👨</span>
            <h3>Bill</h3>
            <p>Van life adventurer</p>
          </div>
          <div className="team-member">
            <span className="team-icon">👩</span>
            <h3>Deborah</h3>
            <p>Navigation expert</p>
          </div>
          <div className="team-member">
            <span className="team-icon">👀</span>
            <h3>Minnie</h3>
            <p>Sharp guardian dog</p>
          </div>
          <div className="team-member">
            <span className="team-icon">🐾</span>
            <h3>Doris</h3>
            <p>Sweet dopey sister</p>
          </div>
        </div>
      </div>

      <div className="specs-section">
        <h2>Dashboard Specs</h2>
        <div className="specs-grid">
          <div className="spec">
            <strong>10 Tabs</strong>
            <p>Dashboard, Readings, Map, AI, DJ, Planes, LED, Radio, Campsites, Media</p>
          </div>
          <div className="spec">
            <strong>Cloud Ready</strong>
            <p>Deploy to Render, Railway, or Fly.io free tier</p>
          </div>
          <div className="spec">
            <strong>Secure</strong>
            <p>PIN-protected access with authentication</p>
          </div>
          <div className="spec">
            <strong>Responsive</strong>
            <p>Works on PC, phone, and iPad</p>
          </div>
          <div className="spec">
            <strong>Docker</strong>
            <p>Containerized for easy deployment</p>
          </div>
          <div className="spec">
            <strong>Hardware</strong>
            <p>NESDR Mini 2 detected and ready</p>
          </div>
        </div>
      </div>

      <div className="getting-started">
        <h2>Getting Started</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter PIN</h3>
            <p>Default: <code>1234</code></p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Explore Tabs</h3>
            <p>Choose any of 10 features</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Log Energy Data</h3>
            <p>Every 20 minutes from your apps</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Enjoy Adventures</h3>
            <p>Track van, find campsites, have fun!</p>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>🚐 Built by Charlie | Powered by Bill, Deborah, Minnie & Doris</p>
        <p>All 10 tabs ready to use. PIN: <code>1234</code></p>
        <p><strong>Enjoy your van life! 🐾✨</strong></p>
      </div>
    </div>
  );
}

export default Home;
