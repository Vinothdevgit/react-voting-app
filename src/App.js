import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import VotePage from './pages/VotePage';
import AddUserPage from './pages/AddUserPage';
// Import the new AddCandidatePage so admins can add candidates
import AddCandidatePage from './pages/AddCandidatePage';
import ViewVotesPage from './pages/ViewVotesPage';
import ViewCandidatesPage from './pages/CandidatesPage';
import ResultsPage from './pages/ResultsPage';
import VoteWaitingPage from './pages/VoteWaitingPage';
import Layout from './components/Layout';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    // Always sync role from localStorage when token changes
    const storedRole = localStorage.getItem('role');
    if (storedRole && storedRole !== role) {
      setRole(storedRole);
    }
    if (token) {
      localStorage.setItem('jwt', token);
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    }
  }, [role]);

  return (
    <Router>
      {!token ? (
        <Routes>
          <Route path="/*" element={<LoginPage setToken={setToken} setRole={setRole} />} />
        </Routes>
      ) : (
        <Layout setToken={setToken} setRole={setRole}>
          <Routes>
            {role === 'ADMIN' && (
              <>
                {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
                <Route path="/admin/add-user" element={<AddUserPage token={token} />} />
                {/* Provide a route to add new candidates. Only admins can access this. */}
                <Route path="/admin/add-candidate" element={<AddCandidatePage token={token} />} />
                <Route path="/admin/view-votes" element={<ViewVotesPage token={token} />} />
                <Route path="/admin/candidates" element={<ViewCandidatesPage token={token} />} />
              </>
            )}
            {role === 'USER' && <Route path="/vote" element={<VotePage token={token} />} />}
            <Route path="/vote" element={<Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/vote'} />} />
            <Route path="/results" element={<ResultsPage token={token} />} />
            <Route path="/waiting" element={<VoteWaitingPage />} />
          </Routes>
        </Layout>

      )}
    </Router>
  );
}

export default App;
