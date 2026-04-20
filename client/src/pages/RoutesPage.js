// ROUTES PAGE - Copy this code
// Save as: client/src/pages/RoutesPage.js

import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Flame, Map } from 'lucide-react';

const RoutesPage = () => {
  const [recentRoutes] = useState([
    {
      id: 1,
      name: 'Morning Park Run',
      time: 'Today, 7:30 AM',
      miles: 2.4,
      steps: 3200,
      duration: 28,
      calories: 128,
      icon: '🏃'
    },
    {
      id: 2,
      name: 'Afternoon Walk',
      time: 'Today, 2:15 PM',
      miles: 1.8,
      steps: 2400,
      duration: 22,
      calories: 96,
      icon: '🚶'
    },
    {
      id: 3,
      name: 'Evening Stroll',
      time: 'Yesterday, 6:45 PM',
      miles: 3.2,
      steps: 4200,
      duration: 35,
      calories: 168,
      icon: '🌙'
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold">Routes & Tracking</h1>
          <p className="text-gray-400 text-sm">Explore your walking paths</p>
        </div>

        {/* Current Location Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 hover:border-blue-500/30 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <MapPin className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Current Location</h2>
                <p className="text-gray-400 text-sm">Real-time tracking</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold">
              <Navigation size={18} />
              Start Tracking
            </button>
          </div>

          {/* Map Grid Visualization */}
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-semibold text-green-400">Live</span>
            </div>

            {/* SVG Map Visualization */}
            <svg viewBox="0 0 400 300" className="w-full h-48 mb-4">
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />

              {/* Route path */}
              <path
                d="M 80 200 Q 150 150, 250 100"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Start point */}
              <circle cx="80" cy="200" r="6" fill="#10b981" stroke="white" strokeWidth="2" />

              {/* End point */}
              <circle cx="250" cy="100" r="8" fill="#8b5cf6" stroke="white" strokeWidth="2" />
            </svg>

            <p className="text-xs text-gray-400 text-right">Distance: 2.4 mi</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Steps</p>
              <p className="text-xl font-bold">3,200</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Duration</p>
              <p className="text-xl font-bold">28 min</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Distance</p>
              <p className="text-xl font-bold">2.4 mi</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Calories</p>
              <p className="text-xl font-bold">128</p>
            </div>
          </div>
        </div>

        {/* Recent Routes */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Routes</h2>

          <div className="space-y-4">
            {recentRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{route.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg">{route.name}</h3>
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        📅 {route.time}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg transition text-sm font-semibold">
                    View Map
                  </button>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Miles</p>
                    <p className="font-bold">{route.miles}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Steps
                    </p>
                    <p className="font-bold">{route.steps.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <Clock size={12} /> Min
                    </p>
                    <p className="font-bold">{route.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <Flame size={12} /> Cal
                    </p>
                    <p className="font-bold">{route.calories}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;