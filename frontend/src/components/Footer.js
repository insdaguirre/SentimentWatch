import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copy">
          <strong>SentimentWatch Demo</strong>
          <p>
            A polished front-end slice of the original product concept, rebuilt to run
            anywhere without backend services.
          </p>
        </div>
        <div className="footer-meta">
          <span>Client-only routing</span>
          <span>Local dataset</span>
          <span>No auth or APIs</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
