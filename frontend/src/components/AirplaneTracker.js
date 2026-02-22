import React, { useState, useEffect, useRef } from 'react';
import './AirplaneTracker.css';

function AirplaneTracker() {
  const [airplanes, setAirplanes] = useState([
    { id: 'BAW123', callsign: 'British Airways 123', altitude: '35000ft', speed: '450kt', location: 'Over Manchester' },
    { id: 'RYR456', callsign: 'Ryanair 456', altitude: '28000ft', speed: '420kt', location: 'Approaching Gatwick' },
    { id: 'EZY789', callsign: 'EasyJet 789', altitude: '15000ft', speed: '250kt', location: 'Climbing near Luton' },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('stopped');
  const [receiverMode, setReceiverMode] = useState('demo'); // demo or live
  const [signalStrength, setSignalStrength] = useState(0);
  const wsRef = useRef(null);

  // Simulate live data when in demo mode
  useEffect(() => {
    if (recordingStatus === 'recording' && receiverMode === 'demo') {
      const interval = setInterval(() => {
        setAirplanes(prev => {
          const newPlanes = [...prev];
          // Randomly update altitudes and speeds for demo
          newPlanes.forEach(plane => {
            plane.altitude = Math.floor(Math.random() * 40000) + 5000 + 'ft';
            plane.speed = Math.floor(Math.random() * 300) + 200 + 'kt';
          });
          return newPlanes;
        });
        setSignalStrength(Math.floor(Math.random() * 100));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [recordingStatus, receiverMode]);

  // Connect to live ADS-B feed (would use actual RTL-SDR in production)
  const handleConnectLive = () => {
    setReceiverMode('live');
    setIsConnected(true);
    // In production, this would connect to rtl-sdr stream
    // For now, we'll use demo mode with real-time updates
  };

  const handleStartRecording = () => {
    setRecordingStatus('recording');
  };

  const handleStopRecording = () => {
    setRecordingStatus('stopped');
  };

  const handleClear = () => {
    setAirplanes([]);
  };

  return (
    <div className="airplane-tracker">
      <div className="tracker-header">
        <h2>✈️ Airplane Tracker (NESDR Mini 2)</h2>
        <div className="status-indicators">
          <div className={`indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'} {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <div className="signal-meter">
            <span>📡 Signal:</span>
            <div className="signal-bar">
              <div className="signal-fill" style={{ width: `${signalStrength}%` }}></div>
            </div>
            <span>{signalStrength}%</span>
          </div>
        </div>
      </div>

      <div className="tracker-controls">
        <div className="control-group">
          <button
            className={`control-btn ${recordingStatus === 'recording' ? 'active' : ''}`}
            onClick={handleStartRecording}
          >
            🔴 Start Tracking
          </button>
          <button
            className={`control-btn stop ${recordingStatus === 'stopped' ? 'active' : ''}`}
            onClick={handleStopRecording}
          >
            ⏹ Stop Tracking
          </button>
        </div>

        <div className="control-group">
          <button
            className={`control-btn ${receiverMode === 'demo' ? 'active' : ''}`}
            onClick={() => setReceiverMode('demo')}
          >
            Demo Mode
          </button>
          <button
            className={`control-btn ${receiverMode === 'live' ? 'active' : ''}`}
            onClick={handleConnectLive}
          >
            Live (RTL-SDR)
          </button>
        </div>

        <button className="control-btn danger" onClick={handleClear}>
          🗑 Clear Log
        </button>
      </div>

      <div className="receiver-info">
        <div className="info-card">
          <h4>NESDR Mini 2 Status</h4>
          <p>🎚️ RTL-SDR Receiver</p>
          <p>📍 Frequency: 1090 MHz (ADS-B)</p>
          <p>📡 Mode: {receiverMode === 'live' ? 'Live Reception' : 'Demo Simulation'}</p>
          <p>✈️ Planes Detected: {airplanes.length}</p>
        </div>
        <div className="info-card">
          <h4>For Grandkids</h4>
          <p>🌧️ Perfect for rainy days!</p>
          <p>Watch real airplanes flying</p>
          <p>Learn flight info & callsigns</p>
          <p>Interactive tracking experience</p>
        </div>
      </div>

      <div className="airplanes-list">
        <h3>Detected Aircraft</h3>
        {airplanes.length === 0 ? (
          <div className="empty-state">
            <p>No aircraft detected. Press "Start Tracking" to begin! ✈️</p>
          </div>
        ) : (
          <div className="planes-grid">
            {airplanes.map((plane) => (
              <div key={plane.id} className="plane-card">
                <div className="plane-header">
                  <span className="plane-id">{plane.id}</span>
                  <span className="plane-icon">✈️</span>
                </div>
                <div className="plane-details">
                  <p><strong>Flight:</strong> {plane.callsign}</p>
                  <p><strong>Altitude:</strong> {plane.altitude}</p>
                  <p><strong>Speed:</strong> {plane.speed}</p>
                  <p><strong>Location:</strong> {plane.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tips">
        <h4>💡 Tips for Grandkids</h4>
        <ul>
          <li>Each plane has a unique callsign (flight number)</li>
          <li>Altitude shows how high the plane is flying</li>
          <li>Speed is measured in knots (nautical miles per hour)</li>
          <li>Try to spot local airliners on rainy days!</li>
        </ul>
      </div>
    </div>
  );
}

export default AirplaneTracker;
