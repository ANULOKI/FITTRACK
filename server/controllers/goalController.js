const Goal = require('../models/Goal');

// @desc Create goal
// @route POST /api/goals
// @access Private
exports.createGoal = async (req, res) => {
  try {
    const { goalType, targetValue, deadline, description, priority } = req.body;

    // Validation
    if (!goalType || !targetValue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide goalType and targetValue'
      });
    }

    const goal = await Goal.create({
      user: req.userId,
      goalType,
      targetValue,
      deadline: deadline || null,
      description: description || '',
      priority: priority || 'medium'
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get all goals
// @route GET /api/goals
// @access Private
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get active goals
// @route GET /api/goals/active
// @access Private
exports.getActiveGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.userId,
      completed: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Update goal
// @route PUT /api/goals/:id
// @access Private
exports.updateGoal = async (req, res) => {
  try {
    const { currentValue, completed, deadline, description, priority } = req.body;

    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Check ownership
    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this goal'
      });
    }

    // Update fields
    if (currentValue !== undefined) goal.currentValue = currentValue;
    if (completed !== undefined) {
      goal.completed = completed;
      if (completed) {
        goal.completedAt = new Date();
      } else {
        goal.completedAt = null;
      }
    }
    if (deadline !== undefined) goal.deadline = deadline;
    if (description !== undefined) goal.description = description;
    if (priority !== undefined) goal.priority = priority;

    goal = await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Check ownership
    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this goal'
      });
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get goal progress
// @route GET /api/goals/:id/progress
// @access Private
exports.getGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Check ownership
    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const progress = Math.round((goal.currentValue / goal.targetValue) * 100);

    res.status(200).json({
      success: true,
      data: {
        goal,
        progress: Math.min(progress, 100),
        remaining: Math.max(0, goal.targetValue - goal.currentValue)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};