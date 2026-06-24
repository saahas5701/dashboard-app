import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/projects/stats')
      .then(res => {
        setStats(res.data.stats);
        setRecentProjects(res.data.recent_projects);
      })
      .catch(err => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const map = {
      active: 'badge-active',
      completed: 'badge-completed',
      paused: 'badge-paused',
    };
    return <span className={`badge ${map[status] || 'badge-active'}`}>{status}</span>;
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's what's happening with your projects</p>
          </div>
          <Link to="/projects" className="btn btn-primary">+ New Project</Link>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats?.total_projects || 0}</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#10b981' }}>
                  {stats?.active_projects || 0}
                </div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#2563eb' }}>
                  {stats?.completed_projects || 0}
                </div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#f59e0b' }}>
                  {stats?.paused_projects || 0}
                </div>
                <div className="stat-label">Paused</div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent Projects</h2>
                <Link to="/projects" style={{ fontSize: 13, color: '#2563eb' }}>View all →</Link>
              </div>

              {recentProjects.length === 0 ? (
                <div className="empty-state">
                  <p>No projects yet. Create your first one!</p>
                  <Link to="/projects" className="btn btn-primary">+ Create Project</Link>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '8px 0', color: '#64748b', fontWeight: 500 }}>Project</th>
                      <th style={{ padding: '8px 0', color: '#64748b', fontWeight: 500 }}>Tech Stack</th>
                      <th style={{ padding: '8px 0', color: '#64748b', fontWeight: 500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: 500 }}>{p.title}</td>
                        <td style={{ padding: '12px 0', color: '#64748b' }}>{p.tech_stack || '—'}</td>
                        <td style={{ padding: '12px 0' }}>{statusBadge(p.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
