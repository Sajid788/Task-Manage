const express = require('express');
const { getUsers, updateUserStatus, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(isAdmin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

module.exports = router; 