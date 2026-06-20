import React from 'react';
import { useParams } from 'react-router-dom';

export default function Profile(){
  const {id} = useParams();
  return (
    <div>
      <div className="card">
        <div style={{display:'flex',gap:18}}>
          <div className="avatar">T{id}</div>
          <div>
            <h2 style={{margin:0}}>Therapist {id}</h2>
            <div className="small">Licensed Therapist — 10 years experience</div>
            <p style={{marginTop:12}}>Short bio: compassionate therapist specializing in anxiety, depression, and life transitions. Uses CBT and mindfulness.</p>
            <div style={{display:'flex',gap:8}}>
              <button className="btn">Message</button>
              <button className="btn" style={{background:'#10b981'}}>Book session</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:16}} className="card">
        <h3 style={{marginTop:0}}>Mock messaging (demo)</h3>
        <div className="small">This is a front-end only demo. Real messaging requires a backend and auth.</div>
      </div>
    </div>
  );
}
