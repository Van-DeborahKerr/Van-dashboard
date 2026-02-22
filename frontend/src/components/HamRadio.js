import React, { useState, useEffect, useRef } from 'react';
import './HamRadio.css';

function HamRadio() {
  const [frequency, setFrequency] = useState(145.800); // Common UK amateur frequency
  const [mode, setMode] = useState('FM'); // FM, SSB, AM, CW
  const [isReceiving, setIsReceiving] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [squelch, setSquelch] = useState(-70);
  const [gain, setGain] = useState(30);
  const [recordingStatus, setRecordingStatus] = useState('stopped');
  const [savedFrequencies, setSavedFrequencies] = useState([
    { name: 'UK Amateur 2m', freq: 145.800, mode: 'FM', region: 'National' },
    { name: 'UK Amateur 70cm', freq: 433.050, mode: 'FM', region: 'National' },
    { name: 'Aircraft', freq: 118.000, mode: 'AM', region: 'National' },
    { name: 'Weather', freq: 162.400, mode: 'FM', region: 'National' },
  ]);
  const [decodedText, setDecodedText] = useState('');
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);

  // Simulate signal strength changes
  useEffect(() => {
    if (isReceiving) {
      const interval = setInterval(() => {
        setSignalStrength(Math.floor(Math.random() * 100));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isReceiving]);

  // Simulate received data
  useEffect(() => {
    if (recordingStatus === 'recording') {
      const messages = [
        'G4RZC calling CQ CQ CQ',
        'M0ABC receiving on 145.800 FM',
        'Weather update: Clear skies, 15 knots',
        'GB3RZC repeater active',
        'G0RZA: All stations standby'
      ];
      const interval = setInterval(() => {
        setDecodedText(messages[Math.floor(Math.random() * messages.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [recordingStatus]);

  const handleStartReceiving = () => {
    setIsReceiving(true);
  };

  const handleStopReceiving = () => {
    setIsReceiving(false);
    setSignalStrength(0);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(parseFloat(e.target.value));
  };

  const handleSaveFrequency = () => {
    const name = prompt('Save frequency as:', `${frequency} MHz`);
    if (name) {
      setSavedFrequencies([...savedFrequencies, {
        name,
        freq: frequency,
        mode,
        region: 'User'
      }]);
    }
  };

  const handleLoadFrequency = (freq, newMode) => {
    setFrequency(freq);
    setMode(newMode);
    handleStartReceiving();
  };

  const handleRecordStart = () => {
    setRecordingStatus('recording');
  };

  const handleRecordStop = () => {
    setRecordingStatus('stopped');
  };

  const frequencyPresets = [
    { label: '140', start: 140.000, end: 150.000 },
    { label: '2m', start: 144.000, end: 148.000 },
    { label: '70cm', start: 430.000, end: 450.000 },
    { label: 'PMR', start: 446.000, end: 446.100 },
  ];

  return (
    <div className="ham-radio">
      <div className="radio-header">
        <h2>📻 Ham Radio Interface (RTL-SDR/NESDR Mini 2)</h2>
        <p>Software Defined Radio receiver for amateur radio & monitoring</p>
      </div>

      {/* Main Tuner */}
      <div className="tuner-section">
        <div className="frequency-display">
          <div className="large-freq">
            {frequency.toFixed(3)} MHz
          </div>
          <div className="mode-display">{mode}</div>
        </div>

        {/* Frequency Control */}
        <div className="frequency-controls">
          <input
            type="range"
            min="24"
            max="1700"
            step="0.001"
            value={frequency}
            onChange={handleFrequencyChange}
            className="freq-slider"
          />
          <div className="freq-presets">
            {frequencyPresets.map(preset => (
              <button
                key={preset.label}
                className="preset-btn"
                onClick={() => setFrequency(preset.start)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mode-controls">
          {['FM', 'SSB', 'AM', 'CW'].map(m => (
            <button
              key={m}
              className={`mode-btn ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Signal & Status */}
      <div className="signal-section">
        <div className="signal-meter">
          <div className="meter-label">Signal Strength</div>
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: `${signalStrength}%` }}></div>
          </div>
          <div className="meter-value">{signalStrength}%</div>
        </div>

        <div className="status-box">
          <div className={`status ${isReceiving ? 'receiving' : 'idle'}`}>
            {isReceiving ? '🔴 RECEIVING' : '⚫ IDLE'}
          </div>
          <div className={`recording ${recordingStatus === 'recording' ? 'active' : ''}`}>
            {recordingStatus === 'recording' ? '⏺ RECORDING' : '⏹ STOPPED'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="radio-controls">
        <div className="button-group">
          <button
            className={`control-btn start ${isReceiving ? 'active' : ''}`}
            onClick={handleStartReceiving}
          >
            🔴 Start Receiving
          </button>
          <button
            className={`control-btn stop ${!isReceiving ? 'active' : ''}`}
            onClick={handleStopReceiving}
          >
            ⏹ Stop
          </button>
        </div>

        <div className="button-group">
          <button
            className={`control-btn record ${recordingStatus === 'recording' ? 'active' : ''}`}
            onClick={handleRecordStart}
            disabled={!isReceiving}
          >
            ⏺ Record
          </button>
          <button
            className={`control-btn stop`}
            onClick={handleRecordStop}
          >
            Stop Record
          </button>
        </div>

        <button className="save-btn" onClick={handleSaveFrequency}>
          💾 Save Frequency
        </button>
      </div>

      {/* Adjustments */}
      <div className="adjustments">
        <div className="adjustment-group">
          <label>Squelch: {squelch} dB</label>
          <input
            type="range"
            min="-100"
            max="0"
            value={squelch}
            onChange={(e) => setSquelch(parseInt(e.target.value))}
            className="slider"
          />
        </div>
        <div className="adjustment-group">
          <label>Gain: {gain} dB</label>
          <input
            type="range"
            min="0"
            max="50"
            value={gain}
            onChange={(e) => setGain(parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      {/* Decoded Text / Log */}
      <div className="decoded-section">
        <h3>Decoded Information</h3>
        <div className="decoded-box">
          {decodedText || 'Waiting for transmission...'}
        </div>
      </div>

      {/* Saved Frequencies */}
      <div className="frequencies-section">
        <h3>Saved Frequencies</h3>
        <div className="freq-list">
          {savedFrequencies.map((item, idx) => (
            <div
              key={idx}
              className="freq-item"
              onClick={() => handleLoadFrequency(item.freq, item.mode)}
            >
              <div className="freq-name">{item.name}</div>
              <div className="freq-details">
                <span>{item.freq.toFixed(3)} MHz</span>
                <span>{item.mode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info & Tips */}
      <div className="info-section">
        <div className="info-box">
          <h4>📡 Setup Requirements</h4>
          <ul>
            <li><strong>NESDR Mini 2</strong> - RTL-SDR dongle (connected via USB)</li>
            <li><strong>Antenna</strong> - Quarter-wave dipole or coax cable</li>
            <li><strong>Software</strong> - GQRX, CubicSDR, or RTL-SDR tools</li>
            <li><strong>Desktop/Laptop</strong> - This interface runs on your PC</li>
          </ul>
        </div>

        <div className="info-box">
          <h4>🎙️ Amateur Radio Info</h4>
          <ul>
            <li><strong>2m Band:</strong> 144-148 MHz (FM repeaters)</li>
            <li><strong>70cm Band:</strong> 430-450 MHz (Local repeaters)</li>
            <li><strong>SSB:</strong> USB for voice, CW for morse code</li>
            <li><strong>UK Law:</strong> Listening only - NO transmission without license</li>
          </ul>
        </div>

        <div className="info-box">
          <h4>💡 Tips</h4>
          <ul>
            <li>Position antenna away from obstacles for best reception</li>
            <li>Use squelch to reduce noise when not receiving</li>
            <li>Save favorite frequencies for quick access</li>
            <li>Record interesting transmissions for later playback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HamRadio;
