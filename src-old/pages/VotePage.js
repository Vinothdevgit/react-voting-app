import React, { useEffect, useState } from 'react';

function VotePage({ token }) {
  const [candidateId, setCandidateId] = useState('');
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/candidates', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setCandidates)
      .catch(err => console.error('Error fetching candidates:', err));
  }, [token]);

  const submitVote = async () => {
    const response = await fetch('http://localhost:8080/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ candidateId }),
    });
    if (response.ok) {
      alert('✅ Your vote has been recorded!');
    } else {
      alert('❌ Vote failed');
    }
  };

  return (
    <div style={styles.machineContainer}>
      <h2 style={styles.title}>🗳️ Bishop Heber College Voting Machine</h2>
      <div style={styles.machine}>
        {candidates.map(candidate => (
  <div
    key={candidate.id}
    onClick={() => setCandidateId(candidate.id)}
    style={{
      ...styles.candidateSlot,
      borderColor: candidateId === candidate.id ? '#2ecc71' : '#ddd',
      backgroundColor: candidateId === candidate.id ? '#d4f7df' : '#f9f9f9',
    }}
  >
    <div style={styles.symbol}>{candidate.symbol || '🎓'}</div>
    <div style={styles.info}>
      <div style={styles.name}>{candidate.name}</div>
      <div style={styles.desc}>{candidate.description}</div>
    </div>
    <div style={styles.voteLight}>
      {candidateId === candidate.id ? '🟢' : '⚪️'}
    </div>
  </div>
))}


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
    background: '#ecf0f1',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '2rem',
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '1.8rem',
  },
  machine: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  candidateSlot: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    cursor: 'pointer',
  },
  symbol: {
    fontSize: '2rem',
    marginRight: '1rem',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  desc: {
    fontSize: '0.95rem',
    color: '#555',
  },
  button: {
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    outline: 'none',
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
  voteLight: {
  fontSize: '1.8rem',
  marginLeft: 'auto',
  marginRight: '10px',
  transition: 'transform 0.2s',
},
};

export default VotePage;
