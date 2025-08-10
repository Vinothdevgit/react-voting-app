import React, { useState, useEffect } from 'react';

/**
 * Page for adding a new election candidate.
 */
function AddCandidatePage({ token }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    symbol: '',
    promisesText: '',
  });

  const addCandidate = async () => {
    const promises = form.promisesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const candidateData = {
      name: form.name,
      description: form.description,
      symbol: form.symbol,
      promises,
    };

    try {
      const response = await fetch('http://localhost:8080/admin/candidate/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(candidateData),
      });
      if (response.ok) {
        alert('✅ Candidate added successfully');
        setForm({ name: '', description: '', symbol: '', promisesText: '' });
      } else {
        alert('❌ Failed to add candidate');
      }
    } catch (err) {
      console.error('Error adding candidate:', err);
      alert('❌ An error occurred while adding the candidate');
    }
  };

  // Inject small focus/hover effects without needing a CSS file
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('add-candidate-effects')) {
      const tag = document.createElement('style');
      tag.id = 'add-candidate-effects';
      tag.innerHTML = `
        input:focus, textarea:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147,197,253,0.35), inset 0 1px 2px rgba(0,0,0,0.05);
          outline: none;
        }
        button:hover {
          filter: brightness(1.05);
          box-shadow: 0 14px 30px rgba(2,132,199,0.32), inset 0 1px 0 rgba(255,255,255,0.65);
        }
        button:active { transform: translateY(1px); }
      `;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* local background layer */}
      <div style={styles.bg} aria-hidden />

      <div style={styles.card}>
        <h2 style={styles.title}>🗂️ Add New Candidate</h2>

        <div style={styles.formGrid}>
          <input
            placeholder="Candidate Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Symbol (e.g. 🎓)"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            style={styles.input}
          />
        </div>

        <label style={styles.label}>Promises (one per line)</label>
        <textarea
          placeholder="Enter each promise on a new line"
          value={form.promisesText}
          onChange={(e) => setForm({ ...form, promisesText: e.target.value })}
          style={styles.textarea}
          rows={6}
        />

        <button style={styles.button} onClick={addCandidate}>Add Candidate</button>
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
    fontFamily: 'Segoe UI, system-ui, -apple-system, Arial, sans-serif',
    overflow: 'hidden',
  },

  // Subtle voting-themed background (mint/blue + paper texture)
  bg: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundAttachment: 'fixed',
    backgroundImage: `
      radial-gradient(circle at 10% 8%, rgba(46,204,113,0.14), transparent 60%),
      radial-gradient(circle at 90% 92%, rgba(52,152,219,0.14), transparent 60%),
      linear-gradient(135deg, #f7fafc 0%, #edf7ff 100%),
      repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 7px),
      repeating-linear-gradient(-45deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 7px)
    `,
  },

  card: {
    width: '100%',
    maxWidth: 720,
    borderRadius: 16,
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.92)',
    border: `1px solid ${borderLight}`,
    boxShadow: '0 14px 36px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.65)',
    backdropFilter: 'blur(2px)',
  },

  title: {
    textAlign: 'center',
    margin: '0 0 1.25rem',
    color: '#111827',
    fontSize: '1.6rem',
    fontWeight: 800,
    letterSpacing: 0.2,
    textShadow: '0 1px 0 rgba(255,255,255,0.7)',
  },

  // three tidy rows (on wide screens it stays centered)
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 12,
    marginBottom: '1rem',
  },

  input: {
    width: '100%',
    height: 44,
    padding: '0 12px',
    fontSize: '1rem',
    borderRadius: 10,
    border: `1px solid ${borderLight}`,
    background: '#ffffff',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
  },

  label: {
    fontWeight: 700,
    color: '#374151',
    fontSize: '0.95rem',
    marginTop: 6,
    marginBottom: 6,
  },

  textarea: {
    width: '100%',
    minHeight: 150,
    padding: '10px 12px',
    fontSize: '1rem',
    borderRadius: 10,
    border: `1px solid ${borderLight}`,
    background: '#ffffff',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    resize: 'vertical',
    marginBottom: '1rem',
  },

  button: {
    width: '100%',
    height: 46,
    fontSize: '1rem',
    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 800,
    letterSpacing: 0.2,
    boxShadow: '0 12px 26px rgba(2,132,199,0.28), inset 0 1px 0 rgba(255,255,255,0.55)',
    transition: 'transform 0.06s ease, box-shadow 0.15s ease, filter 0.15s ease',
  },
};

export default AddCandidatePage;
