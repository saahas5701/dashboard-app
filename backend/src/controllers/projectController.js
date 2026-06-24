const { pool } = require('../db');

const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ projects: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('getAllProjects:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    res.json({ project: result.rows[0] });
  } catch (err) {
    console.error('getProjectById:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const createProject = async (req, res) => {
  const { title, description, status, tech_stack, github_url } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const result = await pool.query(
      `INSERT INTO projects (user_id, title, description, status, tech_stack, github_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.userId, title, description || '', status || 'active', tech_stack || '', github_url || '']
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error('createProject:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  const { title, description, status, tech_stack, github_url } = req.body;
  const { id } = req.params;

  try {
    const existing = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existing.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    const result = await pool.query(
      `UPDATE projects
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           tech_stack = COALESCE($4, tech_stack),
           github_url = COALESCE($5, github_url),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, description, status, tech_stack, github_url, id, req.user.userId]
    );

    res.json({ project: result.rows[0] });
  } catch (err) {
    console.error('updateProject:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteProject:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await pool.query(
      `SELECT
        COUNT(*) AS total_projects,
        COUNT(*) FILTER (WHERE status = 'active') AS active_projects,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_projects,
        COUNT(*) FILTER (WHERE status = 'paused') AS paused_projects
       FROM projects WHERE user_id = $1`,
      [req.user.userId]
    );

    const recent = await pool.query(
      'SELECT id, title, status, tech_stack, created_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3',
      [req.user.userId]
    );

    res.json({ stats: stats.rows[0], recent_projects: recent.rows });
  } catch (err) {
    console.error('getDashboardStats:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getDashboardStats };
