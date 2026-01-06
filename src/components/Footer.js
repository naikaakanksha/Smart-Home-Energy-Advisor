import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Energy Monitoring System. All rights reserved.</p>
        <div className="footer-links">
          <span>Contact: support@energymonitor.com</span>
          <span>Phone: (555) 123-ENERGY</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;