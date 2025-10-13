import React from 'react';
import './SystemInfo.css';

const SystemInfo = ({ stats }) => {
  if (!stats) return null;

  // Mock system information - in a real app, this would come from the backend
  const systemData = {
    summary: {
      totalPosts: stats.totalPosts || 0,
      timePeriod: '24 hours'
    },
    database: {
      used: '1.37 MB',
      total: '512 MB',
      remaining: '510.63 MB',
      collections: 3,
      indexes: 23,
      percentage: 0.3
    },
    heroku: {
      state: 'up',
      size: 'Basic'
    }
  };

  return (
    <div className="system-info">
      <div className="system-section">
        <h4 className="system-title">Summary</h4>
        <div className="system-item">
          <span className="system-label">Total Posts:</span>
          <span className="system-value">{systemData.summary.totalPosts}</span>
        </div>
        <div className="system-item">
          <span className="system-label">Time Period:</span>
          <span className="system-value">{systemData.summary.timePeriod}</span>
        </div>
      </div>

      <div className="system-section">
        <h4 className="system-title">Database Storage</h4>
        <div className="system-item">
          <span className="system-label">{systemData.database.used} / {systemData.database.total} used</span>
        </div>
        <div className="system-item">
          <span className="system-label">{systemData.database.remaining} remaining</span>
        </div>
        <div className="system-item">
          <span className="system-label">Collections: {systemData.database.collections} Indexes: {systemData.database.indexes}</span>
        </div>
        <div className="system-item">
          <span className="system-value">{systemData.database.percentage}%</span>
        </div>
      </div>

      <div className="system-section">
        <h4 className="system-title">Heroku Dyno</h4>
        <div className="system-item">
          <span className="system-label">State:</span>
          <span className="system-value green">{systemData.heroku.state}</span>
        </div>
        <div className="system-item">
          <span className="system-label">Size:</span>
          <span className="system-value">{systemData.heroku.size}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
