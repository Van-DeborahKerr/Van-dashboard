import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import './App.css';

function App() {
  const [latestReading, setLatestReading] = useState(null);
  const [readings24h, setReadings24h] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch latest reading
  const fetchLatestReading = async () => {
    try {
      const response = await axios.get(`${API_URL}/readings/latest`);
      setLatestReading(response.data);
    } catch (error) {
      console.error('Error fetching latest reading:', error);
    }
  };

  // Fetch 24h readings
  const fetchReadings24h = async () => {
    try {
      const response = await axios.get(`${API_URL}/readings/24h`);
      setReadings24h(response.data);
    } catch (error) {
      console.error('Error fetching 24h readings:', error);
    }
  };

  // Initial load and set polling
  useEffect(() => {
    fetchLatestReading();
    fetchReadings24h();
    const interval = setInterval(() => {
      fetchLatestReading();
    }, 1200000); // Poll every 20 minutes
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
        <h1>Charlie - Van Energy Dashboard</h1>
        <p>Real-time power monitoring for van & home</p>
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
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && (
          <Dashboard latestReading={latestReading} readings24h={readings24h} />
        )}
        {activeTab === 'entry' && (
          <DataEntry onSubmit={handleDataSubmit} loading={loading} />
        )}
      </main>
    </div>
  );
}

export default App;
