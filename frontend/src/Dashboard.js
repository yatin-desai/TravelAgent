import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/reports/summary', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard'));
  }, [token]);

  if (error) return <div><h2>Dashboard</h2><p style={{color:'red'}}>{error}</p></div>;
  if (!stats) return <div><h2>Dashboard</h2><p>Loading...</p></div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        <li>Total Accounts: {stats.accounts}</li>
        <li>Total Leads: {stats.leads}</li>
        <li>Total Opportunities: {stats.opportunities}</li>
        <li>Total Contracts: {stats.contracts}</li>
        <li>Open Opportunities Value: ${stats.openOpportunitiesValue}</li>
        <li>Closed Opportunities Value: ${stats.closedOpportunitiesValue}</li>
      </ul>
    </div>
  );
}

export default Dashboard;
