import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import confetti from 'canvas-confetti';

function ResultsPage({ token }) {
  const [results, setResults] = useState([]);

  // Inject promises-card styles once
  useEffect(() => {
    const promisesCardCSS = `.promises-card {
  --card-w: 720px;
  max-width: var(--card-w);
  margin: 1.75rem auto;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  position: relative;
  background: #ffffff; /* flat white */
  box-shadow: 0 6px 18px rgba(15,23,42,0.06); /* soft, subtle shadow */
  transition: transform 200ms ease, box-shadow 200ms ease;
  overflow: visible;
  border: 1px solid rgba(15,23,42,0.04);
}

/* header */
.promises-card__header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 0.6rem;
}

.promises-card__badge {
  font-size: 1.25rem;
  width: 44px;
  height: 44px;
  display: inline-grid;
  place-items: center;
  border-radius: 8px;
  background: #fff7ed;
  box-shadow: 0 4px 8px rgba(2,6,23,0.06);
}

.promises-card__subtitle {
  font-size: 0.78rem;
  color: #6b7280;
}

.promises-card__title {
  margin: 0;
  font-size: 1.05rem;
  color: #0f172a;
  font-weight: 700;
}

/* list */
.promises-card__list {
  list-style: none;
  padding: 0;
  margin: 0.6rem 0 0 0;
}

.promises-card__item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #ffffff; /* flat */
  box-shadow: 0 2px 6px rgba(2,6,23,0.04);
  transition: transform 140ms ease, box-shadow 140ms ease;
}

.promises-card__dot {
  min-width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  background: #fff;
  border-radius: 6px;
  font-weight: 700;
  color: #ef4444;
  box-shadow: 0 1px 4px rgba(2,6,23,0.04);
}

.promises-card__item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(2,6,23,0.08);
}

@media (max-width: 720px) {
  .promises-card { padding: 1rem; --card-w: 92vw; border-radius: 12px; }
  .promises-card__dot { min-width: 24px; height: 24px; }
}
    `;
    if (typeof document !== 'undefined' && !document.getElementById('promises-card-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'promises-card-styles';
      styleEl.innerText = promisesCardCSS;
      document.head.appendChild(styleEl);
    }
  }, []);

  useEffect(() => {
    let fireworksInterval, sparkleInterval;

    const startCelebration = () => {
      // Fireworks every 2s
      fireworksInterval = setInterval(() => {
        confetti({
          particleCount: 100,
          spread: 360,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
        });
      }, 2000);

      // Balloons
    //   balloonInterval = setInterval(() => {
    //     const balloon = document.createElement('div');
    //     balloon.className = 'balloon';
    //     balloon.style.left = `${Math.random() * 100}vw`;
    //     balloon.style.backgroundColor = getRandomColor();
    //     document.body.appendChild(balloon);
    //     setTimeout(() => balloon.remove(), 15000);
    //   }, 500);

      // Sparkles
      sparkleInterval = setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
      }, 300);

    //   // Falling confetti
    //   confettiInterval = setInterval(() => {
    //     const conf = document.createElement('div');
    //     conf.className = 'confetti';
    //     conf.style.left = `${Math.random() * 100}vw`;
    //     conf.style.backgroundColor = getRandomColor();
    //     conf.style.animationDuration = `${5 + Math.random() * 5}s`;
    //     document.body.appendChild(conf);
    //     setTimeout(() => conf.remove(), 10000);
    //   }, 200);

      // attach simple styles for balloon/sparkle/confetti elements if not already present
      if (!document.getElementById('results-anim-styles')) {
        const animStyles = document.createElement('style');
        animStyles.id = 'results-anim-styles';
        animStyles.innerText = `
.balloon { position: fixed; top: 100vh; width: 40px; height: 56px; border-radius: 20px; z-index: 9999; animation: floatUp 14s linear; opacity: 0.95; }
@keyframes floatUp { 0% { transform: translateY(0) } 100% { transform: translateY(-120vh) } }
.sparkle { position: fixed; width: 8px; height: 8px; border-radius: 50%; z-index: 9999; box-shadow: 0 0 8px rgba(255,255,255,0.9); animation: sparkleFade 1.6s ease-out; }
@keyframes sparkleFade { 0% { transform: scale(0.6); opacity: 1 } 100% { transform: scale(1.4); opacity: 0 } }
.confetti { position: fixed; top: -10vh; width: 12px; height: 18px; z-index: 9999; border-radius: 2px; animation: confettiFall linear; opacity: 0.95; }
@keyframes confettiFall { 0% { transform: translateY(-10vh) rotate(0deg) } 100% { transform: translateY(120vh) rotate(540deg) } }
        `;
        document.head.appendChild(animStyles);
      }
    };

    const getRandomColor = () => {
      const colors = ['#f43f5e', '#fbbf24', '#22d3ee', '#10b981', '#3b82f6', '#a855f7', '#f472b6'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    fetch('http://localhost:8080/api/vote/result', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        if (data.length) startCelebration();
      })
      .catch(err => console.error('Error fetching results:', err));

    // Cleanup on unmount
    return () => {
      clearInterval(fireworksInterval);
    //   clearInterval(balloonInterval);
      clearInterval(sparkleInterval);
    //   clearInterval(confettiInterval);
    };
  }, [token]);

  if (!results.length) return <div style={styles.page}>Loading results...</div>;

  const winner = results.reduce((max, c) => (c.votes > max.votes ? c : max), results[0]);
  const winnerGradient = 'linear-gradient(90deg, #f43f5e, #fbbf24, #22d3ee, #10b981, #a855f7)';

  return (
    <div style={styles.page}>
      <h1 style={{ ...styles.title, ...styles.winnerText, background: winnerGradient }}>
        🎉 Congratulations {winner.name} 🎉
      </h1>
      <h3 style={styles.subtitle}>Winner of this election!</h3>

      <div style={styles.chartBox}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results}>
            <XAxis dataKey="name" tick={{ fill: '#111827', fontWeight: 600 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes">
              {results.map(c => (
                <Cell
                  key={c.id}
                  fill={c.id === winner.id ? 'url(#winnerGradient)' : '#4f46e5'}
                />
              ))}
              <defs>
                <linearGradient id="winnerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff85ff" />
                  <stop offset="50%" stopColor="#7ed6ff" />
                  <stop offset="100%" stopColor="#ffdd59" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
 {/* --- Fancy Promises Card (winner only) --- */}
      {winner.promises?.length > 0 && (
        <div
          className="promises-card"
          role="region"
          aria-label={`Promises by ${winner.name}`}
        >
          <div className="promises-card__header">
            <span className="promises-card__badge">👑</span>
            <div>
              <div className="promises-card__subtitle">Winner Promises</div>
              <h4 className="promises-card__title">{winner.name}</h4>
            </div>
          </div>

          <ul className="promises-card__list">
            {winner.promises.map((p, idx) => (
              <li key={idx} className="promises-card__item">
                <span className="promises-card__dot">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Candidate list (kept simple) */}
      <ul style={styles.list}>
        {results.map(c => (
          <li key={c.id} style={{ ...styles.listItem }}>
  <img
    src={`data:image/png;base64,${c.photo}`}
    alt={c.name}
    style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "8px" }}
  />
  {c.name} → {c.votes} votes
</li>

        ))}
      </ul>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #e0f7ff, #e9fdf5)',
    minHeight: '100vh',
    //overflow: 'hidden',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1f2937',
  },
  winnerText: {
    fontSize: '2.5rem',
    fontWeight: 900,
    background: 'linear-gradient(90deg, #ff85ff, #7ed6ff, #ffdd59, gold)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: `
    2px 2px 0 #d95f5fff,
    4px 4px 6px rgba(114, 94, 173, 0.25),
    6px 6px 10px rgba(18, 238, 102, 0.2)
  `,
    animation: 'shine 3s linear infinite, jump 0.6s ease-in-out infinite',
  },
  subtitle: {
    marginBottom: '1.5rem',
    fontSize: '1.2rem',
    color: '#6b7280',
  },
  chartBox: {
    background: '#fff',
    padding: '1rem',
    borderRadius: 12,
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 auto',
    maxWidth: 500,
    textAlign: 'left',
  },
  listItem: {
    fontSize: '1rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #e5e7eb',
  },
  promisesBox: {
    background: '#f0fdf4',
    padding: '1rem',
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginTop: '2rem',
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  promisesTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#065f46',
    marginBottom: 10,
  },
  promisesList: {
    listStyle: 'disc',
    paddingLeft: '1.5rem',
    marginTop: 5,
  },
  promiseItem: {
    fontSize: '0.95rem',
    color: '#065f46',
    marginBottom: 3,
  },
};

const shineCSS = `
@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('results-shine-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'results-shine-styles';
  styleSheet.type = "text/css";
  styleSheet.innerText = shineCSS;
  document.head.appendChild(styleSheet);
}

export default ResultsPage;
