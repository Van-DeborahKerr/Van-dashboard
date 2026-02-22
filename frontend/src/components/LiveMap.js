import React, { useState, useEffect } from 'react';
import './LiveMap.css';

function LiveMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [wsUrl, setWsUrl] = useState(localStorage.getItem('van-map-ws-url') || 'ws://localhost:8080');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamically load Leaflet if not already loaded
    if (!window.L) {
      const link = document.createElement('link');
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.async = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  const handleConnect = () => {
    if (!wsUrl) {
      setError('Please enter WebSocket URL');
      return;
    }

    localStorage.setItem('van-map-ws-url', wsUrl);
    setConnected(true);
    setError(null);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  return (
    <div className="live-map">
      <div className="map-config">
        <h3>Van-Aware Live Map</h3>
        
        {!connected ? (
          <div className="config-form">
            {error && <div className="map-error">{error}</div>}
            <div className="form-group">
              <label>WebSocket URL (Simulator)</label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="ws://192.168.1.100:8080"
              />
              <small>Run simulator: npm start in Van-Aware repo</small>
            </div>
            <button className="map-btn" onClick={handleConnect}>
              Connect to Map
            </button>
          </div>
        ) : (
          <div className="map-connected">
            <p>✓ Connected to: {wsUrl}</p>
            <button className="map-btn disconnect" onClick={handleDisconnect}>
              Disconnect
            </button>
            <div className="map-note">
              <p>Embed Van-Aware map iframe or live data here.</p>
              <p>For full integration, run Van-Aware simulator on same network.</p>
            </div>
          </div>
        )}
      </div>

      {connected && mapLoaded && (
        <div className="map-container">
          <div id="van-map" style={{ width: '100%', height: '500px' }}></div>
          <p className="map-instructions">
            Map integration with live van positions. Configure in Van-Aware simulator.
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveMap;
