const Activity = require('../models/Activity');


// ✅ GET TODAY
exports.getToday = async (req, res) => {
  try {
    const userId = req.user.id;

    const record = await Activity.getTodayRecord(userId);

    res.json({
      success: true,
      data: {
        date: record.date,
        steps: record.steps,
        goal: record.dailyGoal,
        progress: record.getProgress(),
        goalAchieved: record.goalAchieved
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ ADD STEPS
exports.addSteps = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stepsToAdd } = req.body;

    if (!stepsToAdd || stepsToAdd < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid steps'
      });
    }

    const record = await Activity.addSteps(userId, stepsToAdd);

    res.json({
      success: true,
      message: 'Steps added',
      data: {
        steps: record.steps,
        goal: record.dailyGoal,
        progress: record.getProgress(),
        goalAchieved: record.goalAchieved
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ SET GOAL
exports.setGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal } = req.body;

    if (!goal || goal < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal'
      });
    }

    const record = await Activity.setDailyGoal(userId, goal);

    res.json({
      success: true,
      message: 'Goal updated',
      data: {
        steps: record.steps,
        goal: record.dailyGoal,
        progress: record.getProgress(),
        goalAchieved: record.goalAchieved
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ WEEKLY
exports.getWeekly = async (req, res) => {
  try {
    const data = await Activity.getWeeklySummary(req.user.id);

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ MONTHLY
exports.getMonthly = async (req, res) => {
  try {
    const { year, month } = req.query;

    const data = await Activity.getMonthlySummary(
      req.user.id,
      parseInt(year),
      parseInt(month)
    );

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ YEARLY
exports.getYearly = async (req, res) => {
  try {
    const { year } = req.query;

    const data = await Activity.getYearlySummary(
      req.user.id,
      parseInt(year)
    );

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ TREND
exports.getTrend = async (req, res) => {
  try {
    const data = await Activity.get7DayTrend(req.user.id);

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};