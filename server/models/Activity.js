const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true,
      set: (date) => {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      },
      index: true
    },

    steps: {
      type: Number,
      default: 0,
      min: 0
    },

    dailyGoal: {
      type: Number,
      default: 10000,
      min: 1000
    },

    calories: {
      type: Number,
      default: 0,
      min: 0
    },

    distance: {
      type: Number,
      default: 0,
      min: 0
    },

    activeMinutes: {
      type: Number,
      default: 0,
      min: 0
    },

    notes: String,

    goalAchieved: {
      type: Boolean,
      default: false
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'activities'
  }
);

// ✅ ONE RECORD PER DAY
activitySchema.index({ userId: 1, date: 1 }, { unique: true });


// ✅ AUTO CALCULATE goalAchieved
activitySchema.pre('save', function (next) {
  this.goalAchieved = this.steps >= this.dailyGoal;
  this.lastUpdated = new Date();
  next();
});


// ✅ HELPER: Progress %
activitySchema.methods.getProgress = function () {
  if (this.dailyGoal === 0) return 0;
  return Math.round((this.steps / this.dailyGoal) * 100);
};


// ✅ GET OR CREATE TODAY RECORD
activitySchema.statics.getTodayRecord = async function (userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let record = await this.findOne({ userId, date: today });

  if (!record) {
    // 🔥 Copy yesterday goal (better UX)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastRecord = await this.findOne({
      userId,
      date: yesterday
    });

    const goal = lastRecord ? lastRecord.dailyGoal : 10000;

    record = await this.create({
      userId,
      date: today,
      steps: 0,
      dailyGoal: goal,
      calories: 0,
      distance: 0,
      activeMinutes: 0
    });
  }

  return record;
};


// ✅ UPDATE TODAY STEPS (FIXED)
activitySchema.statics.updateTodaySteps = async function (userId, steps) {
  const record = await this.getTodayRecord(userId);

  record.steps = steps;
  await record.save();

  return record;
};


// ✅ ADD STEPS
activitySchema.statics.addSteps = async function (userId, stepsToAdd) {
  const record = await this.getTodayRecord(userId);

  record.steps += stepsToAdd;
  await record.save();

  return record;
};


// ✅ SET GOAL
activitySchema.statics.setDailyGoal = async function (userId, goal) {
  const record = await this.getTodayRecord(userId);

  record.dailyGoal = goal;
  await record.save();

  return record;
};


// ✅ WEEKLY SUMMARY
activitySchema.statics.getWeeklySummary = async function (userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const records = await this.find({
    userId,
    date: { $gte: weekAgo, $lte: today }
  }).sort({ date: 1 });

  const summary = {
    totalSteps: 0,
    daysActive: 0,
    averageSteps: 0,
    goalsAchieved: 0,
    dailyBreakdown: []
  };

  records.forEach(record => {
    summary.totalSteps += record.steps;
    if (record.steps > 0) summary.daysActive++;
    if (record.goalAchieved) summary.goalsAchieved++;

    summary.dailyBreakdown.push({
      date: record.date,
      steps: record.steps,
      goal: record.dailyGoal,
      goalAchieved: record.goalAchieved,
      progress: record.getProgress()
    });
  });

  summary.averageSteps =
    records.length > 0
      ? Math.round(summary.totalSteps / records.length)
      : 0;

  return summary;
};


// ✅ MONTHLY SUMMARY
activitySchema.statics.getMonthlySummary = async function (userId, year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const records = await this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  let totalSteps = 0;
  let goalsAchieved = 0;

  records.forEach(r => {
    totalSteps += r.steps;
    if (r.goalAchieved) goalsAchieved++;
  });

  return {
    year,
    month,
    totalSteps,
    daysActive: records.length,
    averageSteps:
      records.length > 0
        ? Math.round(totalSteps / records.length)
        : 0,
    goalsAchieved
  };
};


// ✅ YEARLY SUMMARY
activitySchema.statics.getYearlySummary = async function (userId, year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const records = await this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  let totalSteps = 0;
  let goalsAchieved = 0;

  records.forEach(r => {
    totalSteps += r.steps;
    if (r.goalAchieved) goalsAchieved++;
  });

  return {
    year,
    totalSteps,
    daysActive: records.length,
    averageSteps:
      records.length > 0
        ? Math.round(totalSteps / records.length)
        : 0,
    goalsAchieved
  };
};


// ✅ 7 DAY TREND
activitySchema.statics.get7DayTrend = async function (userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const records = await this.find({
    userId,
    date: { $gte: weekAgo, $lte: today }
  }).sort({ date: 1 });

  return records.map(r => ({
    date: r.date,
    steps: r.steps,
    goal: r.dailyGoal,
    progress: r.getProgress(),
    goalAchieved: r.goalAchieved
  }));
};


module.exports = mongoose.model('Activity', activitySchema);