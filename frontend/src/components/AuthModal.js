import React, { useState } from 'react';
import './AuthModal.css';

function AuthModal({ onSubmit, required }) {
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputPin) {
      setError('Please enter a PIN');
      return;
    }

    try {
      // Test the PIN with a health check
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/readings/latest`, {
        headers: {
          'x-dashboard-pin': inputPin
        }
      });

      if (response.status === 401) {
        setError('Invalid PIN');
        return;
      }

      onSubmit(inputPin);
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h1>Charlie Dashboard</h1>
        <p>Enter your PIN to access</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter PIN"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            maxLength="6"
            autoFocus
            disabled={!required}
          />
          <button type="submit">Access Dashboard</button>
        </form>

        {!required && (
          <p className="auth-note">Authentication disabled (development mode)</p>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
