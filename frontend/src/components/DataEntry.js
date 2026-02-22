import React, { useState } from 'react';
import axios from 'axios';
import './DataEntry.css';

function DataEntry({ onSubmit, loading, pin }) {
  const [formData, setFormData] = useState({
    allpowers_battery: '',
    allpowers_watts: '',
    allpowers_voltage: '',
    allpowers_240v_input: false,
    ecoflow_battery: '',
    ecoflow_watts: '',
    ecoflow_voltage: '',
    lifepo4_battery: '',
    lifepo4_voltage: '',
    solar_watts: '',
    solar_voltage: '',
    system_load_watts: '',
    charger_status: 'idle'
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${API_URL}/readings`, formData, {
        headers: pin ? { 'x-dashboard-pin': pin } : {}
      });
      setSuccess(true);
      setFormData({
        allpowers_battery: '',
        allpowers_watts: '',
        allpowers_voltage: '',
        allpowers_240v_input: false,
        ecoflow_battery: '',
        ecoflow_watts: '',
        ecoflow_voltage: '',
        lifepo4_battery: '',
        lifepo4_voltage: '',
        solar_watts: '',
        solar_voltage: '',
        system_load_watts: '',
        charger_status: 'idle'
      });
      setTimeout(() => setSuccess(false), 3000);
      onSubmit();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please re-authenticate.');
      } else {
        setError(err.response?.data?.error || 'Failed to submit reading');
      }
    }
  };

  return (
    <div className="data-entry">
      <h2>Add Energy Reading</h2>
      <p>Enter current values from your apps (every 20 minutes)</p>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">Reading saved successfully!</div>}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>AllPowers 2500+</legend>
          <div className="form-group">
            <label>Battery %</label>
            <input type="number" name="allpowers_battery" value={formData.allpowers_battery} onChange={handleChange} min="0" max="100" />
          </div>
          <div className="form-group">
            <label>Power (Watts)</label>
            <input type="number" name="allpowers_watts" value={formData.allpowers_watts} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label>Voltage (V)</label>
            <input type="number" name="allpowers_voltage" value={formData.allpowers_voltage} onChange={handleChange} step="0.1" min="0" />
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" name="allpowers_240v_input" checked={formData.allpowers_240v_input} onChange={handleChange} />
              240V Input Connected
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>EcoFlow</legend>
          <div className="form-group">
            <label>Battery %</label>
            <input type="number" name="ecoflow_battery" value={formData.ecoflow_battery} onChange={handleChange} min="0" max="100" />
          </div>
          <div className="form-group">
            <label>Power (Watts)</label>
            <input type="number" name="ecoflow_watts" value={formData.ecoflow_watts} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label>Voltage (V)</label>
            <input type="number" name="ecoflow_voltage" value={formData.ecoflow_voltage} onChange={handleChange} step="0.1" min="0" />
          </div>
        </fieldset>

        <fieldset>
          <legend>LiFePO4 Battery (DC House 2560)</legend>
          <div className="form-group">
            <label>Battery %</label>
            <input type="number" name="lifepo4_battery" value={formData.lifepo4_battery} onChange={handleChange} min="0" max="100" />
          </div>
          <div className="form-group">
            <label>Voltage (V)</label>
            <input type="number" name="lifepo4_voltage" value={formData.lifepo4_voltage} onChange={handleChange} step="0.1" min="0" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Solar System</legend>
          <div className="form-group">
            <label>Power (Watts)</label>
            <input type="number" name="solar_watts" value={formData.solar_watts} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label>Voltage (V)</label>
            <input type="number" name="solar_voltage" value={formData.solar_voltage} onChange={handleChange} step="0.1" min="0" />
          </div>
        </fieldset>

        <fieldset>
          <legend>System Status</legend>
          <div className="form-group">
            <label>System Load (Watts)</label>
            <input type="number" name="system_load_watts" value={formData.system_load_watts} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label>Charger Status</label>
            <select name="charger_status" value={formData.charger_status} onChange={handleChange}>
              <option value="idle">Idle</option>
              <option value="charging">Charging</option>
              <option value="discharging">Discharging</option>
              <option value="error">Error</option>
            </select>
          </div>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Save Reading'}
        </button>
      </form>
    </div>
  );
}

export default DataEntry;
