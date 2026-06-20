import React from 'react';
import { Link } from 'react-router-dom';

export default function Login(){
  return (
    <div style={{maxWidth:420}}>
      <div className="card">
        <h2>Login</h2>
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" style={{marginTop:8}} />
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn">Sign in</button>
          <Link to="/signup" style={{alignSelf:'center',marginLeft:8}}>Create account</Link>
        </div>
      </div>
    </div>
  );
}
