import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          SentimentWatch
        </NavLink>
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Main
          </NavLink>
          <NavLink 
            to="/agent" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Agent
          </NavLink>
          <NavLink 
            to="/news" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            News
          </NavLink>
          <NavLink 
            to="/dev" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Dev
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
