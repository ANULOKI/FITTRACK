import React, { useEffect, useMemo, useState } from 'react';
import { Target, TrendingUp, Flame, Lock } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

const focusClass = (active) => active ? 'ring-2 ring-cyan-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.5),0_0_35px_rgba(34,211,238,0.18)]' : '';

const GoalsPage = ({ focusTarget }) => {
  const { loading, refreshing, todayGoal, todayProgress, weekly, setGoal } = useActivity();
  const [saving, setSaving] = useState(false);

  const goalValue = todayGoal || 10000;

  useEffect(() => {
    if (!focusTarget) return;
    const node = document.getElementById(`focus-${focusTarget}`);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusTarget]);

  const weeklyProgress = useMemo(() => {
    if (!weekly?.dailyBreakdown?.length) {
      return todayProgress;
    }

    const totalProgress = weekly.dailyBreakdown.reduce((sum, day) => sum + day.progress, 0);
    return Math.round(totalProgress / weekly.dailyBreakdown.length);
  }, [todayProgress, weekly]);

  const handleGoalChange = async (value) => {
    setSaving(true);
    try {
      await setGoal(value);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading goals...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold">Your Goals</h1>
          <p className="text-gray-400 text-sm">Set and track your fitness targets</p>
        </div>

        <div id="focus-goal-control" className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6 ${focusClass(focusTarget === 'goal-control')}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Target className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Daily Step Goal</h2>
                <p className="text-gray-400 text-sm">Adjust your target</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">{goalValue.toLocaleString()}</div>
              <div className="text-xs text-slate-400">{saving || refreshing ? 'Saving...' : 'Synced'}</div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={goalValue}
              onChange={(e) => handleGoalChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
            />

            <div className="flex justify-between text-xs text-gray-400">
              <span>1,000</span>
              <span>20,000</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <TrendingUp className="text-pink-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Recommendation</h2>
              <p className="text-gray-400 text-sm">Based on your live activity</p>
            </div>
          </div>

          <p className="mt-4 text-gray-300 text-sm">
            We recommend around <span className="font-bold text-pink-300">{Math.round(goalValue * 1.2).toLocaleString()}</span> steps for your next stretch target.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Flame className="text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Weekly Progress</h2>
              <p className="text-gray-400 text-sm">Auto-calculated from your saved records</p>
            </div>
          </div>

          <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full transition-all" style={{ width: `${Math.min(weeklyProgress, 100)}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-300">Average weekly goal completion: {weeklyProgress}%</p>
        </div>

        <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/30 rounded-lg">
              <Lock className="text-orange-400" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{weekly?.goalsAchieved ?? 0} Goals Hit This Week</h2>
              <p className="text-gray-300 text-sm">This updates automatically when your steps or goal changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
