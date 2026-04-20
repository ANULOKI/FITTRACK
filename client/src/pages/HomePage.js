import React, { useEffect, useState } from 'react';
import { Activity, Flame, MapPinned, Heart, RotateCcw, Target } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

const StatCard = ({ icon: Icon, iconClassName, value, label }) => (
  <div className="rounded-[18px] border border-white/10 bg-[#2a2c58]/80 px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
    <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}>
      <Icon size={18} strokeWidth={2.1} />
    </div>
    <div className="text-[15px] font-bold text-white">{value}</div>
    <div className="mt-1 text-[10px] text-slate-300/80">{label}</div>
  </div>
);

const focusClass = (active) => active ? 'ring-2 ring-cyan-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.5),0_0_35px_rgba(34,211,238,0.18)]' : '';

const HomePage = ({ focusTarget }) => {
  const {
    loading,
    refreshing,
    todaySteps,
    todayGoal,
    todayProgress,
    todayCalories,
    todayDistance,
    todayActiveMinutes,
    remainingSteps,
    addSteps,
    resetActivity,
  } = useActivity();
  const [goalInput, setGoalInput] = useState(String(todayGoal || 10000));

  const percentage = Math.min(todayProgress, 100);
  const circumference = 2 * Math.PI * 72;
  const weeklyAverage = Math.round((todaySteps + 8625) / 2);

  useEffect(() => {
    setGoalInput(String(todayGoal || 10000));
  }, [todayGoal]);

  useEffect(() => {
    if (!focusTarget) return;
    const node = document.getElementById(`focus-${focusTarget}`);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusTarget]);

  const handleAddSteps = async () => {
    try {
      await addSteps(500);
    } catch (error) {
      console.log('ADD STEPS ERROR:', error.response?.data || error.message);
    }
  };

  const handleReset = async () => {
    const parsedGoal = parseInt(goalInput, 10);
    const nextGoal = Number.isNaN(parsedGoal) || parsedGoal < 1000 ? todayGoal : parsedGoal;

    try {
      await resetActivity(nextGoal);
    } catch (error) {
      console.log('RESET ERROR:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center text-sm text-slate-200/80">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md animate-fadeIn">
      <div className="pt-1 text-center">
        <h1 className="text-[18px] font-extrabold tracking-tight text-[#b845ff]">FitTrack</h1>
        <p className="mt-1 text-[11px] font-medium text-slate-300/85">Keep moving forward</p>
      </div>

      <section id="focus-progress-card" className={`mt-4 rounded-[20px] border border-white/8 bg-[#313465]/82 px-6 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm ${focusClass(focusTarget === 'progress-card')}`}>
        <div className="flex justify-center">
          <div className="relative h-[188px] w-[188px]">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="homeProgress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5678ff" />
                  <stop offset="55%" stopColor="#7f67ff" />
                  <stop offset="100%" stopColor="#53d3d9" />
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r="72" fill="none" stroke="#47506b" strokeWidth="8" opacity="0.9" />
              <circle
                cx="90"
                cy="90"
                r="72"
                fill="none"
                stroke="url(#homeProgress)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (percentage / 100) * circumference}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[21px] font-extrabold tracking-tight text-[#6f63ff] sm:text-[22px]">
                {todaySteps.toLocaleString()}
              </div>
              <div className="mt-1 text-[10px] font-medium text-slate-200/85">
                of {todayGoal.toLocaleString()} steps
              </div>
              <div className="mt-1 text-[10px] text-slate-400">{percentage}% complete</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            id="focus-add-steps"
            onClick={handleAddSteps}
            disabled={refreshing}
            className={`rounded-full bg-gradient-to-r from-[#4c7cff] via-[#8f5bff] to-[#20d786] px-6 py-2.5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(125,90,255,0.35)] disabled:opacity-70 ${focusClass(focusTarget === 'add-steps')}`}
          >
            {refreshing ? 'Updating...' : '+ Add Steps'}
          </button>
          <button
            onClick={handleReset}
            disabled={refreshing}
            className="rounded-full border border-rose-400/40 bg-rose-500/15 px-5 py-2.5 text-[12px] font-semibold text-rose-100 disabled:opacity-70"
          >
            <span className="inline-flex items-center gap-2">
              <RotateCcw size={14} />
              Reset Day
            </span>
          </button>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-4 gap-2.5">
        <StatCard icon={Activity} iconClassName="bg-gradient-to-br from-[#785cff] to-[#9677ff] text-white" value={todaySteps.toLocaleString()} label="Steps" />
        <StatCard icon={Flame} iconClassName="bg-gradient-to-br from-[#ff48c7] to-[#ff7f74] text-white" value={todayCalories} label="Calories" />
        <StatCard icon={MapPinned} iconClassName="bg-gradient-to-br from-[#15d98d] to-[#40d0a4] text-white" value={todayDistance.toFixed(2)} label="Miles" />
        <StatCard icon={Heart} iconClassName="bg-gradient-to-br from-[#ff6b39] to-[#ff9c55] text-white" value={todayActiveMinutes} label="Active Min" />
      </section>

      <section id="focus-smart-coach" className={`mt-4 overflow-hidden rounded-[18px] border border-[#b326ff]/70 bg-[#343664]/82 shadow-[0_0_0_1px_rgba(179,38,255,0.15),0_16px_35px_rgba(0,0,0,0.16)] backdrop-blur-sm ${focusClass(focusTarget === 'smart-coach')}`}>
        <div className="px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#a06bff] to-[#705aff] text-white shadow-[0_0_18px_rgba(142,95,255,0.35)]">
              <span className="text-[12px]">*</span>
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">AI Smart Coach</div>
              <div className="text-[10px] text-slate-300/70">Personalized insights for you</div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/[0.02] py-1">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#8e6fff] to-[#566cff] text-white">
              <span className="text-[11px]">!</span>
            </div>
            <p className="pr-2 text-[11px] font-medium leading-5 text-slate-100/95">
              {remainingSteps > 0
                ? `You're almost there! Just ${remainingSteps.toLocaleString()} more steps to reach your goal today.`
                : 'Fresh start ready. Set a goal below and begin tracking again.'}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300/75">
            <Target size={13} />
            Fresh Goal Setup
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="number"
              min="1000"
              step="500"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#242748] px-4 py-3 text-sm text-white placeholder:text-slate-400"
              placeholder="Enter new daily goal"
            />
            <button
              onClick={handleReset}
              disabled={refreshing}
              className="rounded-xl bg-gradient-to-r from-[#7d5bff] to-[#34d399] px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
            >
              Apply Reset
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>Weekly Average</span>
            <span className="text-[#d07eff]">{weeklyAverage.toLocaleString()}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
