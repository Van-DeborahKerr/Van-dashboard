import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import SyncStatus from './components/SyncStatus';
import LiveMap from './components/LiveMap';
import AIAssistant from './components/AIAssistant';
import DJMixer from './components/DJMixer';
import AirplaneTracker from './components/AirplaneTracker';
import TapoLED from './components/TapoLED';
import HamRadio from './components/HamRadio';
import CampsiteFinder from './components/CampsiteFinder';
import MediaConverter from './components/MediaConverter';
import Home from './components/Home';
import './App.css';

function App() {
  const [latestReading, setLatestReading] = useState(null);
  const [readings24h, setReadings24h] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [nextSyncTime, setNextSyncTime] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [networkMode, setNetworkMode] = useState('local');

  const API_URL = '/api';

  const fetchLatestReading = async () => {
    try {
      const response = await axios.get(`${API_URL}/readings/latest`);
      setLatestReading(response.data);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error fetching reading:', error);
    }
  };

  const fetchReadings24h = async () => {
    try {
      const response = await axios.get(`${API_URL}/readings/24h`);
      setReadings24h(response.data.readings || []);
    } catch (error) {
      console.error('Error fetching 24h:', error);
    }
  };

  useEffect(() => {
    setIsSyncing(true);
    fetchLatestReading();
    fetchReadings24h();
    
    const next = new Date();
    next.setMinutes(next.getMinutes() + 20);
    setNextSyncTime(next.toLocaleTimeString());
    setIsSyncing(false);
    
    const interval = setInterval(() => {
      setIsSyncing(true);
      fetchLatestReading();
      fetchReadings24h();
      setIsSyncing(false);
    }, 1200000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDataSubmit = async () => {
    setLoading(true);
    await fetchLatestReading();
    await fetchReadings24h();
    setLoading(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-top">
          <h1>🎧 Charlie - Van Energy Dashboard</h1>
          <p>Built by Charlie. Powered by Bill, Deborah, Minnie & Doris</p>
        </div>
        
        <div className="network-toggle">
          <button
            className={`network-btn ${networkMode === 'local' ? 'active' : ''}`}
            onClick={() => setNetworkMode('local')}
            title="Local network only"
          >
            📡 Local
          </button>
          <button
            className={`network-btn ${networkMode === 'wifi' ? 'active' : ''}`}
            onClick={() => setNetworkMode('wifi')}
            title="WiFi/Internet enabled"
          >
            🌐 WiFi
          </button>
          <span className="network-status">
            {networkMode === 'local' ? '192.168.188.x' : 'Internet Ready'}
          </span>
        </div>
      </header>

      <nav className="tabs">
        <button className={`tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>🏠 Home</button>
        <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`tab ${activeTab === 'entry' ? 'active' : ''}`} onClick={() => setActiveTab('entry')}>Add Reading</button>
        <button className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>Van Map</button>
        <button className={`tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>AI Assistant</button>
        <button className={`tab ${activeTab === 'dj' ? 'active' : ''}`} onClick={() => setActiveTab('dj')}>🎧 DJ Mixer</button>
        <button className={`tab ${activeTab === 'planes' ? 'active' : ''}`} onClick={() => setActiveTab('planes')}>✈️ Airplanes</button>
        <button className={`tab ${activeTab === 'led' ? 'active' : ''}`} onClick={() => setActiveTab('led')}>💡 LED Control</button>
        <button className={`tab ${activeTab === 'radio' ? 'active' : ''}`} onClick={() => setActiveTab('radio')}>📻 Ham Radio</button>
        <button className={`tab ${activeTab === 'camps' ? 'active' : ''}`} onClick={() => setActiveTab('camps')}>🏕️ Campsites</button>
        <button className={`tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>🎬 Media Converter</button>
      </nav>

      <main className="content">
        {activeTab === 'home' && <Home />}
        {activeTab === 'dashboard' && <Dashboard latestReading={latestReading} readings24h={readings24h} />}
        {activeTab === 'entry' && <DataEntry onSubmit={handleDataSubmit} loading={loading} />}
        {activeTab === 'map' && <LiveMap />}
        {activeTab === 'ai' && <AIAssistant />}
        {activeTab === 'dj' && <DJMixer />}
        {activeTab === 'planes' && <AirplaneTracker />}
        {activeTab === 'led' && <TapoLED />}
        {activeTab === 'radio' && <HamRadio />}
        {activeTab === 'camps' && <CampsiteFinder />}
        {activeTab === 'media' && <MediaConverter networkMode={networkMode} />}
        <SyncStatus loading={isSyncing} lastUpdate={lastSyncTime} nextUpdate={nextSyncTime} />
      </main>
    </div>
  );
}

export default App;
