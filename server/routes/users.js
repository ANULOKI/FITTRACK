const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc Get leaderboard
// @route GET /api/users/leaderboard
// @access Public
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('name email currentSteps avatar')
      .sort({ currentSteps: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc Update daily step goal
// @route PUT /api/users/goal/:id
// @access Private
router.put('/goal/:id', protect, async (req, res) => {
  try {
    const { dailyStepGoal } = req.body;

    if (!dailyStepGoal || dailyStepGoal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid goal value'
      });
    }

    // Check ownership
    if (req.params.id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { dailyStepGoal },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc Update current steps
// @route PUT /api/users/steps/:id
// @access Private
router.put('/steps/:id', protect, async (req, res) => {
  try {
    const { steps } = req.body;

    if (steps === undefined || steps < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid steps value'
      });
    }

    // Check ownership
    if (req.params.id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { currentSteps: steps },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Steps updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc Update user profile
// @route PUT /api/users/profile/:id
// @access Private
router.put('/profile/:id', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Check ownership
    if (req.params.id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc Get user ranking
// @route GET /api/users/ranking
// @access Public
router.get('/ranking', async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user ranking
    const ranking = await User.countDocuments({
      currentSteps: { $gt: user.currentSteps }
    });

    res.status(200).json({
      success: true,
      data: {
        rank: ranking + 1,
        totalUsers: await User.countDocuments(),
        userSteps: user.currentSteps
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;