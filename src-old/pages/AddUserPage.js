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
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Add New User</h2>

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />

        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          style={styles.input}
        />

        <label style={styles.label}>Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          style={styles.select}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button style={styles.button} onClick={addUser}>Add User</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 60px)',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1.5rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default AddUserPage;
