// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Admin Panel</h2>
      <nav>
        <ul style={styles.navList}>
          <li><Link style={styles.link} to="/admin/dashboard">🏠 Dashboard</Link></li>
          <li><Link style={styles.link} to="/admin/add-user">➕ Add User</Link></li>
          <li><Link style={styles.link} to="/admin/view-votes">📊 View Votes</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    background: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
    boxShadow: '10px 10px 20px #bebebe, -10px -10px 20px #ffffff',
    padding: '1.5rem',
    borderRadius: '0 20px 20px 0',
    position: 'fixed',
    top: 0,
    left: 0,
    overflowY: 'auto',
    zIndex: 1000,
  },
  title: {
    marginBottom: '2rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    fontSize: '1.1rem',
  },
  link: {
    display: 'block',
    padding: '12px 20px',
    margin: '10px 0',
    borderRadius: '10px',
    textDecoration: 'none',
    backgroundColor: '#f0f0f0',
    color: '#2c3e50',
    fontWeight: 500,
    transition: 'all 0.3s ease-in-out',
    boxShadow: 'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff',
  },
  linkHover: {
    backgroundColor: '#dfe6e9',
    transform: 'translateY(-2px)',
  },
};

export default Sidebar;
