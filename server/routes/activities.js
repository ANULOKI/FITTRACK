const express = require('express');
const router = express.Router();

const {
  getToday,
  addSteps,
  setGoal,
  getWeekly,
  getMonthly,
  getYearly,
  getTrend
} = require('../controllers/activityController');

const { protect } = require('../middleware/auth');

// ✅ Protect all routes
router.use(protect);

// ✅ REQUIRED ROUTES (this fixes your issue)
router.get('/today', getToday);
router.post('/add-steps', addSteps);
router.post('/set-goal', setGoal);

// ✅ Optional stats
router.get('/weekly', getWeekly);
router.get('/monthly', getMonthly);
router.get('/yearly', getYearly);
router.get('/trend', getTrend);

module.exports = router;