import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import confetti from 'canvas-confetti';

function ResultsPage({ token }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let fireworksInterval, balloonInterval, sparkleInterval, confettiInterval;

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
      balloonInterval = setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.backgroundColor = getRandomColor();
        document.body.appendChild(balloon);
        setTimeout(() => balloon.remove(), 15000);
      }, 500);

      // Sparkles
      sparkleInterval = setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
      }, 300);

      // Falling confetti
      confettiInterval = setInterval(() => {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.backgroundColor = getRandomColor();
        conf.style.animationDuration = `${5 + Math.random() * 5}s`;
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 10000);
      }, 200);
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
      clearInterval(balloonInterval);
      clearInterval(sparkleInterval);
      clearInterval(confettiInterval);
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
                  fill={c.id === winner.id
                    ? 'url(#winnerGradient)' // reference to chart gradient
                    : '#4f46e5'
                  }
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

      <ul style={styles.list}>
        {results.map(c => (
          <li
            key={c.id}
            style={{
              ...styles.listItem,
              fontWeight: c.id === winner.id ? 700 : 400,
              color: c.id === winner.id ? '#f43f5e' : '#1f2937'
            }}
          >
            {c.symbol || '🗳️'} {c.name} → {c.votes} votes
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
    background: 'linear-gradient(135deg, #e0f7ff, #e9fdf5)', // soft pastel bg
    minHeight: '100vh',
    overflow: 'hidden',
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
};

const shineCSS = `
@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = shineCSS;
document.head.appendChild(styleSheet);

/* Glow animation CSS */
const glowStyle = `
@keyframes glow {
  0% { text-shadow: 0 0 10px #0f960fff, 0 0 20px #f43f5e, 0 0 30px #fbbf24; }
  50% { text-shadow: 0 0 20px #22d3ee, 0 0 30px #10b981, 0 0 40px #a855f7; }
  100% { text-shadow: 0 0 10px #35b427ff, 0 0 20px #f43f5e, 0 0 30px #fbbf24; }
}
`;

export default ResultsPage;
