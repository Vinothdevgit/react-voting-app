import React, { useState } from 'react';

function AddUserPage({ token }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'USER',
    fullName: ''
  });

  const addUser = async () => {
    const response = await fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      alert('✅ User added successfully');
      setForm({ username: '', password: '', role: 'USER', fullName: '' });
    } else {
      alert('❌ Failed to add user');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.localBg} />

      <div style={styles.card}>
        <h2 style={styles.title}>👤 Add New User</h2>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={styles.select}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <button style={styles.button} onClick={addUser}>Add User</button>
      </div>
    </div>
  );
}

const borderLight = '#e6eef7';

const styles = {
  container: {
    position: 'relative',
    minHeight: 'calc(100vh - 60px)',
    display: 'grid',
    placeItems: 'center',
    padding: '2.5rem 1rem',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    overflow: 'hidden',
  },
  localBg: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundImage: `
      radial-gradient(circle at 8% 12%, rgba(46,204,113,0.12), transparent 55%),
      radial-gradient(circle at 92% 88%, rgba(52,152,219,0.12), transparent 55%),
      repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 7px),
      repeating-linear-gradient(-45deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 7px)
    `,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
    padding: '2rem',
    background: 'rgba(255,255,255,0.92)',
    border: `1px solid ${borderLight}`,
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(2px)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#111827',
    fontSize: '1.6rem',
    fontWeight: 800,
  },
  formGrid: {
    display: 'grid',
    gap: 18,
    marginBottom: '1.2rem',
  },
  field: { display: 'grid', gap: 6 },
  label: {
    fontWeight: 700,
    color: '#374151',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    height: '42px',
    padding: '0 12px',
    fontSize: '1rem',
    borderRadius: 8,
    border: `1px solid ${borderLight}`,
    background: '#fff',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    outline: 'none',
  },
  select: {
    width: '100%',
    height: '42px',
    padding: '0 12px',
    fontSize: '1rem',
    borderRadius: 8,
    border: `1px solid ${borderLight}`,
    background: '#fff',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    outline: 'none',
    appearance: 'none',
    backgroundImage:
      'linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%)',
    backgroundPosition: 'calc(100% - 20px) center, calc(100% - 15px) center',
    backgroundSize: '5px 5px, 5px 5px',
    backgroundRepeat: 'no-repeat',
  },
  button: {
    width: '100%',
    height: '46px',
    fontSize: '1rem',
    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    boxShadow: '0 8px 20px rgba(2,132,199,0.28)',
  },
};

export default AddUserPage;
