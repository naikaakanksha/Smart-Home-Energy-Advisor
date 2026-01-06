import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ homeData, homeId }) => {
  const [selectedAppliance, setSelectedAppliance] = useState('All');

  // Process data for charts
  const { monthlyData, applianceData, filteredData } = useMemo(() => {
    if (!homeData.length) return { monthlyData: [], applianceData: [], filteredData: [] };

    // Monthly consumption
    const monthlyConsumption = homeData.reduce((acc, entry) => {
      const date = new Date(entry.Date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const consumption = parseFloat(entry['Energy Consumption (kWh)']);
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += consumption;
      return acc;
    }, {});

    const monthlyData = Object.entries(monthlyConsumption).map(([month, consumption]) => ({
      month,
      consumption: parseFloat(consumption.toFixed(2))
    }));

    // Appliance-wise consumption
    const applianceConsumption = homeData.reduce((acc, entry) => {
      const appliance = entry['Appliance Type'];
      const consumption = parseFloat(entry['Energy Consumption (kWh)']);
      
      if (!acc[appliance]) {
        acc[appliance] = 0;
      }
      acc[appliance] += consumption;
      return acc;
    }, {});

    const applianceData = Object.entries(applianceConsumption).map(([appliance, consumption]) => ({
      appliance,
      consumption: parseFloat(consumption.toFixed(2))
    }));

    // Filter data based on selected appliance
    const filteredData = selectedAppliance === 'All' 
      ? homeData 
      : homeData.filter(entry => entry['Appliance Type'] === selectedAppliance);

    return { monthlyData, applianceData, filteredData };
  }, [homeData, selectedAppliance]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const appliances = ['All', ...new Set(homeData.map(entry => entry['Appliance Type']))];

  const totalConsumption = homeData.reduce((sum, entry) => 
    sum + parseFloat(entry['Energy Consumption (kWh)']), 0
  ).toFixed(2);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Energy Dashboard - Home {homeId}</h1>
        <div className="stats">
          <div className="stat-card">
            <h3>Total Consumption</h3>
            <p>{totalConsumption} kWh</p>
          </div>
          <div className="stat-card">
            <h3>Appliances</h3>
            <p>{appliances.length - 1}</p>
          </div>
        </div>
      </div>

      <div className="controls">
        <label>Select Appliance: </label>
        <select 
          value={selectedAppliance} 
          onChange={(e) => setSelectedAppliance(e.target.value)}
        >
          {appliances.map(appliance => (
            <option key={appliance} value={appliance}>{appliance}</option>
          ))}
        </select>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Monthly Energy Consumption</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumption" fill="#8884d8" name="Consumption (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Appliance-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applianceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ appliance, consumption }) => `${appliance}: ${consumption}kWh`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="consumption"
              >
                {applianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-table">
        <h3>Detailed Consumption Data</h3>
        <table>
          <thead>
            <tr>
              <th>Appliance</th>
              <th>Consumption (kWh)</th>
              <th>Date</th>
              <th>Time</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry['Appliance Type']}</td>
                <td>{entry['Energy Consumption (kWh)']}</td>
                <td>{entry.Date}</td>
                <td>{entry.Time}</td>
                <td>{entry['Outdoor Temperature (Â°C)']}°C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;