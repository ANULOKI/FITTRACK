import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';

const NotificationsPage = ({ notifications, onNotificationClick, refreshing }) => {
  return (
    <div className="mx-auto max-w-3xl px-2 pb-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white">Notifications</h1>
          <p className="mt-2 text-sm text-slate-300/80">Stay updated on your progress</p>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => onNotificationClick(notification)}
              className={`w-full rounded-[22px] border bg-gradient-to-r ${notification.theme} p-5 text-left shadow-[0_18px_35px_rgba(0,0,0,0.12)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/30`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${notification.iconBg} text-[12px] font-bold text-white shadow-lg`}>
                  {notification.iconText}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{notification.title}</h2>
                      <p className="mt-1 text-sm text-slate-200/85">{notification.message}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-300/70">{notification.time}</span>
                  </div>
                </div>

                <ChevronRight size={18} className="mt-2 shrink-0 text-slate-300/70" />
              </div>
            </button>
          ))}

          <div className="rounded-[22px] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-[0_18px_35px_rgba(0,0,0,0.12)] backdrop-blur-sm">
            <Bell size={42} className="mx-auto text-slate-400" />
            <p className="mt-5 text-sm text-slate-300/80">
              {refreshing ? 'Refreshing your activity feed...' : "You're all caught up!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
