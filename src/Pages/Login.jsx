import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../lib/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      // Simpan user ke localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{ color: '#f1f5f9', textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
            Selamat Datang
          </h1>
          <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Masuk ke akun Anda
          </p>

          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="anda@email.com"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.625rem 1rem',
                  borderRadius: '10px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.625rem 1rem',
                  borderRadius: '10px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading || !email || !password}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                borderRadius: '10px',
                background: loading || !email || !password ? '#334155' : '#6366f1',
                color: 'white',
                border: 'none',
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Belum punya akun? <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none' }}>Daftar di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
