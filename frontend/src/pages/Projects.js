import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const STATUS_OPTIONS = ['active', 'completed', 'paused'];

const defaultForm = {
  title: '', description: '', status: 'active', tech_stack: '', github_url: ''
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data.projects);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditingProject(null);
    setForm(defaultForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      status: project.status,
      tech_stack: project.tech_stack,
      github_url: project.github_url,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}`, form);
      } else {
        await axios.post('/api/projects', form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const statusBadge = (status) => {
    const map = { active: 'badge-active', completed: 'badge-completed', paused: 'badge-paused' };
    return <span className={`badge ${map[status] || 'badge-active'}`}>{status}</span>;
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
            <p>No projects yet. Create your first one!</p>
            <button className="btn btn-primary" onClick={openCreate}>+ Create Project</button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description || 'No description'}</p>
                {project.tech_stack && (
                  <p style={{ fontSize: 12, color: '#2563eb', marginBottom: 8 }}>
                    🛠 {project.tech_stack}
                  </p>
                )}
                {project.github_url && (
                  <p style={{ fontSize: 12, marginBottom: 8 }}>
                    <a href={project.github_url} target="_blank" rel="noreferrer"
                       style={{ color: '#64748b' }}>
                      🔗 GitHub
                    </a>
                  </p>
                )}
                <div className="project-card-footer">
                  {statusBadge(project.status)}
                  <div className="project-actions">
                    <button className="btn btn-secondary"
                      style={{ padding: '5px 12px', fontSize: 12 }}
                      onClick={() => openEdit(project)}>
                      Edit
                    </button>
                    <button className="btn btn-danger"
                      style={{ padding: '5px 12px', fontSize: 12 }}
                      onClick={() => handleDelete(project.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>
                  ✕
                </button>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="My awesome project" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="What does this project do?" />
                </div>
                <div className="form-group">
                  <label>Tech Stack</label>
                  <input value={form.tech_stack}
                    onChange={e => setForm({...form, tech_stack: e.target.value})}
                    placeholder="React, Node.js, PostgreSQL" />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input value={form.github_url}
                    onChange={e => setForm({...form, github_url: e.target.value})}
                    placeholder="https://github.com/..." />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
