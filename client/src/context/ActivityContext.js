import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ActivityContext = createContext(null);

const getMonthRange = (date = new Date()) => ({
  year: date.getFullYear(),
  month: date.getMonth(),
});

const getRelativeTimeLabel = (hoursAgo) => {
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
};

export const ActivityProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [today, setToday] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivityData = useCallback(async ({ silent = false } = {}) => {
    if (!isAuthenticated) {
      setToday(null);
      setWeekly(null);
      setHistory([]);
      return;
    }

    const setBusy = silent ? setRefreshing : setLoading;
    setBusy(true);
    setError(null);

    try {
      const [{ data: todayRes }, { data: weeklyRes }, { data: historyRes }] = await Promise.all([
        api.get('/activities/today'),
        api.get('/activities/weekly'),
        api.get('/activities/history', { params: { days: 28 } }),
      ]);

      setToday(todayRes.data);
      setWeekly(weeklyRes.data);
      setHistory(historyRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load activity data');
    } finally {
      setBusy(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const refreshActivity = useCallback(async () => {
    await fetchActivityData({ silent: true });
  }, [fetchActivityData]);

  const addSteps = useCallback(async (stepsToAdd) => {
    const res = await api.post('/activities/add-steps', { stepsToAdd });
    setToday(res.data.data);
    await fetchActivityData({ silent: true });
    return res.data.data;
  }, [fetchActivityData]);

  const setGoal = useCallback(async (goal) => {
    const res = await api.post('/activities/set-goal', { goal });
    setToday(res.data.data);
    await fetchActivityData({ silent: true });
    return res.data.data;
  }, [fetchActivityData]);

  const resetActivity = useCallback(async (goal) => {
    const payload = goal ? { goal } : {};
    const res = await api.post('/activities/reset', payload);
    setToday(res.data.data);
    await fetchActivityData({ silent: true });
    return res.data.data;
  }, [fetchActivityData]);

  const derived = useMemo(() => {
    const todaySteps = today?.steps ?? 0;
    const todayGoal = today?.goal ?? 10000;
    const todayProgress = today?.progress ?? 0;
    const todayCalories = today?.calories ?? Math.round(todaySteps * 0.04);
    const todayDistance = today?.distance ?? Number((todaySteps * 0.0008).toFixed(2));
    const todayActiveMinutes = today?.activeMinutes ?? Math.round(todaySteps / 100);
    const remainingSteps = Math.max(todayGoal - todaySteps, 0);

    const weeklyBreakdown = weekly?.dailyBreakdown ?? [];
    const last7Days = history.slice(-7);
    const monthlyTotals = [];

    for (let index = 0; index < history.length; index += 7) {
      const chunk = history.slice(index, index + 7);
      if (!chunk.length) continue;

      monthlyTotals.push({
        week: `Week ${monthlyTotals.length + 1}`,
        steps: chunk.reduce((sum, item) => sum + item.steps, 0),
      });
    }

    const bestDay = last7Days.reduce((best, day) => {
      if (!best || day.steps > best.steps) return day;
      return best;
    }, null);

    const goalCompletionRate = weekly?.dailyBreakdown?.length
      ? Math.round((weekly.goalsAchieved / weekly.dailyBreakdown.length) * 100)
      : 0;

    const notifications = [];

    if (today?.goalAchieved) {
      notifications.push({
        id: 'goal-achieved',
        title: 'Goal Achieved!',
        message: `You reached your daily goal of ${todayGoal.toLocaleString()} steps.`,
        time: getRelativeTimeLabel(2),
        page: 'reports',
        target: 'goals-summary',
        theme: 'from-emerald-500/20 to-cyan-400/10 border-emerald-400/25',
        iconBg: 'from-emerald-500 to-green-400',
        iconText: 'OK',
      });
    }

    notifications.push({
      id: 'weekly-progress',
      title: 'Weekly Progress',
      message: `You're ${goalCompletionRate}% towards your weekly goal. Keep moving!`,
      time: getRelativeTimeLabel(5),
      page: 'stats',
      target: 'weekly-trend',
      theme: 'from-violet-500/20 to-sky-400/10 border-violet-400/25',
      iconBg: 'from-violet-500 to-indigo-400',
      iconText: 'UP',
    });

    if (remainingSteps > 0) {
      notifications.push({
        id: 'daily-reminder',
        title: 'Daily Reminder',
        message: `You have ${remainingSteps.toLocaleString()} steps left to reach today's goal.`,
        time: getRelativeTimeLabel(8),
        page: 'home',
        target: 'progress-card',
        theme: 'from-pink-500/20 to-fuchsia-400/10 border-pink-400/25',
        iconBg: 'from-pink-500 to-purple-400',
        iconText: 'GO',
      });
    }

    if (todaySteps < Math.round(todayGoal * 0.4)) {
      notifications.push({
        id: 'low-activity',
        title: 'Low Activity Alert',
        message: 'You have not logged many steps yet today. Add steps to stay on track.',
        time: getRelativeTimeLabel(12),
        page: 'home',
        target: 'add-steps',
        theme: 'from-orange-500/20 to-red-400/10 border-orange-400/25',
        iconBg: 'from-orange-500 to-red-400',
        iconText: '!',
      });
    }

    if ((weekly?.goalsAchieved ?? 0) > 0) {
      notifications.push({
        id: 'streak',
        title: `${weekly.goalsAchieved}-Day Goal Streak`,
        message: `Nice work. You have hit your goal on ${weekly.goalsAchieved} day(s) this week.`,
        time: getRelativeTimeLabel(24),
        page: 'reports',
        target: 'insights',
        theme: 'from-amber-500/20 to-orange-300/10 border-amber-400/25',
        iconBg: 'from-amber-500 to-orange-400',
        iconText: '7D',
      });
    }

    return {
      todaySteps,
      todayGoal,
      todayProgress,
      todayCalories,
      todayDistance,
      todayActiveMinutes,
      remainingSteps,
      weeklyBreakdown,
      last7Days,
      monthlyTotals,
      bestDay,
      goalCompletionRate,
      currentMonth: getMonthRange(),
      notifications,
      unreadNotifications: notifications.length,
    };
  }, [history, today, weekly]);

  return (
    <ActivityContext.Provider
      value={{
        today,
        weekly,
        history,
        loading,
        refreshing,
        error,
        addSteps,
        setGoal,
        resetActivity,
        refreshActivity,
        ...derived,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);

  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }

  return context;
};
