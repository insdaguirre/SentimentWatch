import React from 'react';
import './StorageWidget.css';

const StorageWidget = ({ storageInfo, loading, error }) => {
  if (loading) {
    return (
      <div className="storage-widget">
        <h3>🗄️ Database Storage</h3>
        <div className="storage-loading">Loading storage info...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="storage-widget">
        <h3>🗄️ Database Storage</h3>
        <div className="storage-error">Unable to load storage info</div>
      </div>
    );
  }

  if (!storageInfo) {
    return (
      <div className="storage-widget">
        <h3>🗄️ Database Storage</h3>
        <div className="storage-no-data">No storage data available</div>
      </div>
    );
  }

  const { usedFormatted, maxFormatted, usedPercent, remainingFormatted, colorClass, dyno } = storageInfo;

  return (
    <div className="storage-widget">
      <h3>🗄️ Database Storage</h3>
      
      <div className="storage-bar-container">
        <div className={`storage-bar ${colorClass}`}>
          <div 
            className="storage-fill"
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          ></div>
        </div>
        <div className="storage-percentage">
          {usedPercent.toFixed(1)}%
        </div>
      </div>
      
      <div className="storage-info">
        <div className="storage-used">
          {usedFormatted} / {maxFormatted} used
        </div>
        <div className="storage-remaining">
          {remainingFormatted} remaining
        </div>
      </div>
      
      <div className="storage-details">
        <div className="storage-detail-item">
          <span className="detail-label">Collections:</span>
          <span className="detail-value">{storageInfo.collections}</span>
        </div>
        <div className="storage-detail-item">
          <span className="detail-label">Indexes:</span>
          <span className="detail-value">{storageInfo.indexes}</span>
        </div>
      </div>

      {/* Heroku Dyno Stats Section */}
      {dyno && (
        <div className="dyno-stats">
          <h4>🚀 Heroku Dyno</h4>
          <div className="dyno-info">
            <div className="dyno-item">
              <span className="dyno-label">State:</span>
              <span className={`dyno-value dyno-${dyno.state}`}>
                {dyno.state}
              </span>
            </div>
            <div className="dyno-item">
              <span className="dyno-label">Size:</span>
              <span className="dyno-value">{dyno.size}</span>
            </div>
            {dyno.load && (
              <div className="dyno-item">
                <span className="dyno-label">Load:</span>
                <span className="dyno-value">{dyno.load}</span>
              </div>
            )}
            {dyno.memory && (
              <div className="dyno-item">
                <span className="dyno-label">Memory:</span>
                <span className="dyno-value">{dyno.memory}</span>
              </div>
            )}
            {dyno.cpu && (
              <div className="dyno-item">
                <span className="dyno-label">CPU:</span>
                <span className="dyno-value">{dyno.cpu}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageWidget;
