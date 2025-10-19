'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Sparkles, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Sora Guesser
            </h1>
            <p className="text-xs text-white/60">Guess & Earn Tokens</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold">Play to Earn</span>
          </div>
          {mounted ? (
            <WalletMultiButton className="!bg-gradient-to-r !from-primary-500 !to-accent-500 hover:!from-primary-600 hover:!to-accent-600 !rounded-xl !h-auto !py-2 !px-4 !transition-all !duration-300" />
          ) : (
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl h-10 w-36 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}

