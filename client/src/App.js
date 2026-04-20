import React, { useMemo, useState } from 'react';
import {
  Home,
  Target,
  BarChart3,
  FileText,
  Users,
  Map,
  Bell,
  Settings,
  CircleUserRound,
} from 'lucide-react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useActivity } from './context/ActivityContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import SocialPage from './pages/SocialPage';
import RoutesPage from './pages/RoutesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const LandingPage = ({ onGetStarted }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-2">
        <span className="text-gradient">FitTrack</span>
        <span className="ml-3">&#128640;</span>
      </h1>
      <p className="text-xl text-gray-400 mb-8">Your fitness journey starts here</p>
      <button
        onClick={onGetStarted}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
      >
        Get Started
      </button>
    </div>
  </div>
);

const App = () => {
  const { user, isAuthenticated, logout, loading, refreshUser } = useAuth();
  const { notifications, unreadNotifications, refreshing, refreshActivity } = useActivity();
  const location = useLocation();
  const navigate = useNavigate();
  const [screen, setScreen] = useState('landing');

  const routeToPage = useMemo(
    () => ({
      '/': 'home',
      '/goals': 'goals',
      '/stats': 'stats',
      '/reports': 'reports',
      '/social': 'social',
      '/routes': 'routes',
      '/notifications': 'notifications',
      '/profile': 'profile',
      '/settings': 'settings',
    }),
    []
  );

  const pageToRoute = useMemo(
    () => ({
      home: '/',
      goals: '/goals',
      stats: '/stats',
      reports: '/reports',
      social: '/social',
      routes: '/routes',
      notifications: '/notifications',
      profile: '/profile',
      settings: '/settings',
    }),
    []
  );

  const currentPage = routeToPage[location.pathname] ?? 'home';
  const pageFocus = location.state?.focusTarget ?? null;

  const userName = useMemo(() => {
    if (user?.name) {
      return user.name;
    }

    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).name : '';
  }, [user]);

  const handleAuthSuccess = () => {
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    logout();
    setScreen('landing');
    navigate('/', { replace: true });
  };

  const handlePageChange = async (page) => {
    if (page === 'profile') {
      await Promise.all([refreshUser(), refreshActivity()]);
    } else if (page === 'notifications') {
      await refreshActivity();
    }

    navigate(pageToRoute[page] ?? '/', { state: null });
  };

  const handleNotificationClick = async (notification) => {
    await refreshActivity();
    navigate(pageToRoute[notification.page] ?? '/', {
      state: { focusTarget: notification.target },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-white">
        Restoring your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    if (screen === 'login') {
      return <LoginPage onSwitch={(type) => setScreen(type)} onSuccess={handleAuthSuccess} />;
    }

    if (screen === 'register') {
      return <RegisterPage onSwitch={(type) => setScreen(type)} onSuccess={handleAuthSuccess} />;
    }

    return <LandingPage onGetStarted={() => setScreen('register')} />;
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'social', icon: Users, label: 'Social' },
    { id: 'routes', icon: Map, label: 'Routes' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#4e007d_0%,#31125a_28%,#2c2355_62%,#232d46_100%)] text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#1a1d39]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="text-[31px] font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-[#5d6cff] via-[#8457ff] to-[#1dd98a] bg-clip-text text-transparent">
              FitTrack
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePageChange('notifications')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <div className="relative">
                <Bell size={15} />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {Math.min(unreadNotifications, 9)}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => handlePageChange('profile')}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white ${currentPage === 'profile' ? 'ring-2 ring-violet-400/80 text-white' : ''}`}
              title="Profile"
            >
              <CircleUserRound size={15} />
            </button>
            <button
              onClick={() => handlePageChange('settings')}
              title="Settings"
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white ${currentPage === 'settings' ? 'ring-2 ring-violet-400/80 text-white' : ''}`}
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-6xl px-4 pb-28 pt-24 sm:px-6 md:pt-28">
        <Routes>
          <Route path="/" element={<HomePage userName={userName} focusTarget={pageFocus} />} />
          <Route path="/goals" element={<GoalsPage focusTarget={pageFocus} />} />
          <Route path="/stats" element={<AnalyticsPage focusTarget={pageFocus} />} />
          <Route path="/reports" element={<ReportsPage focusTarget={pageFocus} />} />
          <Route
            path="/notifications"
            element={
              <NotificationsPage
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                refreshing={refreshing}
              />
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-[#19213a]/95 backdrop-blur-md">
        <div className="mx-auto grid h-[72px] max-w-6xl grid-cols-6 items-center px-2 sm:px-4">
          {navItems.map(({ id, icon: Icon, label }) => {
            const active = currentPage === id;

            return (
              <button
                key={id}
                onClick={() => handlePageChange(id)}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[10px] font-medium text-slate-400"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    active
                      ? 'bg-[radial-gradient(circle,#66c6ff55_0%,#8a5bff22_55%,transparent_75%)] text-[#82d6ff] shadow-[0_0_22px_rgba(101,185,255,0.45)]'
                      : 'text-slate-500'
                  }`}
                >
                  <Icon size={18} strokeWidth={2.1} />
                </div>
                <span className={active ? 'text-slate-200' : 'text-slate-500'}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
