import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout, currentHomeId }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>⚡ Energy Monitor</h2>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/chatbot" 
            className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}
          >
            🤖 Energy Assistant
          </Link>
        </div>
        <div className="navbar-user">
          <span className="home-id">🏠 Home {currentHomeId}</span>
          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;