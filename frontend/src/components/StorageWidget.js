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

  const { usedFormatted, maxFormatted, usedPercent, remainingFormatted, colorClass } = storageInfo;

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
    </div>
  );
};

export default StorageWidget;
