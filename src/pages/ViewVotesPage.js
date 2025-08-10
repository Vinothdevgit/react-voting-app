import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function ViewVotesPage({ token }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/votes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching vote summary:', err));
  }, [token]);

  // simple hover animation helper (no extra CSS file)
  const liftOnHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)';
  };
  const dropOnLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = styles.badge.boxShadow;
  };

  return (
    <div style={styles.page}>
      {/* background texture layer */}
      <div style={styles.bg} />

      <header style={styles.header}>
        <div style={styles.titleWrap}>
          <h2 style={styles.title}>📈 Vote Summary</h2>
          <p style={styles.subtitle}>Live tally of votes by candidate</p>
        </div>
      </header>

      <section style={styles.content}>
        {data.length === 0 ? (
          <p style={styles.noData}>No votes recorded yet.</p>
        ) : (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.badges}>
                <span
                  style={{ ...styles.badge, ...styles.badgePrimary }}
                  onMouseEnter={liftOnHover}
                  onMouseLeave={dropOnLeave}
                >
                  👥 Candidates: {data.length}
                </span>
                <span
                  style={{ ...styles.badge, ...styles.badgeSuccess }}
                  onMouseEnter={liftOnHover}
                  onMouseLeave={dropOnLeave}
                >
                  🗳️ Total votes: {data.reduce((a, c) => a + (c.totalVotes || 0), 0)}
                </span>
              </div>
            </div>

            {/* overflow-safe chart wrapper */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartInner}>
                <ResponsiveContainer width="99%" height={420}>
                  <BarChart data={data} margin={{ top: 10, right: 10, left: 12, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="candidateName"
                      angle={-12}
                      textAnchor="end"
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalVotes" fill="#2563eb" name="Total Votes" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    minHeight: 'calc(100vh - 60px)',
    padding: '2rem 1rem',
    fontFamily: 'Segoe UI, system-ui, -apple-system, Arial, sans-serif',
    overflow: 'hidden',
  },

  // Soft gradient + subtle paper texture
  bg: {
    position: 'fixed',
    inset: 0,
    zIndex: -1,
    backgroundAttachment: 'fixed',
    backgroundImage: `
      radial-gradient(circle at 12% 10%, rgba(46, 204, 113, 0.12), transparent 60%),
      radial-gradient(circle at 88% 90%, rgba(52, 152, 219, 0.12), transparent 60%),
      linear-gradient(135deg, #f7fafc 0%, #edf7ff 100%),
      repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 7px),
      repeating-linear-gradient(-45deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 7px)
    `,
  },

  header: {
    maxWidth: 1100,
    margin: '0 auto 1rem',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    padding: '0 .25rem',
  },
  titleWrap: { display: 'grid', gap: 4 },
  title: {
    margin: 0,
    color: '#111827',
    fontSize: '1.9rem',
    fontWeight: 800,
    letterSpacing: 0.2,
    textShadow: '0 1px 0 rgba(255,255,255,0.7)',
  },
  subtitle: { margin: 0, color: '#6b7280', fontSize: '.95rem' },

  content: {
    maxWidth: 1100,
    margin: '0 auto',
  },

  card: {
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid #e6eef7',
    borderRadius: 16,
    boxShadow: '0 12px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
    backdropFilter: 'blur(2px)',
    padding: '1rem 1rem 1.25rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  badges: { display: 'flex', gap: 8, flexWrap: 'wrap' },

  // Glassy, colorful badges (good for party/labels too)
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 12px',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '.8rem',
    border: '1px solid rgba(255,255,255,0.45)',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08))',
    backdropFilter: 'blur(6px)',
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.35)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.5)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    cursor: 'default',
    willChange: 'transform, box-shadow',
  },
  // Blue accent (primary)
  badgePrimary: {
    backgroundImage: `
      linear-gradient(135deg, rgba(37,99,235,0.45), rgba(29,78,216,0.3)),
      linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08))
    `,
  },
  // Green accent (success)
  badgeSuccess: {
    backgroundImage: `
      linear-gradient(135deg, rgba(16,185,129,0.45), rgba(5,150,105,0.3)),
      linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08))
    `,
  },

  // overflow-safe chart box
  chartWrapper: {
    width: '100%',
    maxWidth: '100%',
    borderRadius: 12,
    background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
    border: '1px solid #edf2fe',
    padding: '0.75rem',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  chartInner: {
    width: '100%',
    overflow: 'hidden',
  },

  noData: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: '1.05rem',
    background: 'rgba(255,255,255,0.85)',
    border: '1px dashed #dbe5f3',
    borderRadius: 12,
    padding: '1.25rem',
    maxWidth: 700,
    margin: '2rem auto 0',
  },
};

export default ViewVotesPage;
