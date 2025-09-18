import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * AdminCandidatesPage
 * - Lists candidates in a responsive grid
 * - Quick search
 * - NEW: Edit/Delete for each candidate
 * - NEW: "Manage Promises" link per candidate
 */
function CandidatesPage({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  // edit modal state
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    symbol: '',
  });

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/admin/candidates', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCandidates(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching candidates:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    if (!q.trim()) return candidates;
    const k = q.trim().toLowerCase();
    return candidates.filter(c => {
      const inName = (c.name || '').toLowerCase().includes(k);
      const inDesc = (c.description || '').toLowerCase().includes(k);
      const inPromises = (c.promises || []).some(p =>
        (typeof p === 'string' ? p : p?.promiseText || '').toLowerCase().includes(k)
      );
      return inName || inDesc || inPromises;
    });
  }, [q, candidates]);

  // ---------- Edit ----------
  const openEdit = (c) => {
    setEditId(c.id);
    setEditForm({
      promises: (Array.isArray(c.promises) ? c.promises.map(p => typeof p === 'string' ? p : (p?.promiseText || '')).filter(s => typeof s === 'string') : []),
      name: c.name || '',
      description: c.description || '',
      symbol: c.symbol || '',
    });
    setIsOpen(true);
  };
  const closeEdit = () => {
    if (saving) return;
    setIsOpen(false);
    setEditId(null);
  };
  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/admin/candidate/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...editForm, promises: (editForm.promises || []).map(p => typeof p === "string" ? p : (p?.promiseText || "")) }),
      });
      if (!res.ok) throw new Error('Save failed');
      // Optimistic local update
      setCandidates(prev => prev.map(c => (c.id === editId ? { ...c, ...editForm } : c)));
      setIsOpen(false);
      setEditId(null);
    } catch (e) {
      console.error(e);
      alert('❌ Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const deleteCandidate = async (id) => {
    if (!window.confirm('Delete this candidate? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8080/admin/candidate/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert('❌ Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>👥 Candidates</h2>
        <div style={styles.searchWrap}>
          <input
            placeholder="Search candidates or promises…"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={styles.search}
          />
        </div>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No candidates found.</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(c => (
            <article key={c.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.symbol}>{c.symbol || '🎓'}</div>
                <div style={styles.meta}>
                  <div style={styles.nameRow}>
                    <span style={styles.name}>{c.name}</span>
                    <span style={styles.badge}>{(c.promises?.length || 0)} promises</span>
                  </div>
                  {c.description && <p style={styles.desc}>{c.description}</p>}
                </div>
              </div>

              {Array.isArray(c.promises) && c.promises.length > 0 && (
                <ul style={styles.promiseList}>
                  {c.promises.map((p, i) => {
                    const text = typeof p === 'string' ? p : (p?.promiseText || '');
                    return (
                      <li key={p?.id ?? i} style={styles.promiseItem}>
                        <span style={styles.bullet}>•</span>
                        <span>{text}</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div style={styles.footer}>
                <div style={styles.idLine}>
                  <span style={styles.idLabel}>ID:</span>
                  <code style={styles.idVal}>{c.id}</code>
                </div>

                <div style={styles.actions}>

                  <button
                    style={{ ...styles.btn, ...styles.btnGhost }}
                    onClick={() => openEdit(c)}
                    title="Edit candidate"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    style={{ ...styles.btn, ...styles.btnDanger }}
                    onClick={() => deleteCandidate(c.id)}
                    disabled={deletingId === c.id}
                    title="Delete candidate"
                  >
                    {deletingId === c.id ? 'Deleting…' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isOpen && (
        <div style={styles.modalBackdrop} onClick={closeEdit}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Edit Candidate</h3>
              <button style={styles.modalClose} onClick={closeEdit} title="Close">✕</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Name</label>
                <input
                  style={styles.formInput}
                  value={editForm.name}
                  onChange={(e) => setEditForm({
      promises: (Array.isArray(c.promises) ? c.promises.map(p => typeof p === 'string' ? p : (p?.promiseText || '')).filter(s => typeof s === 'string') : []), ...editForm, name: e.target.value })}
                />
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Description</label>
                <input
                  style={styles.formInput}
                  value={editForm.description}
                  onChange={(e) => setEditForm({
      promises: (Array.isArray(c.promises) ? c.promises.map(p => typeof p === 'string' ? p : (p?.promiseText || '')).filter(s => typeof s === 'string') : []), ...editForm, description: e.target.value })}
                />
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Symbol (emoji or short text)</label>
                <input
                  style={styles.formInput}
                  value={editForm.symbol}
                  onChange={(e) => setEditForm({
      promises: (Array.isArray(c.promises) ? c.promises.map(p => typeof p === 'string' ? p : (p?.promiseText || '')).filter(s => typeof s === 'string') : []), ...editForm, symbol: e.target.value })}
                  maxLength={4}
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Promises</label>
                <div>
                  {(editForm.promises || []).map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <input
                        style={{ ...styles.formInput, flex: 1 }}
                        value={typeof p === 'string' ? p : (p?.promiseText || '')}
                        onChange={(e) => {
                          const arr = [...(editForm.promises || [])];
                          arr[idx] = e.target.value;
                          setEditForm({ ...editForm, promises: arr });
                        }}
                        placeholder={`Promise #${idx + 1}`}
                      />
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={() => {
                          const arr = [...(editForm.promises || [])];
                          arr.splice(idx, 1);
                          setEditForm({ ...editForm, promises: arr });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => setEditForm({ 
                      ...editForm, 
                      promises: [...(editForm.promises || []), ''] 
                    })}
                  >
                    + Add promise
                  </button>
                </div>
              </div>
    
            </div>

            <div style={styles.modalFooter}>
              <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={closeEdit} disabled={saving}>
                Cancel
              </button>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '1rem',
    fontFamily: 'Segoe UI, system-ui, -apple-system, Arial, sans-serif',
  },
  headerRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.6rem',
    fontWeight: 700,
  },
  searchWrap: { minWidth: 260 },
  search: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: 10,
    border: '1px solid #dcdcdc',
    outline: 'none',
    fontSize: '0.95rem',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '2rem 0.5rem',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '14px 14px 10px',
    border: '1px solid #e9edf2',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTop: {
    display: 'grid',
    gridTemplateColumns: '56px 1fr',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  symbol: {
    width: 56,
    height: 56,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.8rem',
    background: 'linear-gradient(135deg, #eef7ff, #f4fff4)',
    border: '1px solid #e7eff7',
  },
  meta: { minWidth: 0 },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: 700,
    color: '#1f2937',
    fontSize: '1.05rem',
  },
  badge: {
    fontSize: '0.75rem',
    padding: '3px 8px',
    background: '#eef2ff',
    color: '#3730a3',
    border: '1px solid #e5e7eb',
    borderRadius: 999,
    fontWeight: 600,
  },
  desc: {
    margin: 0,
    color: '#4b5563',
    lineHeight: 1.35,
    fontSize: '0.92rem',
  },
  promiseList: {
    margin: '8px 0 6px',
    padding: 0,
    listStyle: 'none',
    display: 'grid',
    gap: 6,
  },
  promiseItem: {
    display: 'grid',
    gridTemplateColumns: '14px 1fr',
    alignItems: 'start',
    gap: 8,
    color: '#374151',
    fontSize: '0.92rem',
  },
  bullet: { color: '#10b981', lineHeight: 1.35, fontWeight: 700 },

  footer: {
    marginTop: 6,
    paddingTop: 8,
    borderTop: '1px dashed #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  idLine: { display: 'flex', gap: 6, alignItems: 'center', minWidth: 0 },
  idLabel: {
    color: '#6b7280',
    fontSize: '0.78rem',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  idVal: {
    fontSize: '0.78rem',
    color: '#374151',
    background: '#f9fafb',
    border: '1px solid #eef2f7',
    padding: '2px 6px',
    borderRadius: 6,
    overflowWrap: 'anywhere',
  },

  actions: { display: 'flex', gap: 8 },

  // Buttons
  btn: {
    padding: '8px 10px',
    borderRadius: 8,
    fontSize: '.9rem',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    fontWeight: 700,
    background: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  btnGhost: { background: '#ffffff', color: '#111827' },
  btnInfo: {
    background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    color: '#fff',
    border: 'none',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
    color: '#fff',
    border: 'none',
  },
  btnDanger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    border: 'none',
  },

  // Modal
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.25)',
    display: 'grid',
    placeItems: 'center',
    padding: '1rem',
    zIndex: 50,
  },
  modal: {
    width: '100%',
    maxWidth: 560,
    background: '#fff',
    borderRadius: 14,
    border: '1px solid #e6eef7',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eef2f7',
  },
  modalTitle: { margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111827' },
  modalClose: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  modalBody: { padding: '14px 16px', display: 'grid', gap: 12 },
  formRow: { display: 'grid', gap: 6 },
  formLabel: { fontWeight: 700, color: '#374151', fontSize: '.92rem' },
  formInput: {
    width: '100%',
    height: 42,
    padding: '0 12px',
    fontSize: '1rem',
    borderRadius: 10,
    border: '1px solid #e6eef7',
    background: '#ffffff',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    outline: 'none',
  },
  modalFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #eef2f7',
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
};

export default CandidatesPage;