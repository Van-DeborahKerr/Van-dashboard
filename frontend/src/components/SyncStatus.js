import React from 'react';
import './SyncStatus.css';

function SyncStatus({ loading, lastUpdate, nextUpdate }) {
  return (
    <div className="sync-status">
      <div className={`sync-indicator ${loading ? 'syncing' : 'idle'}`}>
        <span className="dot"></span>
        {loading ? 'Syncing...' : 'Synced'}
      </div>
      
      {lastUpdate && (
        <div className="sync-times">
          <p>Last: {new Date(lastUpdate).toLocaleTimeString()}</p>
          <p>Next: {nextUpdate}</p>
        </div>
      )}
    </div>
  );
}

export default SyncStatus;
