const express = require('express');
const { 
  getTasks, 
  createTask, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  bulkUpdateTasks 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

const router = express.Router();

// All task routes are protected
router.use(protect);

// Routes for all authenticated users
router.route('/')
  .get(getTasks)
  .post(createTask);

// Admin only routes - MUST come before /:id routes
router.patch('/bulk-update', isAdmin, bulkUpdateTasks);

// Parameter routes must come after specific routes
router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router; 