'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, RefreshCw } from 'lucide-react';

export default function SoraBalanceCompatible() {
  const { publicKey } = useWallet();
  const [soraBalance, setSoraBalance] = useState<number>(0);
  const [correctGuesses, setCorrectGuesses] = useState<number>(0);
  const [totalGuesses, setTotalGuesses] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchSoraBalance = async () => {
    if (!publicKey) {
      setSoraBalance(0);
      setCorrectGuesses(0);
      setTotalGuesses(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/sora-balance-compatible?walletId=${publicKey.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSoraBalance(data.data.soraBalance);
        setCorrectGuesses(data.data.correctGuesses);
        setTotalGuesses(data.data.totalGuesses);
      }
    } catch (error) {
      console.error('Error fetching SORA balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoraBalance();
  }, [publicKey]);

  const refreshBalance = async () => {
    await fetchSoraBalance();
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

  const accuracy = totalGuesses > 0 ? (correctGuesses / totalGuesses * 100).toFixed(1) : '0.0';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          SORA Balance
        </h3>
        <button
          onClick={refreshBalance}
          disabled={loading}
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
        <div className="space-y-3">
          <div className="text-3xl font-bold text-yellow-400">
            {soraBalance.toLocaleString()}
          </div>
          <div className="text-sm text-white/70 space-y-1">
            <p>Earn 1 SORA for each correct guess!</p>
            <p>Accuracy: {accuracy}% ({correctGuesses}/{totalGuesses})</p>
          </div>
        </div>
      )}
    </div>
  );
}
