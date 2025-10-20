'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, RefreshCw } from 'lucide-react';

interface LeaderboardEntry {
  wallet_address: string;
  username: string | null;
  sora_balance: number;
  total_guesses: number;
  correct_guesses: number;
  accuracy_rate: number;
}

export default function SoraLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sora-leaderboard?limit=10');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold text-white/50">{index + 1}</span>;
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          SORA Leaderboard
        </h3>
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-white/70 text-center py-4">No players yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.wallet_address}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index < 3 
                  ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 border border-yellow-500/20' 
                  : 'bg-white/5 hover:bg-white/10 transition-colors'
              }`}
            >
              <div className="flex-shrink-0">
                {getRankIcon(index)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {entry.username || formatWalletAddress(entry.wallet_address)}
                  </span>
                  {index < 3 && (
                    <span className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <div className="text-sm text-white/70">
                  {entry.sora_balance.toLocaleString()} SORA • {entry.accuracy_rate}% accuracy
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  {entry.sora_balance.toLocaleString()}
                </div>
                <div className="text-xs text-white/50">
                  {entry.correct_guesses}/{entry.total_guesses} correct
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
