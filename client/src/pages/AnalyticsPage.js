import React, { useEffect, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Zap } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

const focusClass = (active) => active ? 'ring-2 ring-cyan-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.5),0_0_35px_rgba(34,211,238,0.18)]' : '';

const AnalyticsPage = ({ focusTarget }) => {
  const { loading, weekly, last7Days, monthlyTotals, todayGoal } = useActivity();

  useEffect(() => {
    if (!focusTarget) return;
    const node = document.getElementById(`focus-${focusTarget}`);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusTarget]);

  const weeklyData = useMemo(() => last7Days.map((item) => ({
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    steps: item.steps,
    goal: item.goal,
  })), [last7Days]);

  const bestDay = useMemo(() => {
    if (!weeklyData.length) return 0;
    return Math.max(...weeklyData.map((item) => item.steps));
  }, [weeklyData]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-400 text-sm">Track your progress over time</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 transition">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg mb-2">
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <p className="text-gray-400 text-xs text-center mb-1">Daily Average</p>
              <p className="text-2xl font-bold">{weekly?.averageSteps?.toLocaleString() ?? 0}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-green-500/30 transition">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-500/20 rounded-lg mb-2">
                <Calendar className="text-green-400" size={20} />
              </div>
              <p className="text-gray-400 text-xs text-center mb-1">Best Day</p>
              <p className="text-2xl font-bold">{bestDay.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-orange-500/30 transition">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-orange-500/20 rounded-lg mb-2">
                <Zap className="text-orange-400" size={20} />
              </div>
              <p className="text-gray-400 text-xs text-center mb-1">Goals Hit</p>
              <p className="text-2xl font-bold">{weekly?.goalsAchieved ?? 0}</p>
            </div>
          </div>
        </div>

        <div id="focus-weekly-trend" className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 hover:border-blue-500/30 transition ${focusClass(focusTarget === 'weekly-trend')}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">7-Day Trend</h2>
              <p className="text-gray-400 text-sm">Live weekly activity vs goal</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="steps" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSteps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-green-500/30 transition">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Calendar className="text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Monthly Overview</h2>
              <p className="text-gray-400 text-sm">Rolling 4-week totals</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTotals.length ? monthlyTotals : [{ week: 'Week 1', steps: 0 }] }>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="steps" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <p className="mt-4 text-sm text-slate-400">Current daily goal: {todayGoal.toLocaleString()} steps</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
