import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Contracts({ token }) {
  const [contracts, setContracts] = useState([]);
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '', value: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/contracts', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setContracts(res.data))
      .catch(() => setError('Failed to load contracts'));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/contracts', form, { headers: { Authorization: `Bearer ${token}` } });
      setContracts([...contracts, res.data]);
      setForm({ title: '', startDate: '', endDate: '', value: '' });
    } catch {
      setError('Failed to create contract');
    }
  };

  return (
    <div>
      <h2>Contracts</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="startDate" placeholder="Start Date" value={form.startDate} onChange={handleChange} type="date" required />
        <input name="endDate" placeholder="End Date" value={form.endDate} onChange={handleChange} type="date" />
        <input name="value" placeholder="Value" value={form.value} onChange={handleChange} />
        <button type="submit">Add Contract</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {contracts.map(contract => (
          <li key={contract.id}>{contract.title} (${contract.value}) {contract.startDate} - {contract.endDate}</li>
        ))}
      </ul>
    </div>
  );
}

export default Contracts;
