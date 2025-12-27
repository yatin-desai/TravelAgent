import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Accounts({ token }) {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/accounts', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAccounts(res.data))
      .catch(() => setError('Failed to load accounts'));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/accounts', form, { headers: { Authorization: `Bearer ${token}` } });
      setAccounts([...accounts, res.data]);
      setForm({ name: '', email: '', phone: '', address: '' });
    } catch {
      setError('Failed to create account');
    }
  };

  return (
    <div>
      <h2>Accounts</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <button type="submit">Add Account</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {accounts.map(acc => (
          <li key={acc.id}>{acc.name} ({acc.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default Accounts;
