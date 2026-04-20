const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- DEPLOYMENT SETTINGS ---
const PORT = process.env.PORT || 5000;

// Update this list with your actual Vercel URL once you deploy the frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-fittrack-app.vercel.app" 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
// On Render, ensure you add MONGO_URI to Environment Variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fittrack";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err.message));

// --- MODELS ---
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: { type: String, default: null },
  dailyStepGoal: { type: Number, default: 10000 },
  currentSteps: { type: Number, default: 0 },
}, { timestamps: true }));

const Activity = mongoose.model("Activity", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: Date,
  steps: { type: Number, default: 0 },
  dailyGoal: { type: Number, default: 10000 },
  goalAchieved: { type: Boolean, default: false }
}));

// --- HELPER FUNCTIONS ---
const startOfDay = (date = new Date()) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const deriveMetrics = (steps, goal) => ({
  steps,
  goal,
  progress: goal > 0 ? Math.round((steps / goal) * 100) : 0,
  goalAchieved: steps >= goal,
  calories: Math.round(steps * 0.04),
  distance: Number((steps * 0.0008).toFixed(2)),
  activeMinutes: Math.round(steps / 100)
});

const formatActivity = (activity) => ({
  date: activity.date,
  ...deriveMetrics(activity.steps, activity.dailyGoal)
});

const syncUserActivitySnapshot = async (userId, activity) => {
  await User.findByIdAndUpdate(userId, {
    currentSteps: activity.steps,
    dailyStepGoal: activity.dailyGoal,
  });
};

const getTodayActivity = async (userId) => {
  const today = startOfDay();
  let activity = await Activity.findOne({ userId, date: today });

  if (!activity) {
    const latestRecord = await Activity.findOne({ userId }).sort({ date: -1 });
    activity = await Activity.create({
      userId,
      date: today,
      steps: 0,
      dailyGoal: latestRecord?.dailyGoal || 10000,
      goalAchieved: false,
    });
  }

  await syncUserActivitySnapshot(userId, activity);
  return activity;
};

// --- MIDDLEWARE ---
const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ success: false, message: "No token" });

    const token = auth.split(" ")[1];
    if (!token || !token.startsWith("token_")) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = token.replace("token_", "");
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = { id: userId };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Auth failed" });
  }
};

// --- ROUTES ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, token: "token_" + user._id, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, token: "token_" + user._id, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/activities/today", protect, async (req, res) => {
  try {
    const activity = await getTodayActivity(new mongoose.Types.ObjectId(req.user.id));
    res.json({ success: true, data: formatActivity(activity) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/activities/add-steps", protect, async (req, res) => {
  try {
    const { stepsToAdd } = req.body;
    if (!stepsToAdd || stepsToAdd < 0) return res.status(400).json({ success: false, message: "Invalid steps" });

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const activity = await getTodayActivity(userId);
    activity.steps += stepsToAdd;
    activity.goalAchieved = activity.steps >= activity.dailyGoal;
    await activity.save();
    await syncUserActivitySnapshot(userId, activity);

    res.json({ success: true, data: formatActivity(activity) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/activities/set-goal", protect, async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || goal < 1000) return res.status(400).json({ success: false, message: "Invalid goal" });

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const activity = await getTodayActivity(userId);
    activity.dailyGoal = goal;
    activity.goalAchieved = activity.steps >= activity.dailyGoal;
    await activity.save();
    await syncUserActivitySnapshot(userId, activity);

    res.json({ success: true, data: formatActivity(activity) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/activities/reset", protect, async (req, res) => {
  try {
    const requestedGoal = parseInt(req.body.goal, 10);
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const activity = await getTodayActivity(userId);

    if (req.body.goal !== undefined && (Number.isNaN(requestedGoal) || requestedGoal < 1000)) {
      return res.status(400).json({ success: false, message: "Invalid goal" });
    }

    activity.steps = 0;
    activity.dailyGoal = req.body.goal !== undefined ? requestedGoal : activity.dailyGoal;
    activity.goalAchieved = false;
    await activity.save();
    await syncUserActivitySnapshot(userId, activity);

    res.json({ success: true, message: "Daily activity reset", data: formatActivity(activity) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/activities/weekly", protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    await getTodayActivity(userId);

    const end = startOfDay();
    const start = startOfDay();
    start.setDate(end.getDate() - 6);

    const records = await Activity.find({
      userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    const dailyBreakdown = records.map(formatActivity);
    const totalSteps = dailyBreakdown.reduce((sum, day) => sum + day.steps, 0);

    res.json({
      success: true,
      data: {
        totalSteps,
        daysActive: dailyBreakdown.filter((day) => day.steps > 0).length,
        averageSteps: dailyBreakdown.length ? Math.round(totalSteps / dailyBreakdown.length) : 0,
        goalsAchieved: dailyBreakdown.filter((day) => day.goalAchieved).length,
        dailyBreakdown,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});