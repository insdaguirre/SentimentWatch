import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');

    const handleViewportChange = (event) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen((currentValue) => !currentValue);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-block">
          <NavLink to="/" className="navbar-brand">
            <span className="navbar-brand__mark">SW</span>
            <span>SentimentWatch</span>
          </NavLink>
          <span className="demo-chip navbar-demo">Static Demo</span>
          <button
            type="button"
            className="navbar-menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={handleMenuToggle}
          >
            <span className="navbar-menu-toggle__line" />
            <span className="navbar-menu-toggle__line" />
            <span className="navbar-menu-toggle__line" />
          </button>
        </div>
        <div
          id="primary-navigation"
          className={`navbar-links ${isMenuOpen ? 'navbar-links--open' : ''}`}
        >
          <NavLink
            to="/dashboard?ticker=AAPL"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Feed
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
