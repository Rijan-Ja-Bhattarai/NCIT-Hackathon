import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './components/Home';
import Screening from './components/Screening';
import Therapists from './components/Therapists';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles/app.css';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <div className="brand">CareConnect</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/therapists">Therapists</Link>
        {isAuthenticated ? (
          <>
            <span className="small" style={{ color: 'var(--muted)' }}>
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--primary)',
                fontWeight: 600,
                marginLeft: 18,
                padding: 0,
                fontFamily: 'inherit',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <main>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={<ProtectedRoute><Home /></ProtectedRoute>}
            />
            <Route path="/screening" element={<Screening />} />
            <Route path="/therapists" element={<Therapists />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="site-footer">© CareConnect</footer>
      </div>
    </AuthProvider>
  );
}
