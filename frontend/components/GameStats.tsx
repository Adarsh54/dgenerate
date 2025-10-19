'use client';

import { Trophy, Users, Zap, TrendingUp } from 'lucide-react';

export default function GameStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-500/20 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-primary-400" />
          </div>
          <h3 className="text-sm font-medium text-white/70">Current Reward</h3>
        </div>
        <p className="text-2xl font-bold">100 SORA</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-500/20 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-sm font-medium text-white/70">Active Players</h3>
        </div>
        <p className="text-2xl font-bold">1,234</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="text-sm font-medium text-white/70">Total Minted</h3>
        </div>
        <p className="text-2xl font-bold">45.2K</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-white/70">Challenges</h3>
        </div>
        <p className="text-2xl font-bold">89</p>
      </div>
    </div>
  );
}

