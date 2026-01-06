import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, energyData }) => {
  const [homeId, setHomeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Login attempt:', { homeId, password });
    console.log('Energy data length:', energyData.length);
    
    // Get unique home IDs from the dataset
    const uniqueHomeIds = [...new Set(energyData.map(entry => entry['Home ID']))];
    console.log('Available Home IDs in dataset:', uniqueHomeIds);
    
    // Check if home ID exists in the dataset
    const homeExists = energyData.some(entry => entry['Home ID'] === homeId);
    
    console.log('Home exists check for', homeId + ':', homeExists);
    
    if (homeExists && password === homeId) {
      console.log('Login successful for Home ID:', homeId);
      onLogin(homeId);
    } else {
      if (!homeExists) {
        setError(`Home ID "${homeId}" not found in our system. Available IDs: ${uniqueHomeIds.join(', ')}`);
      } else {
        setError('Invalid password. Please use your Home ID as the password.');
      }
    }
  };

  // Get unique home IDs for display
  const uniqueHomeIds = [...new Set(energyData.map(entry => entry['Home ID']))].sort((a, b) => a - b);

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Energy Monitoring System</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Home ID:</label>
            <input
              type="text"
              value={homeId}
              onChange={(e) => setHomeId(e.target.value)}
              required
              placeholder="Enter your Home ID"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your Home ID as password"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div className="login-info">
          <p>Use your Home ID as both username and password</p>
          <p><strong>Available Home IDs in system:</strong> {uniqueHomeIds.join(', ')}</p>
          <p><strong>Total records loaded:</strong> {energyData.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;