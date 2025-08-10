import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function ViewVotesPage({ token }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/votes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching vote summary:', err));
  }, [token]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📈 Vote Summary Dashboard</h2>

      {data.length === 0 ? (
        <p style={styles.noData}>No votes recorded yet.</p>
      ) : (
        <div style={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="candidateName" angle={-15} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalVotes" fill="#3498db" name="Total Votes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: '"Segoe UI", sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: 'calc(100vh - 60px)',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem',
    fontSize: '1.8rem',
  },
  chartWrapper: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  noData: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    fontSize: '1.1rem',
  },
};

export default ViewVotesPage;
