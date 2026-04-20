import React, { useState } from 'react';
import { Bell, LogOut, Moon, Palette, Shield, Timer } from 'lucide-react';

const SettingsToggle = ({ icon: Icon, title, description, checked, onChange, accentClass }) => (
  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${accentClass}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => onChange((value) => !value)}
      aria-pressed={checked}
      className={`relative h-7 w-12 rounded-full transition ${
        checked ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500' : 'bg-white/20'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  </div>
);

const SettingsPage = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);
  const [reminderTime, setReminderTime] = useState(14);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-300">Customize your experience</p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#252b49]/90 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/20 text-fuchsia-300">
            <Palette size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Appearance</h2>
            <p className="text-sm text-slate-400">Personalize your interface</p>
          </div>
        </div>

        <SettingsToggle
          icon={Moon}
          title="Dark Mode"
          description="Toggle dark theme"
          checked={darkMode}
          onChange={setDarkMode}
          accentClass="bg-violet-500/20 text-violet-300"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#252b49]/90 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <p className="text-sm text-slate-400">Manage your alerts</p>
          </div>
        </div>

        <div className="space-y-3">
          <SettingsToggle
            icon={Bell}
            title="Push Notifications"
            description="Receive activity alerts"
            checked={pushNotifications}
            onChange={setPushNotifications}
            accentClass="bg-emerald-500/20 text-emerald-300"
          />
          <SettingsToggle
            icon={Timer}
            title="Daily Reminder"
            description="Get daily step reminders"
            checked={dailyReminder}
            onChange={setDailyReminder}
            accentClass="bg-orange-500/20 text-orange-300"
          />
        </div>

        <div className="mt-5 rounded-2xl bg-white/5 px-4 py-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Reminder Time</p>
              <p className="text-xs text-slate-400">Set when your reminder appears</p>
            </div>
            <span className="text-sm font-semibold text-fuchsia-300">
              {String(reminderTime).padStart(2, '0')}:00
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="22"
            value={reminderTime}
            onChange={(event) => setReminderTime(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-fuchsia-500"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#252b49]/90 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Privacy</h2>
            <p className="text-sm text-slate-400">Control your data</p>
          </div>
        </div>

        <SettingsToggle
          icon={Shield}
          title="Share Activity Data"
          description="Allow anonymous analytics"
          checked={shareActivity}
          onChange={setShareActivity}
          accentClass="bg-indigo-500/20 text-indigo-300"
        />
      </section>

      <section className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <h2 className="text-2xl font-bold text-white">Account</h2>
        <p className="mt-1 text-sm text-slate-300">Manage your session safely.</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <LogOut size={18} />
          Logout
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;
