import React from 'react';
import { Link } from 'react-router-dom';
import { useTherapists } from '../hooks/useTherapists';

export default function Therapists() {
  const { therapists, loading, error } = useTherapists();

  if (loading) {
    return (
      <div>
        <h2>Therapists</h2>
        <p className="small">Loading therapists…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Therapists</h2>
        <p className="status error">Could not load therapists: {error}</p>
      </div>
    );
  }

  if (therapists.length === 0) {
    return (
      <div>
        <h2>Therapists</h2>
        <p className="small">No therapists are available right now.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Therapists</h2>
      <div className="grid" style={{ marginTop: 12 }}>
        {therapists.map((t) => (
          <div className="card" key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{t.full_name || t.username}</div>
                <div className="small">{t.specialization}</div>
                {t.bio ? (
                  <div className="small" style={{ marginTop: 4, color: 'var(--muted)' }}>
                    {t.bio.slice(0, 80)}{t.bio.length > 80 ? '…' : ''}
                  </div>
                ) : null}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="small">${t.hourly_rate}/hr</div>
                <div className="small" style={{ marginBottom: 8 }}>
                  {t.years_experience} yr{t.years_experience !== 1 ? 's' : ''} exp
                </div>
                <Link to={`/profile/${t.id}`}>
                  <button className="btn">View profile</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
