import React from 'react';

export default function Signup(){
  return (
    <div style={{maxWidth:480}}>
      <div className="card">
        <h2>Create an account</h2>
        <input className="input" placeholder="Full name" />
        <input className="input" placeholder="Email" style={{marginTop:8}} />
        <input className="input" placeholder="Password" style={{marginTop:8}} />
        <div style={{marginTop:12}}>
          <button className="btn">Sign up</button>
        </div>
        <div className="small" style={{marginTop:8}}>This demo does not persist accounts.</div>
      </div>
    </div>
  );
}
