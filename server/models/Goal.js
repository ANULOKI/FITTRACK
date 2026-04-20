const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID']
  },
  goalType: {
    type: String,
    enum: ['daily_steps', 'weekly_steps', 'monthly_steps', 'custom'],
    required: [true, 'Please provide goal type']
  },
  targetValue: {
    type: Number,
    required: [true, 'Please provide target value']
  },
  currentValue: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
goalSchema.index({ user: 1, createdAt: -1 });
goalSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('Goal', goalSchema);