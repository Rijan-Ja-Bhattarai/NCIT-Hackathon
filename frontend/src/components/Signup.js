import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'client',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="card">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            className="input"
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange}
            style={{ marginTop: 8 }}
          />
          <input
            className="input"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            style={{ marginTop: 8 }}
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ marginTop: 8 }}
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            style={{ marginTop: 8 }}
            required
          />
          <div style={{ marginTop: 12 }}>
            <label className="small" style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="role"
                value="client"
                checked={form.role === 'client'}
                onChange={handleChange}
                style={{ marginRight: 4 }}
              />
              I'm looking for a therapist
            </label>
            <label className="small">
              <input
                type="radio"
                name="role"
                value="therapist"
                checked={form.role === 'therapist'}
                onChange={handleChange}
                style={{ marginRight: 4 }}
              />
              I'm a therapist
            </label>
          </div>
          {error && (
            <p className="status error" role="alert" style={{ marginTop: 8 }}>
              {error}
            </p>
          )}
          <div style={{ marginTop: 12 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </div>
          <div className="small" style={{ marginTop: 8 }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
