import React from 'react';
import { Link } from 'react-router-dom';

const sample = new Array(8).fill(0).map((_,i)=>({id:i+1,name:`Therapist ${i+1}`,title:`Specialist in anxiety & mood`,rating:4.6+ (i%3)*0.2}));

export default function Therapists(){
  return (
    <div>
      <h2>Therapists</h2>
      <div className="grid" style={{marginTop:12}}>
        {sample.map(t=> (
          <div className="card" key={t.id}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700}}>{t.name}</div>
                <div className="small">{t.title}</div>
              </div>
              <div>
                <div style={{textAlign:'right'}}>{t.rating.toFixed(1)}★</div>
                <Link to={`/profile/${t.id}`}><button className="btn" style={{marginTop:8}}>View profile</button></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
