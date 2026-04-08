import React from 'react';
import './SystemInfo.css';

const SystemInfo = ({ info, stats }) => {
  if (!stats || !info) return null;

  return (
    <div className="system-info section-card">
      <div className="system-section">
        <h4 className="system-title">Runtime</h4>
        <div className="system-item">
          <span className="system-label">Mode</span>
          <span className="system-value">{info.mode}</span>
        </div>
        <div className="system-item">
          <span className="system-label">Last refresh</span>
          <span className="system-value">
            {new Date(info.lastUpdated).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      <div className="system-section">
        <h4 className="system-title">Guardrails</h4>
        <div className="system-item">
          <span className="system-label">{info.notice}</span>
        </div>
      </div>

      <div className="system-section">
        <h4 className="system-title">Notes</h4>
        <div className="system-item">
          <span className="system-label">Auth</span>
          <span className="system-value">{info.auth}</span>
        </div>
        <div className="system-item">
          <span className="system-label">Data file</span>
          <span className="system-value">{info.dataLocation}</span>
        </div>
        <div className="system-services">
          {info.services.map((service) => (
            <span key={service} className="system-service-pill">
              {service}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
