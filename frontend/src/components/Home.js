import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="hero card home-layout">
        <div className="cta">
          <h1>Support when you need it — CareConnect</h1>
          <p className="small">Find licensed therapists matched to your needs. Confidential, convenient, and affordable.</p>

          <div className="search">
            <input className="input" placeholder="e.g., anxiety, relationship, teen" />
            <Link to="/therapists"><button className="btn">Find a therapist</button></Link>
          </div>

          <div className="card info-card">
            <h3>Why choose CareConnect?</h3>
            <ul className="small">
              <li>Easy matching with licensed therapists</li>
              <li>Flexible messaging & scheduled sessions</li>
              <li>Secure, HIPAA-like mock setup for demo</li>
            </ul>
          </div>

          <Link to="/screening" className="screening-card-link card">
            <span className="eyebrow">Quick screening</span>
            <h3>DASS-21 self-check</h3>
            <p className="small">Open a dedicated screening page to complete the 21-item questionnaire and see your scores.</p>
            <span className="screening-card-link__cta">Open screening</span>
          </Link>
        </div>
      </section>

      <section style={{marginTop:20}}>
        <h2>Recommended therapists</h2>
        <div className="grid" style={{marginTop:12}}>
          {[1,2,3,4].map(i=> (
            <div key={i} className="card profile-card">
              <div className="avatar">A{i}</div>
              <div>
                <div style={{fontWeight:700}}>Therapist {i}</div>
                <div className="small">Cognitive Behavioral Therapist • 4.8★</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
