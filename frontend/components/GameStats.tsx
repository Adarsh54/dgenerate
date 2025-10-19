'use client';

import { Trophy, Users, Zap, TrendingUp } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

interface UserStats {
  total_guesses: number;
  correct_guesses: number;
  total_tokens_earned: number;
  accuracy: number;
}

export default function GameStats() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !publicKey) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/user-stats?walletId=${publicKey.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchStats();
    // Refresh stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [publicKey, mounted]);

  // Show default stats if not connected
  if (!mounted || !publicKey || !stats) {
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
            <h3 className="text-sm font-medium text-white/70">Your Accuracy</h3>
          </div>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-sm font-medium text-white/70">Tokens Earned</h3>
          </div>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-white/70">Total Guesses</h3>
          </div>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>
    );
  }

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
          <h3 className="text-sm font-medium text-white/70">Your Accuracy</h3>
        </div>
        <p className="text-2xl font-bold">{stats.accuracy.toFixed(1)}%</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="text-sm font-medium text-white/70">Tokens Earned</h3>
        </div>
        <p className="text-2xl font-bold">{stats.total_tokens_earned.toLocaleString()}</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-white/70">Total Guesses</h3>
        </div>
        <p className="text-2xl font-bold">{stats.total_guesses}</p>
      </div>
    </div>
  );
}

