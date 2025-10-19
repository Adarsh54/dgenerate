'use client';

import { useEffect, useState } from 'react';
import { Coins, Sparkles } from 'lucide-react';

interface RewardAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export default function RewardAnimation({ amount, onComplete }: RewardAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-bounce-slow">
        <div className="relative">
          {/* Main coin circle */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-8 shadow-2xl animate-pulse-slow">
            <Coins className="w-16 h-16 text-white" />
          </div>
          
          {/* Sparkle effects */}
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-spin-slow" />
          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-300 animate-spin-slow" />
        </div>
        
        {/* Text */}
        <div className="text-center mt-4 space-y-1">
          <p className="text-3xl font-bold text-yellow-400 animate-pulse">
            +{amount} SORA
          </p>
          <p className="text-lg text-white/80">Tokens Earned! 🎉</p>
        </div>
      </div>
    </div>
  );
}

