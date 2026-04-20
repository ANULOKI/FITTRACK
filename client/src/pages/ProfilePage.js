import React, { useEffect, useMemo } from 'react';
import { CircleUserRound, Activity, Trophy, Flame, TrendingUp, Mail, CalendarDays, Target, Footprints } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';

const StatCard = ({ icon: Icon, iconClassName, value, label }) => (
  <div className="rounded-[20px] border border-slate-200/10 bg-white/10 p-5 text-center shadow-[0_14px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm">
    <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}>
      <Icon size={18} strokeWidth={2.1} />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="mt-1 text-xs text-slate-300/80">{label}</div>
  </div>
);

const BadgeCard = ({ title, subtitle, icon, tone, level }) => (
  <div className={`rounded-[20px] border p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ${tone}`}>
    <div className="text-2xl">{icon}</div>
    <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
    <div className="mt-1 text-[11px] text-slate-700/70">{subtitle}</div>
    <div className="mt-3 inline-flex rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
      {level}
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const { loading, history, weekly, todayGoal, todaySteps, goalCompletionRate } = useActivity();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const profile = useMemo(() => {
    const totalSteps = history.reduce((sum, item) => sum + item.steps, 0);
    const activeDays = history.filter((item) => item.steps > 0).length;
    const totalGoals = history.filter((item) => item.goalAchieved).length;
    const averageSteps = activeDays ? Math.round(totalSteps / activeDays) : 0;
    const memberSince = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Recently';

    const badges = [
      {
        title: 'Goal Getter',
        subtitle: `${totalGoals} goals achieved`,
        icon: '??',
        tone: 'border-amber-300/60 bg-amber-100/80',
        level: totalGoals >= 10 ? 'Elite' : 'Rising',
      },
      {
        title: 'Hot Streak',
        subtitle: `${weekly?.goalsAchieved ?? 0} hit this week`,
        icon: '??',
        tone: 'border-emerald-300/60 bg-emerald-100/80',
        level: (weekly?.goalsAchieved ?? 0) >= 5 ? 'Platinum' : 'Active',
      },
      {
        title: 'Overachiever',
        subtitle: `${goalCompletionRate}% weekly goal rate`,
        icon: '?',
        tone: 'border-fuchsia-300/60 bg-fuchsia-100/80',
        level: goalCompletionRate >= 80 ? 'Gold' : 'Silver',
      },
      {
        title: 'Marathon Mindset',
        subtitle: `${totalSteps.toLocaleString()} total steps`,
        icon: '??',
        tone: 'border-sky-300/60 bg-sky-100/80',
        level: totalSteps >= 100000 ? 'Endurance' : 'Builder',
      },
    ];

    return {
      totalSteps,
      activeDays,
      totalGoals,
      averageSteps,
      memberSince,
      badges,
    };
  }, [goalCompletionRate, history, user?.createdAt, weekly?.goalsAchieved]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-2 pb-10">
      <div className="rounded-[26px] border border-white/10 bg-gradient-to-br from-white/12 via-fuchsia-200/10 to-emerald-200/10 px-8 py-10 text-center shadow-[0_24px_50px_rgba(15,23,42,0.16)] backdrop-blur-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/60 bg-white/70 text-slate-700 shadow-[0_0_30px_rgba(125,90,255,0.22)]">
          <CircleUserRound size={44} />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white">{user?.name || 'FitTrack User'}</h1>
        <p className="mt-2 text-sm text-slate-200/80">Fitness Enthusiast</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white">Level {Math.max(1, Math.round(profile.activeDays / 3))}</span>
          <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">{goalCompletionRate >= 70 ? 'Pro Member' : 'On Track'}</span>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300/80">Lifetime Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Footprints} iconClassName="bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white" value={profile.totalSteps.toLocaleString()} label="Total Steps" />
          <StatCard icon={Trophy} iconClassName="bg-gradient-to-br from-pink-500 to-purple-400 text-white" value={profile.totalGoals} label="Goals Achieved" />
          <StatCard icon={Flame} iconClassName="bg-gradient-to-br from-emerald-500 to-green-400 text-white" value={profile.activeDays} label="Days Active" />
          <StatCard icon={TrendingUp} iconClassName="bg-gradient-to-br from-orange-500 to-red-400 text-white" value={profile.averageSteps.toLocaleString()} label="Avg Daily Steps" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300/80">Achievements & Badges</h2>
        <div className="grid grid-cols-2 gap-4">
          {profile.badges.map((badge) => (
            <BadgeCard key={badge.title} {...badge} />
          ))}
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[22px] border border-white/10 bg-white/10 shadow-[0_18px_35px_rgba(15,23,42,0.12)] backdrop-blur-sm">
        <div className="border-b border-white/10 px-5 py-4 text-sm font-semibold text-white">Personal Info</div>
        <div className="divide-y divide-white/10 text-sm">
          <div className="flex items-center justify-between px-5 py-4 text-slate-200">
            <div className="flex items-center gap-2"><Mail size={16} /> Email</div>
            <span>{user?.email || 'Unavailable'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 text-slate-200">
            <div className="flex items-center gap-2"><CalendarDays size={16} /> Member Since</div>
            <span>{profile.memberSince}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 text-slate-200">
            <div className="flex items-center gap-2"><Target size={16} /> Current Goal</div>
            <span>{todayGoal.toLocaleString()} steps</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 text-slate-200">
            <div className="flex items-center gap-2"><Activity size={16} /> Today&apos;s Steps</div>
            <span>{todaySteps.toLocaleString()}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
