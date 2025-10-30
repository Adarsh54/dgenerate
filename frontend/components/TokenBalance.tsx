'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Coins, TrendingUp } from 'lucide-react';

// Replace with your actual token mint address
const TOKEN_MINT = new PublicKey('AbdyXBT8TV9n2oJaHHP1TdaiqhyrcUEaAvStix6wVCbn');

export default function TokenBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !publicKey) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const tokenAddress = await getAssociatedTokenAddress(
          TOKEN_MINT,
          publicKey
        );
        
        const tokenAccount = await connection.getTokenAccountBalance(tokenAddress);
        setBalance(Number(tokenAccount.value.amount) / Math.pow(10, tokenAccount.value.decimals));
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [publicKey, connection, mounted]);

  if (!mounted || !publicKey) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Coins className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Balance</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-white/10 rounded w-40"></div>
        </div>
      ) : (
        <div>
          <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {balance !== null ? balance.toLocaleString() : '0'}
          </div>
          <p className="text-base text-white/70 mt-1">SORA tokens</p>
        </div>
      )}
    </div>
  );
}

