import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Opportunities({ token }) {
  const [opps, setOpps] = useState([]);
  const [form, setForm] = useState({ name: '', value: '', stage: '', closeDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/opportunities', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOpps(res.data))
      .catch(() => setError('Failed to load opportunities'));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/opportunities', form, { headers: { Authorization: `Bearer ${token}` } });
      setOpps([...opps, res.data]);
      setForm({ name: '', value: '', stage: '', closeDate: '' });
    } catch {
      setError('Failed to create opportunity');
    }
  };

  return (
    <div>
      <h2>Opportunities</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="value" placeholder="Value" value={form.value} onChange={handleChange} required />
        <input name="stage" placeholder="Stage" value={form.stage} onChange={handleChange} />
        <input name="closeDate" placeholder="Close Date" value={form.closeDate} onChange={handleChange} type="date" />
        <button type="submit">Add Opportunity</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {opps.map(opp => (
          <li key={opp.id}>{opp.name} (${opp.value}) - {opp.stage}</li>
        ))}
      </ul>
    </div>
  );
}

export default Opportunities;
