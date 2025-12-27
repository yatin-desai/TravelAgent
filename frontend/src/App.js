
import React, { useState } from 'react';
import './App.css';
import AuthForm from './AuthForm';
import Accounts from './Accounts';
import Leads from './Leads';
import Opportunities from './Opportunities';
import Contracts from './Contracts';
import Dashboard from './Dashboard';

function Nav({ section, setSection }) {
  return (
    <nav style={{marginBottom:20}}>
      <button onClick={() => setSection('dashboard')}>Dashboard</button>
      <button onClick={() => setSection('accounts')}>Accounts</button>
      <button onClick={() => setSection('leads')}>Leads</button>
      <button onClick={() => setSection('opportunities')}>Opportunities</button>
      <button onClick={() => setSection('contracts')}>Contracts</button>
      <button onClick={() => setSection('activities')}>Activities</button>
      <button onClick={() => setSection('contacts')}>Contacts</button>
    </nav>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [section, setSection] = useState('accounts');

  if (!token) {
    return (
      <div className="app-container">
        <h1>CRM Frontend</h1>
        <AuthForm onAuth={setToken} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>CRM Frontend</h1>
      <Nav section={section} setSection={setSection} />
      {section === 'dashboard' && <Dashboard token={token} />}
      {section === 'accounts' && <Accounts token={token} />}
      {section === 'leads' && <Leads token={token} />}
      {section === 'opportunities' && <Opportunities token={token} />}
      {section === 'contracts' && <Contracts token={token} />}
      {section === 'activities' && <div><h2>Activities</h2><p>Coming soon...</p></div>}
      {section === 'contacts' && <div><h2>Contacts</h2><p>Coming soon...</p></div>}
    </div>
  );
}

export default App;
