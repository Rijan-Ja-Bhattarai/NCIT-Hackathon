import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Therapists from './components/Therapists';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles/app.css';

export default function App(){
  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">CareConnect</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/therapists">Therapists</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/therapists" element={<Therapists/>} />
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </main>

      <footer className="site-footer">© CareConnect — mock site for demo</footer>
    </div>
  );
}
