import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-block">
          <NavLink to="/" className="navbar-brand">
            <span className="navbar-brand__mark">SW</span>
            <span>SentimentWatch</span>
          </NavLink>
          <span className="demo-chip navbar-demo">Static Demo</span>
        </div>
        <div className="navbar-links">
          <NavLink
            to="/dashboard?ticker=AAPL"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Feed
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
