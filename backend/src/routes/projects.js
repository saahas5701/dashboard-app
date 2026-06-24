const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDashboardStats,
} = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');

// ALL project routes are protected — user must be logged in
// authenticate runs before every route handler here
router.use(authenticate);

router.get('/stats', getDashboardStats);      // GET /api/projects/stats
router.get('/', getAllProjects);               // GET /api/projects
router.get('/:id', getProjectById);           // GET /api/projects/:id
router.post('/', createProject);              // POST /api/projects
router.put('/:id', updateProject);            // PUT /api/projects/:id
router.delete('/:id', deleteProject);         // DELETE /api/projects/:id

module.exports = router;
