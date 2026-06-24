import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/auth/profile')
      .then(res => {
        const u = res.data.user;
        setForm({ name: u.name, bio: u.bio || '' });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.put('/api/auth/profile', form);
      // Update the user in context so sidebar name updates too
      const token = localStorage.getItem('token');
      login(token, res.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Your Profile</h1>
            <p className="page-subtitle">Manage your account details</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading profile...</p>
        ) : (
          <div style={{ maxWidth: 540 }}>
            {/* Profile Card */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                {/* Avatar circle with initials */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 24, fontWeight: 700,
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{user?.name}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{user?.email}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                    Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {error && <div className="error-msg">{error}</div>}
              {success && <div className="success-msg">{success}</div>}

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={user?.email}
                    disabled
                    style={{ background: '#f8fafc', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#94a3b8', fontSize: 11 }}>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Account Info */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Account Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'User ID', value: `#${user?.id}` },
                  { label: 'Email', value: user?.email },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                    fontSize: 13,
                  }}>
                    <span style={{ color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
