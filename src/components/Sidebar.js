import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/chatbot" 
          className={location.pathname === '/chatbot' ? 'active' : ''}
        >
          🤖 Energy Assistant
        </Link>
      </div>
      <div className="sidebar-info">
        <h4>Quick Tips</h4>
        <ul>
          <li>Monitor peak usage hours</li>
          <li>Compare seasonal consumption</li>
          <li>Identify high-energy appliances</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;