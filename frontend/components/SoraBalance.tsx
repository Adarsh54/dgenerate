'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, RefreshCw } from 'lucide-react';

export default function SoraBalance() {
  const { publicKey } = useWallet();
  const [soraBalance, setSoraBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get or create user when wallet connects
  useEffect(() => {
    const createOrGetUser = async () => {
      if (!publicKey) {
        setUserId(null);
        setSoraBalance(0);
        return;
      }

      try {
        // First try to create/get user
        const userResponse = await fetch('/api/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
            username: `User_${publicKey.toString().slice(0, 8)}`
          })
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserId(userData.data.userId);
        }
      } catch (error) {
        console.error('Error creating/getting user:', error);
      }
    };

    createOrGetUser();
  }, [publicKey]);

  // Fetch SORA balance when user is available
  useEffect(() => {
    const fetchSoraBalance = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/sora-balance?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSoraBalance(data.data.soraBalance);
        }
      } catch (error) {
        console.error('Error fetching SORA balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoraBalance();
  }, [userId]);

  const refreshBalance = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/sora-balance?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSoraBalance(data.data.soraBalance);
      }
    } catch (error) {
      console.error('Error refreshing SORA balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          SORA Balance
        </h3>
        <p className="text-white/70 text-sm">Connect your wallet to view SORA balance</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          SORA Balance
        </h3>
        <button
          onClick={refreshBalance}
          disabled={loading || !userId}
          className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white/70">Loading...</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-3xl font-bold text-yellow-400">
            {soraBalance.toLocaleString()}
          </div>
          <p className="text-sm text-white/70">
            Earn 1 SORA for each correct guess!
          </p>
        </div>
      )}
    </div>
  );
}
