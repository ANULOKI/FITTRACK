// SOCIAL PAGE - Copy this code
// Save as: client/src/pages/SocialPage.js

import React, { useState } from 'react';
import { Trophy, Users, Share2, Crown, Medal, UserPlus, Flame } from 'lucide-react';

const SocialPage = () => {
  const [leaderboardUsers] = useState([
    {
      id: 1,
      rank: 1,
      name: 'Sarah Chen',
      steps: 15800,
      streak: 15,
      avatar: '😊',
      position: 'you' // current user highlighted
    },
    {
      id: 2,
      rank: 2,
      name: 'You 👑',
      steps: 11234,
      streak: 7,
      avatar: '👤',
      isCurrent: true
    },
    {
      id: 3,
      rank: 3,
      name: 'Mike Rodriguez',
      steps: 10876,
      streak: 12,
      avatar: '😎'
    },
    {
      id: 4,
      rank: 4,
      name: 'Emily Watson',
      steps: 10234,
      streak: 8,
      avatar: '🎉'
    },
    {
      id: 5,
      rank: 5,
      name: 'David Kim',
      steps: 8456,
      streak: 5,
      avatar: '⚡'
    },
    {
      id: 6,
      rank: 6,
      name: 'Lisa Park',
      steps: 8234,
      streak: 9,
      avatar: '🌟'
    },
    {
      id: 7,
      rank: 7,
      name: 'Tom Wilson',
      steps: 6345,
      streak: 4,
      avatar: '🏃'
    },
  ]);

  const [friendsActivity] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      steps: 12456,
      time: 'Active now',
      avatar: '😊',
      status: 'online'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      steps: 10876,
      time: '2 hours ago',
      avatar: '😎',
      status: 'away'
    },
    {
      id: 3,
      name: 'Emily Watson',
      steps: 10234,
      time: 'Active now',
      avatar: '🎉',
      status: 'online'
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Social</h1>
            <p className="text-gray-400 text-sm">Compete with friends</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold">
            <UserPlus size={18} />
            Add Friends
          </button>
        </div>

        {/* Weekly Leaderboard */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 hover:border-yellow-500/30 transition">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Trophy className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Weekly Leaderboard</h2>
              <p className="text-gray-400 text-sm">Top performers this week</p>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboardUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-lg transition ${
                  user.isCurrent
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-slate-700/30 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="w-8 text-center font-bold">
                    {user.rank === 1 && <Crown className="text-yellow-400 mx-auto" size={20} />}
                    {user.rank === 2 && <Medal className="text-gray-300 mx-auto" size={20} />}
                    {user.rank === 3 && <Medal className="text-orange-500 mx-auto" size={20} />}
                    {user.rank > 3 && <span>#{user.rank}</span>}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{user.avatar}</span>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Flame size={12} className="text-orange-400" />
                        {user.streak} day streak
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps & Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.steps.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">steps</p>
                  </div>
                  {!user.isCurrent && (
                    <button className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition">
                      <Crown size={18} className="text-gray-400" />
                    </button>
                  )}
                  {user.isCurrent && (
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Crown size={18} className="text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends Activity */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 hover:border-pink-500/30 transition">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <Users className="text-pink-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Friends Activity</h2>
              <p className="text-gray-400 text-sm">See what your friends are up to</p>
            </div>
          </div>

          <div className="space-y-4">
            {friendsActivity.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-3xl">{friend.avatar}</span>
                    {friend.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-slate-800"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{friend.name}</p>
                    <p className="text-xs text-gray-400">
                      {friend.status === 'online' ? '🟢 Active now' : `🔘 ${friend.time}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{friend.steps.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">steps today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Card */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/30 rounded-lg">
                <Flame className="text-green-400" size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold">You're doing great!</h2>
                <p className="text-gray-300 text-sm">You're in the top 35% of your friend group. Keep it up!</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500/30 hover:bg-green-500/40 border border-green-500/50 text-green-400 rounded-lg transition font-semibold">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;