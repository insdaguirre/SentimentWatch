import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink 
          to="/" 
          className={`navbar-brand ${isMainPage ? 'active' : ''}`}
        >
          SentimentWatch
        </NavLink>
        <div className="navbar-links">
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
