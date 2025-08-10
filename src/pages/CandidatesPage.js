import React, { useEffect, useMemo, useState } from 'react';

/**
 * AdminCandidatesPage
 * - Lists all candidates in a responsive grid
 * - Clean alignment for symbol, name, description, and promises
 * - Includes a quick search by name/description/promise text
 */
function CandidatesPage({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

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
              </div>
            </article>
          ))}
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
  searchWrap: {
    minWidth: 260,
  },
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
  meta: {
    minWidth: 0,
  },
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
  bullet: {
    color: '#10b981',
    lineHeight: 1.35,
    fontWeight: 700,
  },
  footer: {
    marginTop: 6,
    paddingTop: 8,
    borderTop: '1px dashed #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  idLine: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    minWidth: 0,
  },
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
};

export default CandidatesPage;
