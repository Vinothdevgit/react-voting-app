import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DinoGame from 'react-chrome-dino'; // lightweight npm package

function VoteWaitingPage() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30); // countdown timer

  useEffect(() => {
    if (seconds <= 0) {
      navigate('/results');
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, navigate]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🕒 Please wait while votes are being processed</h1>
      <div
        style={{
          ...styles.clock3D,
          color: seconds <= 3 ? '#10B981' : '#111827',
        }}
      >
        {minutes}:{secs.toString().padStart(2, '0')}
      </div>

      <div style={styles.gameContainer}>
        <DinoGame />
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    paddingTop: '50px',
    background: 'linear-gradient(135deg, #dbeafe, #f0fdfa)',
  },
  title: {
    marginBottom: 20,
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e3a8a',
  },
  clock3D: {
    fontSize: '4rem',
    fontWeight: 700,
    padding: '20px 40px',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #ffffff, #e0e0e0)',
    boxShadow: '9px 9px 16px #bebebe, -9px -9px 16px #ffffff',
    color: '#111827',
    marginBottom: 30,
  },
  gameContainer: {
    width: '600px',
    maxWidth: '90%',
  },
};

export default VoteWaitingPage;
