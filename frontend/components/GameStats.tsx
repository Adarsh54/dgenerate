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
      <div>
        <h3 className="text-lg font-semibold text-white mb-5">Statistics</h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Total Guesses</p>
                <p className="text-xl font-bold text-white">--</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Accuracy</p>
                <p className="text-xl font-bold text-white">--</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Tokens Earned</p>
                <p className="text-xl font-bold text-white">--</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-5">Statistics</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Guesses</p>
              <p className="text-xl font-bold text-white">{stats.total_guesses}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Accuracy</p>
              <p className="text-xl font-bold text-white">{stats.accuracy.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Tokens Earned</p>
              <p className="text-xl font-bold text-white">{stats.total_tokens_earned.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

