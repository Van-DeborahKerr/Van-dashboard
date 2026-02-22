import React, { useState, useRef, useEffect } from 'react';
import './DJMixer.css';

function DJMixer() {
  const [mode, setMode] = useState('day'); // day or night
  const [playlist, setPlaylist] = useState([
    { id: 1, name: 'Summer Vibes', duration: '3:45', mood: 'day' },
    { id: 2, name: 'Chill Evening', duration: '4:20', mood: 'night' },
    { id: 3, name: 'Kids Adventure', duration: '3:15', mood: 'day' },
    { id: 4, name: 'Relaxing Night', duration: '5:10', mood: 'night' },
    { id: 5, name: 'Energy Boost', duration: '3:30', mood: 'day' },
  ]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume1, setVolume1] = useState(70);
  const [volume2, setVolume2] = useState(70);
  const [bass, setBass] = useState(50);
  const [treble, setTreble] = useState(50);

  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);

  const dayPlaylist = playlist.filter(track => track.mood === 'day');
  const nightPlaylist = playlist.filter(track => track.mood === 'night');
  const currentPlaylist = mode === 'day' ? dayPlaylist : nightPlaylist;

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <div className="dj-mixer">
      <div className="dj-header">
        <h2>🎧 Charlie's DJ Mixer</h2>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'day' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('day')}
          >
            ☀️ Day Mode
          </button>
          <button
            className={`mode-btn ${mode === 'night' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('night')}
          >
            🌙 Night Mode
          </button>
        </div>
      </div>

      <div className="dj-container">
        {/* Turntable */}
        <div className="turntable-section">
          <div className={`turntable ${isPlaying ? 'spinning' : ''}`}>
            <div className="vinyl">
              {currentTrack && (
                <div className="track-info">
                  <p>{currentTrack.name}</p>
                  <small>{currentTrack.duration}</small>
                </div>
              )}
            </div>
          </div>
          <div className="player-controls">
            <button
              className={`play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        {/* Mixer Desk */}
        <div className="mixer-desk">
          <div className="fader-pair">
            <div className="fader-group">
              <label>🎵 Deck 1</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume1}
                onChange={(e) => setVolume1(e.target.value)}
                className="fader vertical"
              />
              <span className="value">{volume1}%</span>
            </div>
            <div className="fader-group">
              <label>🎵 Deck 2</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume2}
                onChange={(e) => setVolume2(e.target.value)}
                className="fader vertical"
              />
              <span className="value">{volume2}%</span>
            </div>
          </div>

          <div className="eq-controls">
            <div className="eq-group">
              <label>🔊 Bass</label>
              <input
                type="range"
                min="0"
                max="100"
                value={bass}
                onChange={(e) => setBass(e.target.value)}
                className="eq-slider"
              />
              <span>{bass}</span>
            </div>
            <div className="eq-group">
              <label>✨ Treble</label>
              <input
                type="range"
                min="0"
                max="100"
                value={treble}
                onChange={(e) => setTreble(e.target.value)}
                className="eq-slider"
              />
              <span>{treble}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="playlist-section">
        <h3>
          {mode === 'day' ? '☀️ Day Playlist' : '🌙 Night Playlist'}
        </h3>
        <div className="playlist">
          {currentPlaylist.map((track) => (
            <div
              key={track.id}
              className={`playlist-item ${currentTrack?.id === track.id ? 'playing' : ''}`}
              onClick={() => handlePlayTrack(track)}
            >
              <div className="track-name">{track.name}</div>
              <div className="track-duration">{track.duration}</div>
            </div>
          ))}
        </div>
      </div>

      <audio ref={audioRef1} />
      <audio ref={audioRef2} />
    </div>
  );
}

export default DJMixer;
