import React, { useState, useEffect } from 'react';

/**
 * Page for adding a new election candidate (with image upload).
 */
function AddCandidatePage({ token }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    promisesText: '',
    imageFile: null,
    imagePreview: null,
  });

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm(f => ({ ...f, imageFile: null, imagePreview: null }));
      return;
    }
    // basic validation (optional)
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Max image size is 5MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, imageFile: file, imagePreview: url }));
  };

  const clearImage = () => {
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm(f => ({ ...f, imageFile: null, imagePreview: null }));
  };

  const addCandidate = async () => {
    const promises = form.promisesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Build multipart payload
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description || '');
    fd.append('promises', JSON.stringify(promises));
    if (form.imageFile) fd.append('image', form.imageFile);

    try {
      const response = await fetch('http://localhost:8080/admin/candidate/add', {
        method: 'POST',
        headers: {
          // DO NOT set Content-Type for FormData; the browser will set it with the correct boundary.
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: fd,
      });

      if (response.ok) {
        alert('✅ Candidate added successfully');
        if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
        setForm({ name: '', description: '', promisesText: '', imageFile: null, imagePreview: null });
      } else {
        const msg = await response.text().catch(() => '');
        alert(`❌ Failed to add candidate${msg ? `: ${msg}` : ''}`);
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
        </div>

        {/* Image upload */}
        <label style={styles.label}>Candidate Image</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <input type="file" accept="image/*" onChange={onImageChange} />
          {form.imagePreview && (
            <>
              <img
                src={form.imagePreview}
                alt="preview"
                style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 12, border: `1px solid ${borderLight}` }}
              />
              <button type="button" onClick={clearImage} style={styles.secondaryBtn}>Remove</button>
            </>
          )}
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
  secondaryBtn: {
    height: 36,
    padding: '0 12px',
    borderRadius: 10,
    border: `1px solid ${borderLight}`,
    background: '#f9fafb',
    cursor: 'pointer',
  },
};

export default AddCandidatePage;
