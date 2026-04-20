import React, { useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Zap, Share2, Target, Trophy } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

const focusClass = (active) => active ? 'ring-2 ring-cyan-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.5),0_0_35px_rgba(34,211,238,0.18)]' : '';

const ReportsPage = ({ focusTarget }) => {
  const { loading, weekly, last7Days, goalCompletionRate, bestDay, todayGoal } = useActivity();

  useEffect(() => {
    if (!focusTarget) return;
    const node = document.getElementById(`focus-${focusTarget}`);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusTarget]);

  const dailyData = useMemo(() => last7Days.map((item) => ({
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    steps: item.steps,
    goal: item.goal,
    progress: item.progress,
  })), [last7Days]);

  const improvement = useMemo(() => {
    if (dailyData.length < 2) return 0;
    const mid = Math.floor(dailyData.length / 2);
    const firstHalf = dailyData.slice(0, mid);
    const secondHalf = dailyData.slice(mid);
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.steps, 0) / Math.max(firstHalf.length, 1);
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.steps, 0) / Math.max(secondHalf.length, 1);
    if (firstAvg === 0) return secondAvg > 0 ? 100 : 0;
    return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
  }, [dailyData]);

  const bestDayLabel = bestDay?.date
    ? new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long' })
    : 'No activity yet';

  if (loading) {
    return <div className="text-white text-center mt-10">Loading reports...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 mt-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold">Weekly Report</h1>
              <p className="text-gray-400 text-sm">Last 7 days of synced activity</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-800 transition">
                <Share2 size={20} className="text-gray-400" />
              </button>
              <button className="p-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition">
                <Zap size={20} className="text-purple-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6 hover:border-green-500/30 transition">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Performance Summary</h2>
              <p className="text-gray-400 text-sm">Your progress this week</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-green-400 mb-2">{improvement >= 0 ? '+' : ''}{improvement}%</p>
            <p className="text-gray-400 text-sm">Improvement across the week</p>
            <p className="text-gray-300 text-sm mt-2">These values now come directly from your stored steps and daily goal.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Total Steps</p>
              <p className="text-2xl font-bold">{weekly?.totalSteps?.toLocaleString() ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Daily Average</p>
              <p className="text-2xl font-bold">{weekly?.averageSteps?.toLocaleString() ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Goal Rate</p>
              <p className="text-2xl font-bold">{goalCompletionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6 hover:border-purple-500/30 transition">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Award className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Daily Breakdown</h2>
              <p className="text-gray-400 text-sm">Saved daily steps</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="steps" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 5 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div id="focus-goals-summary" className={`grid md:grid-cols-2 gap-6 mb-6 ${focusClass(focusTarget === 'goals-summary')}`}>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-green-500/30 transition">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Target className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Goals Achieved</p>
                <p className="text-3xl font-bold">{weekly?.goalsAchieved ?? 0}/{dailyData.length || 7}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-pink-500/30 transition">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Trophy className="text-pink-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Best Day</p>
                <p className="text-3xl font-bold">{bestDay?.steps?.toLocaleString() ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="focus-insights" className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition ${focusClass(focusTarget === 'insights')}`}>
          <div className="flex items-start gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Zap className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Key Insights</h2>
              <p className="text-gray-400 text-sm">Live analysis from current backend data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-2xl">OK</div>
              <div>
                <p className="font-semibold text-sm mb-1">Most Active Day</p>
                <p className="text-gray-400 text-sm">{bestDayLabel} was your best day with {bestDay?.steps?.toLocaleString() ?? 0} steps.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">GO</div>
              <div>
                <p className="font-semibold text-sm mb-1">Current Goal</p>
                <p className="text-gray-400 text-sm">Your synced daily goal is {todayGoal.toLocaleString()} steps, and all pages now read from this same value.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">UP</div>
              <div>
                <p className="font-semibold text-sm mb-1">Next Milestone</p>
                <p className="text-gray-400 text-sm">Hit your goal on {Math.max(1, 7 - (weekly?.goalsAchieved ?? 0))} more day(s) to improve your weekly completion rate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
