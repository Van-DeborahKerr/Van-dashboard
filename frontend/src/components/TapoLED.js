import React, { useState, useEffect } from 'react';
import './TapoLED.css';

function TapoLED() {
  const [ledStrips, setLedStrips] = useState([
    {
      id: 1,
      name: 'Strip 1 - Ambient',
      isOn: true,
      brightness: 75,
      color: '#ff6b6b',
      mode: 'static',
      connected: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      name: 'Strip 2 - Accent',
      isOn: true,
      brightness: 60,
      color: '#4ecdc4',
      mode: 'static',
      connected: true,
      ip: '192.168.1.101'
    }
  ]);

  const colors = [
    { name: 'Red', hex: '#ff6b6b' },
    { name: 'Blue', hex: '#4ecdc4' },
    { name: 'Green', hex: '#95e1d3' },
    { name: 'Purple', hex: '#c7a8ff' },
    { name: 'Orange', hex: '#ffd93d' },
    { name: 'Pink', hex: '#ff8ec7' },
    { name: 'Cyan', hex: '#00d4ff' },
    { name: 'White', hex: '#ffffff' },
  ];

  const modes = ['Static', 'Strobe', 'Rainbow', 'Fade', 'Pulse'];

  const handleToggle = (id) => {
    setLedStrips(prev => prev.map(strip =>
      strip.id === id ? { ...strip, isOn: !strip.isOn } : strip
    ));
  };

  const handleBrightness = (id, value) => {
    setLedStrips(prev => prev.map(strip =>
      strip.id === id ? { ...strip, brightness: value } : strip
    ));
  };

  const handleColor = (id, color) => {
    setLedStrips(prev => prev.map(strip =>
      strip.id === id ? { ...strip, color: color } : strip
    ));
  };

  const handleMode = (id, mode) => {
    setLedStrips(prev => prev.map(strip =>
      strip.id === id ? { ...strip, mode: mode.toLowerCase() } : strip
    ));
  };

  const handleAllOn = () => {
    setLedStrips(prev => prev.map(strip => ({ ...strip, isOn: true })));
  };

  const handleAllOff = () => {
    setLedStrips(prev => prev.map(strip => ({ ...strip, isOn: false })));
  };

  const handleAllColor = (color) => {
    setLedStrips(prev => prev.map(strip => ({ ...strip, color })));
  };

  return (
    <div className="tapo-led">
      <div className="led-header">
        <h2>💡 Tapo LED Strip Control</h2>
        <p>Control 2 LED strips in your van</p>
      </div>

      <div className="global-controls">
        <h3>Quick Controls</h3>
        <div className="button-group">
          <button className="global-btn on" onClick={handleAllOn}>All On</button>
          <button className="global-btn off" onClick={handleAllOff}>All Off</button>
        </div>
        <div className="color-presets">
          <p>Quick Colors:</p>
          <div className="preset-colors">
            {colors.map((color) => (
              <button
                key={color.hex}
                className="preset-btn"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleAllColor(color.hex)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="led-strips">
        {ledStrips.map((strip) => (
          <div key={strip.id} className={`led-strip-card ${strip.isOn ? 'on' : 'off'}`}>
            <div className="strip-header">
              <h3>{strip.name}</h3>
              <div className={`status-badge ${strip.connected ? 'connected' : 'offline'}`}>
                {strip.connected ? '🟢 Connected' : '🔴 Offline'}
              </div>
            </div>

            <div className="strip-preview">
              <div
                className="led-preview"
                style={{
                  backgroundColor: strip.isOn ? strip.color : '#333',
                  opacity: strip.isOn ? (strip.brightness / 100) : 0.2,
                }}
              />
              <p className="ip-address">{strip.ip}</p>
            </div>

            <div className="strip-controls">
              {/* Power Toggle */}
              <div className="control-group">
                <label>Power</label>
                <button
                  className={`toggle-btn ${strip.isOn ? 'on' : 'off'}`}
                  onClick={() => handleToggle(strip.id)}
                >
                  {strip.isOn ? '⚡ On' : '⚫ Off'}
                </button>
              </div>

              {/* Brightness */}
              <div className="control-group">
                <label>Brightness: {strip.brightness}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={strip.brightness}
                  onChange={(e) => handleBrightness(strip.id, e.target.value)}
                  className="slider"
                  disabled={!strip.isOn}
                />
              </div>

              {/* Color Selection */}
              <div className="control-group">
                <label>Color</label>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color.hex}
                      className={`color-btn ${strip.color === color.hex ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColor(strip.id, color.hex)}
                      title={color.name}
                      disabled={!strip.isOn}
                    />
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div className="control-group">
                <label>Mode</label>
                <div className="mode-buttons">
                  {modes.map((mode) => (
                    <button
                      key={mode}
                      className={`mode-btn ${strip.mode === mode.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleMode(strip.id, mode)}
                      disabled={!strip.isOn}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="led-info">
        <h3>💡 Setup Info</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>Tapo App Integration</h4>
            <p>Download the Tapo app to manage your LED strips on your phone</p>
            <p><strong>App Name:</strong> Tapo (by TP-Link)</p>
            <p><strong>Compatible with:</strong> Tapo L950-8, L920-5, etc.</p>
          </div>
          <div className="info-card">
            <h4>Network Setup</h4>
            <p>Ensure LED strips are connected to your van's WiFi network</p>
            <p><strong>Network:</strong> 2.4GHz WiFi</p>
            <p><strong>For remote access:</strong> Requires Tapo account login</p>
          </div>
          <div className="info-card">
            <h4>Tips</h4>
            <p>✓ Use dim lighting for evening relaxation</p>
            <p>✓ Create scenes for different moods</p>
            <p>✓ Schedule on/off times for convenience</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TapoLED;
