import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Leads({ token }) {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', status: '', source: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/leads', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLeads(res.data))
      .catch(() => setError('Failed to load leads'));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/leads', form, { headers: { Authorization: `Bearer ${token}` } });
      setLeads([...leads, res.data]);
      setForm({ name: '', email: '', status: '', source: '' });
    } catch {
      setError('Failed to create lead');
    }
  };

  return (
    <div>
      <h2>Leads</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <input name="source" placeholder="Source" value={form.source} onChange={handleChange} />
        <button type="submit">Add Lead</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {leads.map(lead => (
          <li key={lead.id}>{lead.name} ({lead.email}) - {lead.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Leads;
