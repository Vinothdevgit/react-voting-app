import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

// Bundler-safe API base (no process/import.meta)
const API_BASE =
  (typeof window !== 'undefined' && window.__API_BASE__) ||
  (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : `${window.location.protocol}//${window.location.host}`);

const imgUrl = (id, bust) => `${API_BASE}/public/candidates/${id}/image${bust ? `?t=${bust}` : ''}`;

function VotePage({ token }) {
  const [candidateId, setCandidateId] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [candidates, setCandidates] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(`${API_BASE}/api/candidates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setCandidates)
      .catch(err => console.error('Error fetching candidates:', err));
  }, [token]);

  const submitVote = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ candidateId }),
    });

    if (response.ok) {
      // navigate first so routing happens immediately (alert is blocking)
      navigate('/waiting');

      // show confirmation non-blocking after a tick (or use a toast/snackbar)
      setTimeout(() => {
        // use a non-blocking toast if you have one; fallback to alert
        alert('✅ Your vote has been recorded!');
      }, 150);
    } else if (response.status === 409) {
      // duplicate vote
      alert('❌ You have already voted.');
    } else {
      const text = await response.text().catch(() => '');
      console.error('Vote failed:', response.status, text);
      alert('❌ Vote failed; please try again.');
    }
  } catch (err) {
    console.error('Network error', err);
    alert('❌ Network error while submitting vote');
  }
};


  return (
    <div style={styles.machineContainer}>
      <div style={styles.backgroundTexture} />
      <h2 style={styles.title}>🗳️ Bishop Heber College Voting Machine</h2>

      <div style={styles.machine}>
        {candidates.map(candidate => {
          const expanded = hoveredId === candidate.id;
          return (
            <div
              key={candidate.id}
              onClick={() => setCandidateId(candidate.id)}
              onMouseEnter={() => setHoveredId(candidate.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                ...styles.candidateSlot,
                borderColor: candidateId === candidate.id ? '#2ecc71' : '#ddd',
                backgroundColor: candidateId === candidate.id ? '#d4f7df' : '#f9f9f9',
              }}
            >
              <div style={styles.row}>
                {/* PHOTO with graceful fallback to symbol if image missing */}
                <div style={styles.photoWrap}>
                  <img
                    src={imgUrl(candidate.id)}
                    alt={candidate.name || 'candidate'}
                    style={styles.photo}
                    onError={(e) => {
                      // Hide image; show the fallback emoji box behind it
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextSibling;
                      if (fallback) fallback.style.display = 'grid';
                    }}
                  />
                  <div style={{ ...styles.symbolFallback, display: 'none' }}>
                    {candidate.symbol || '🎓'}
                  </div>
                </div>

                <div style={styles.info}>
                  <div style={styles.name}>{candidate.name}</div>
                </div>

                <div style={styles.voteLight}>
                  {candidateId === candidate.id ? '🟢' : '⚪️'}
                </div>
              </div>

              {/* Inline expandable area */}
              <div
                aria-hidden={!expanded}
                style={{
                  ...styles.expand,
                  maxHeight: expanded ? 500 : 0,
                  opacity: expanded ? 1 : 0,
                }}
              >
                {candidate.description && (
                  <div style={styles.desc}>{candidate.description}</div>
                )}

                {candidate.promises?.length > 0 && (
                  <ul style={styles.promisesList}>
                    {candidate.promises.map((p, idx) => (
                      <li key={p.id ?? idx}>
                        {typeof p === 'string' ? p : (p.promiseText ?? '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={submitVote}
          disabled={!candidateId}
          style={{
            ...styles.submitButton,
            backgroundColor: candidateId ? '#27ae60' : '#ccc',
            cursor: candidateId ? 'pointer' : 'not-allowed',
          }}
        >
          Confirm Vote
        </button>
      </div>
    </div>
  );
}

const styles = {
  machineContainer: {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: `
      radial-gradient(circle at top left, rgba(46, 204, 113, 0.25), transparent 70%),
      radial-gradient(circle at bottom right, rgba(52, 152, 219, 0.25), transparent 70%),
      linear-gradient(135deg, #eaf6f0 0%, #e0f3ff 100%)
    `,
    backgroundAttachment: 'fixed',
    position: 'relative',
  },
  backgroundTexture: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px),
      repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px)
    `,
    pointerEvents: 'none',
    zIndex: 0,
  },
  title: {
    marginBottom: '2rem',
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    zIndex: 1,
  },
  machine: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: '600px',
    zIndex: 1,
  },
  candidateSlot: {
    border: '2px solid #ddd',
    borderRadius: '10px',
    padding: '0.9rem 1rem',
    marginBottom: '1rem',
    transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    cursor: 'pointer',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '56px 1fr 32px',
    alignItems: 'center',
    columnGap: '10px',
  },

  // Photo & fallback styles
  photoWrap: {
    position: 'relative',
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #e7eff7',
    background: 'linear-gradient(135deg, #eef7ff, #f4fff4)',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  symbolFallback: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.8rem',
    color: '#111827',
  },

  info: { minWidth: 0 },
  name: { fontWeight: 'bold', fontSize: '1.05rem', color: '#2c3e50' },
  voteLight: { fontSize: '1.6rem', justifySelf: 'end' },

  expand: {
    overflow: 'hidden',
    transition: 'max-height 220ms ease, opacity 180ms ease',
    marginTop: '0.5rem',
    borderTop: '1px dashed #e1e1e1',
    paddingTop: '0.6rem',
  },
  desc: {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '0.45rem',
  },
  promisesList: {
    margin: 0,
    paddingLeft: '1.1rem',
    fontSize: '0.9rem',
    color: '#444',
  },

  submitButton: {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
};

export default VotePage;
