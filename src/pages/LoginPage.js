import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setToken, setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      const userRole = tokenPayload?.authorities?.[0]?.replace('ROLE_', '') || 'USER';
      setRole(userRole);
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('role', userRole); 
      navigate(userRole === 'ADMIN' ? '/admin/dashboard' : '/vote');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="glow-box">
        <img src="/web-logo.png" alt="BHC Logo" style={styles.logo} className="floating-logo" />
        <h2 style={styles.title} className="glow-text">Online Voting System</h2>

      <div style={styles.form}>
      <div className="input-group">
        <input
        style={styles.input}
          required
          placeholder=" "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Username</label>
      </div>

      <div className="input-group">
        <input
        style={styles.input}
          type="password"
          required
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Password</label>
      </div>

      <button style={styles.button} onClick={handleLogin}>Login</button>
    </div>
      </div>

      <style>{`
        .glow-box {
          box-shadow: 0 0 10px #00ffe1, 0 0 20px #00ffe1, 0 0 30px #00ffe1;
        }

        .glow-text {
          color: white;
          text-shadow: 0 0 8px #00e0ff, 0 0 12px #00e0ff;
        }

        .floating-logo {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes glow-border {
          0% { box-shadow: 0 0 10px #00ffe1, 0 0 20px #00ffe1, 0 0 30px #00ffe1; }
          100% { box-shadow: 0 0 20px #007bff, 0 0 40px #007bff, 0 0 60px #007bff; }
        }

        @keyframes glow-pulse {
          0% { text-shadow: 0 0 8px #00e0ff, 0 0 12px #00e0ff; }
          100% { text-shadow: 0 0 20px #00d1ff, 0 0 28px #00d1ff; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-group input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: transparent;
          font-size: 1rem;
          color: white;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .input-group input:focus {
          border-color: #00ffe1;
          box-shadow: 0 0 6px #00ffe1;
        }

        .input-group label {
          position: absolute;
          top: 12px;
          left: 14px;
          background: transparent;
          color: #aaa;
          font-size: 1rem;
          pointer-events: none;
          transition: 0.2s ease all;
        }

        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label {
          top: -10px;
          left: 12px;
          font-size: 0.8rem;
          color: #00ffe1;
          background-color: #2c5364;
          padding: 0 5px;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    height: '100vh',
    width: '100vw', // Ensure full viewport width
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", sans-serif',
    margin: 0, // Remove default margin
    overflow: 'hidden', // Prevent scrollbars
  },
  card: {
    background: '#3e5d6b',
    backdropFilter: 'blur(12px)',
    padding: '2rem',
    borderRadius: '12px',
    width: '350px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  logo: {
    width: '350px',
    height: 'auto',
    marginBottom: '1.5rem',
    filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6)) brightness(1)', // Add brightness filter
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    alignItems: 'center', // Center children horizontally
    width: '100%',
  },
  button: {
    width: '140px',
    padding: '10px',
    backgroundColor: '#00c896',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  input: {
    width: '280px', // Reduce input width
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: 'transparent',
    fontSize: '0.95rem',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
};

export default LoginPage;
