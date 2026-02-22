import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import AuthModal from './components/AuthModal';
import SyncStatus from './components/SyncStatus';
import LiveMap from './components/LiveMap';
import AIAssistant from './components/AIAssistant';
import DJMixer from './components/DJMixer';
import AirplaneTracker from './components/AirplaneTracker';
import TapoLED from './components/TapoLED';
import HamRadio from './components/HamRadio';
import './App.css';

function App() {
  const [latestReading, setLatestReading] = useState(null);
  const [readings24h, setReadings24h] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [nextSyncTime, setNextSyncTime] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if auth is required on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        if (response.data.auth_enabled) {
          setAuthRequired(true);
          const storedPin = localStorage.getItem('charlie-pin');
          if (storedPin) {
            setPin(storedPin);
            setAuthenticated(true);
          }
        } else {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };
    checkAuth();
  }, [API_URL]);

  // Fetch latest reading
  const fetchLatestReading = async () => {
    try {
      const headers = pin ? { 'x-dashboard-pin': pin } : {};
      const response = await axios.get(`${API_URL}/readings/latest`, { headers });
      setLatestReading(response.data);
      setLastSyncTime(new Date());
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthenticated(false);
        localStorage.removeItem('charlie-pin');
      }
      console.error('Error fetching latest reading:', error);
    }
  };

  // Fetch 24h readings
  const fetchReadings24h = async () => {
    try {
      const headers = pin ? { 'x-dashboard-pin': pin } : {};
      const response = await axios.get(`${API_URL}/readings/24h`, { headers });
      setReadings24h(response.data);
    } catch (error) {
      console.error('Error fetching 24h readings:', error);
    }
  };

  // Initial load and set polling
  useEffect(() => {
    if (!authenticated) return;
    
    setIsSyncing(true);
    fetchLatestReading();
    fetchReadings24h();
    const calculateNextSync = () => {
      const next = new Date();
      next.setMinutes(next.getMinutes() + 20);
      setNextSyncTime(next.toLocaleTimeString());
    };
    calculateNextSync();
    setIsSyncing(false);
    
    const interval = setInterval(() => {
      setIsSyncing(true);
      fetchLatestReading();
      calculateNextSync();
      setIsSyncing(false);
    }, 1200000); // Poll every 20 minutes
    return () => clearInterval(interval);
  }, [authenticated, pin]);

  const handleAuthSubmit = (inputPin) => {
    setPin(inputPin);
    localStorage.setItem('charlie-pin', inputPin);
    setAuthenticated(true);
  };

  const handleDataSubmit = async () => {
    setLoading(true);
    await fetchLatestReading();
    await fetchReadings24h();
    setLoading(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPin('');
    localStorage.removeItem('charlie-pin');
  };

  if (!authenticated) {
    return <AuthModal onSubmit={handleAuthSubmit} required={authRequired} />;
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🎧 Charlie - Van Energy Dashboard</h1>
        <p>Built by Charlie. Powered by Bill, Deborah, Minnie & Doris</p>
        {authRequired && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'entry' ? 'active' : ''}`}
          onClick={() => setActiveTab('entry')}
        >
          Add Reading
        </button>
        <button
          className={`tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Van Map
        </button>
        <button
          className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          AI Assistant
        </button>
        <button
          className={`tab ${activeTab === 'dj' ? 'active' : ''}`}
          onClick={() => setActiveTab('dj')}
        >
          🎧 DJ Mixer
        </button>
        <button
          className={`tab ${activeTab === 'planes' ? 'active' : ''}`}
          onClick={() => setActiveTab('planes')}
        >
          ✈️ Airplanes
        </button>
        <button
          className={`tab ${activeTab === 'led' ? 'active' : ''}`}
          onClick={() => setActiveTab('led')}
        >
          💡 LED Control
        </button>
        <button
          className={`tab ${activeTab === 'radio' ? 'active' : ''}`}
          onClick={() => setActiveTab('radio')}
        >
          📻 Ham Radio
        </button>
      </nav>

      <main className="content">
        {error && <div className="error-alert">{error}</div>}
        {activeTab === 'dashboard' && (
          <Dashboard latestReading={latestReading} readings24h={readings24h} />
        )}
        {activeTab === 'entry' && (
          <DataEntry onSubmit={handleDataSubmit} loading={loading} pin={pin} />
        )}
        {activeTab === 'map' && (
          <LiveMap />
        )}
        {activeTab === 'ai' && (
          <AIAssistant />
        )}
        {activeTab === 'dj' && (
          <DJMixer />
        )}
        {activeTab === 'planes' && (
          <AirplaneTracker />
        )}
        {activeTab === 'led' && (
          <TapoLED />
        )}
        {activeTab === 'radio' && (
          <HamRadio />
        )}
        <SyncStatus loading={isSyncing} lastUpdate={lastSyncTime} nextUpdate={nextSyncTime} />
      </main>
    </div>
  );
}

export default App;
