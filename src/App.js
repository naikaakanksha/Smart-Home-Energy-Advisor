import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import './App.css';

// Import the JSON data directly
import jsonData from './assets/house_energy_data.json';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentHomeId, setCurrentHomeId] = useState(null);
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Loading energy data...');
        
        // Use the directly imported JSON data
        console.log('JSON data loaded directly, homes:', jsonData.length);
        
        // Transform the JSON data to match the expected format
        const transformedData = transformJSONData(jsonData);
        console.log('Transformed data records:', transformedData.length);
        console.log('Available Home IDs:', [...new Set(transformedData.map(item => item['Home ID']))].sort((a, b) => a - b));
        
        setEnergyData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error processing JSON data:', error);
        setError(error.message);
        setLoading(false);
        
        // Fallback to sample data from the JSON structure
        const fallbackData = createFallbackData();
        setEnergyData(fallbackData);
        console.log('Using fallback data with', fallbackData.length, 'records');
      }
    };

    loadData();
  }, []);

  const transformJSONData = (jsonData) => {
    const transformed = [];
    
    jsonData.forEach(home => {
      home.Records.forEach(record => {
        transformed.push({
          'Home ID': home.HomeID.toString(),
          'Appliance Type': record.ApplianceType,
          'Energy Consumption (kWh)': record['EnergyConsumption(kWh)'].toString(),
          'Time': record.Time,
          'Date': record.Date,
          'Outdoor Temperature (°C)': record['OutdoorTemperature(°C)'].toString(),
          'Season': record.Season,
          'Household Size': home.HouseholdSize.toString()
        });
      });
    });
    
    return transformed;
  };

  const createFallbackData = () => {
    // Create fallback data based on the JSON structure you provided
    const sampleHomes = [
      {
        HomeID: 112,
        HouseholdSize: 1,
        Records: [
          {
            ApplianceType: "Dishwasher",
            "EnergyConsumption(kWh)": 4.06,
            Time: "16:10",
            Date: "2023-04-28",
            "OutdoorTemperature(°C)": 21.6,
            Season: "Summer"
          }
        ]
      },
      {
        HomeID: 346,
        HouseholdSize: 4,
        Records: [
          {
            ApplianceType: "Computer",
            "EnergyConsumption(kWh)": 1.88,
            Time: "13:54",
            Date: "2023-12-16",
            "OutdoorTemperature(°C)": 19.8,
            Season: "Fall"
          }
        ]
      },
      {
        HomeID: 18,
        HouseholdSize: 3,
        Records: [
          {
            ApplianceType: "Computer",
            "EnergyConsumption(kWh)": 1.87,
            Time: "13:59",
            Date: "2023-10-07",
            "OutdoorTemperature(°C)": 8.8,
            Season: "Winter"
          }
        ]
      }
    ];
    
    return transformJSONData(sampleHomes);
  };

  const handleLogin = (homeId) => {
    setIsAuthenticated(true);
    setCurrentHomeId(homeId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentHomeId(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading energy data...</div>
        {error && <div className="error-message">Error: {error}</div>}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} energyData={energyData} />;
  }

  const currentHomeData = energyData.filter(entry => entry['Home ID'] === currentHomeId);

  return (
    <Router>
      <div className="app">
        <Navbar onLogout={handleLogout} currentHomeId={currentHomeId} />
        <div className="app-body">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    homeData={currentHomeData} 
                    homeId={currentHomeId}
                  />
                } 
              />
              <Route 
                path="/chatbot" 
                element={
                  <Chatbot 
                    energyData={energyData} 
                    currentHomeId={currentHomeId}
                    homeData={currentHomeData}
                  />
                } 
              />
              {/* Default redirect to dashboard after login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Catch all other routes and redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;