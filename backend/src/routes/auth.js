const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes — no token needed
router.post('/register', register);
router.post('/login', login);

// Protected routes — authenticate middleware runs first
// If token is invalid, middleware returns 401 and the handler never runs
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
