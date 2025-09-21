import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Layout({ children, setToken, setRole }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole('');
    navigate('/');
  };

  return (
    <>
      {/* Global voting-themed background (fixed, behind everything) */}
      <div style={bgStyles.background} />

      <div style={styles.header}>
        <img src="/web-logo.png" alt="BHC Logo" style={styles.logo} />
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>

      <div style={styles.body}>
        <nav style={styles.sidebar}>
          <h3 style={styles.menuTitle}>Menu</h3>
          {role === 'ADMIN' && (
            <>
              {/* <Link to="/admin/dashboard"     style={{ ...styles.navLink, backgroundColor: '#ffeaa7' }}>🏠 Dashboard</Link> */}
              <Link to="/admin/add-user"      style={{ ...styles.navLink, backgroundColor: '#fab1a0' }}>➕ Add User</Link>
              <Link to="/admin/add-candidate" style={{ ...styles.navLink, backgroundColor: '#74b9ff' }}>🆕 Add Candidate</Link>
              <Link to="/admin/view-votes"    style={{ ...styles.navLink, backgroundColor: '#81ecec' }}>📊 View Votes</Link>
              <Link to="/admin/candidates"    style={{ ...styles.navLink, backgroundColor: '#e0f2fe' }}>👥 View Candidates</Link>
            </>
          )}
          {role === 'USER' && (
            <Link to="/vote" style={{ ...styles.navLink, backgroundColor: '#a29bfe' }}>🗳️ Vote</Link>
          )}
          <Link to="/results" style={{ ...styles.navLink, backgroundColor: '#a29bfe' }}>🏆View Results</Link>
        </nav>

        <main style={styles.content}>{children}</main>
      </div>
    </>
  );
}

/* Fixed background layer: soft gradient + subtle paper texture */
const bgStyles = {
  background: {
    position: 'fixed',
    inset: 0,
    zIndex: -1,
    backgroundAttachment: 'fixed',
    backgroundImage: `
      radial-gradient(circle at top left, rgba(46, 204, 113, 0.12), transparent 65%),
      radial-gradient(circle at bottom right, rgba(52, 152, 219, 0.12), transparent 65%),
      linear-gradient(135deg, #f7fafc 0%, #edf7ff 100%),
      /* subtle paper texture */
      repeating-linear-gradient(45deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 7px),
      repeating-linear-gradient(-45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 7px)
    `,
  },
};

const styles = {
  header: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '60px',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  logo: { height: '45px' },
  logout: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
  },
  body: {
    display: 'flex',
    paddingTop: '60px',
  },
  sidebar: {
    width: '220px',
    background: 'rgba(253,253,253,0.92)',
    backdropFilter: 'blur(2px)',
    padding: '2rem 1rem',
    minHeight: '100vh',
    borderTopRightRadius: '20px',
    borderBottomRightRadius: '20px',
    boxShadow: '10px 10px 20px #bebebe, -10px -10px 20px #ffffff',
    position: 'fixed',
    top: '60px',
    left: 0,
  },
  menuTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '2rem',
    fontSize: '1.2rem',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    padding: '12px 16px',
    margin: '12px 0',
    borderRadius: '10px',
    color: '#2c3e50',
    fontWeight: 600,
    boxShadow: '2px 2px 6px rgba(0,0,0,0.08)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  content: {
    marginLeft: '220px',
    padding: '2rem',
    width: '100%',
    minHeight: 'calc(100vh - 60px)',
  },
};

export default Layout;
