const express = require('express');
const {
  createGoal,
  getGoals,
  getActiveGoals,
  updateGoal,
  deleteGoal,
  getGoalProgress
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Main routes
router.post('/', createGoal);
router.get('/', getGoals);
router.get('/active/list', getActiveGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

// Progress route
router.get('/:id/progress', getGoalProgress);

module.exports = router;