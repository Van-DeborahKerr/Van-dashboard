import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Dashboard.css';

function Dashboard({ latestReading, readings24h }) {
  if (!latestReading || Object.keys(latestReading).length === 0) {
    return <div className="dashboard"><p>No data available. Add a reading to get started.</p></div>;
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="dashboard">
      <div className="status-cards">
        {/* 240V Input Status */}
        <div className="card status-card">
          <h3>240V Input</h3>
          <p className={`status ${latestReading.allpowers_240v_input ? 'active' : 'inactive'}`}>
            {latestReading.allpowers_240v_input ? '✓ Connected' : '✗ Disconnected'}
          </p>
        </div>

        {/* AllPowers */}
        <div className="card">
          <h3>AllPowers 2500+</h3>
          <div className="reading">
            <span>Battery:</span>
            <strong>{latestReading.allpowers_battery || 'N/A'}%</strong>
          </div>
          <div className="reading">
            <span>Power:</span>
            <strong>{latestReading.allpowers_watts || 'N/A'}W</strong>
          </div>
          <div className="reading">
            <span>Voltage:</span>
            <strong>{latestReading.allpowers_voltage || 'N/A'}V</strong>
          </div>
        </div>

        {/* EcoFlow */}
        <div className="card">
          <h3>EcoFlow</h3>
          <div className="reading">
            <span>Battery:</span>
            <strong>{latestReading.ecoflow_battery || 'N/A'}%</strong>
          </div>
          <div className="reading">
            <span>Power:</span>
            <strong>{latestReading.ecoflow_watts || 'N/A'}W</strong>
          </div>
          <div className="reading">
            <span>Voltage:</span>
            <strong>{latestReading.ecoflow_voltage || 'N/A'}V</strong>
          </div>
        </div>

        {/* LiFePO4 Battery */}
        <div className="card">
          <h3>LiFePO4 (DC House 2560)</h3>
          <div className="reading">
            <span>Battery:</span>
            <strong>{latestReading.lifepo4_battery || 'N/A'}%</strong>
          </div>
          <div className="reading">
            <span>Voltage:</span>
            <strong>{latestReading.lifepo4_voltage || 'N/A'}V</strong>
          </div>
        </div>

        {/* Solar */}
        <div className="card">
          <h3>Solar System</h3>
          <div className="reading">
            <span>Power:</span>
            <strong>{latestReading.solar_watts || 'N/A'}W</strong>
          </div>
          <div className="reading">
            <span>Voltage:</span>
            <strong>{latestReading.solar_voltage || 'N/A'}V</strong>
          </div>
        </div>

        {/* System Load */}
        <div className="card">
          <h3>System Load</h3>
          <div className="reading">
            <span>Total Load:</span>
            <strong>{latestReading.system_load_watts || 'N/A'}W</strong>
          </div>
          <div className="reading">
            <span>Charger:</span>
            <strong>{latestReading.charger_status || 'N/A'}</strong>
          </div>
        </div>

        {/* Timestamp */}
        <div className="card info-card">
          <h3>Last Update</h3>
          <p>{formatTime(latestReading.timestamp)}</p>
        </div>
      </div>

      {/* Charts */}
      {readings24h.length > 0 && (
        <div className="charts">
          <div className="chart-container">
            <h3>Battery Levels (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={readings24h}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="allpowers_battery" stroke="#FF6B6B" name="AllPowers %" />
                <Line type="monotone" dataKey="ecoflow_battery" stroke="#4ECDC4" name="EcoFlow %" />
                <Line type="monotone" dataKey="lifepo4_battery" stroke="#95E1D3" name="LiFePO4 %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Power Output (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={readings24h}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="allpowers_watts" fill="#FF6B6B" name="AllPowers (W)" />
                <Bar dataKey="solar_watts" fill="#FFD93D" name="Solar (W)" />
                <Bar dataKey="system_load_watts" fill="#6BCB77" name="System Load (W)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
