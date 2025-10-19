'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Send, CheckCircle, XCircle, Sparkles, Coins } from 'lucide-react';

interface VideoChallengeProps {
  videoId: string;
  videoUrl: string;
  onGuessSubmitted?: () => void;
}

export default function VideoChallenge({ videoId, videoUrl, onGuessSubmitted }: VideoChallengeProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showReward, setShowReward] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !guess.trim()) return;

    setSubmitting(true);
    setResult(null);
    setShowReward(false);

    try {
      // TODO: Integrate with your Solana program
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random result (replace with actual API call)
      const isCorrect = Math.random() > 0.7;
      
      if (isCorrect) {
        setResult('correct');
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
        onGuessSubmitted?.();
      } else {
        setResult('incorrect');
      }
      
      setGuess('');
    } catch (error) {
      console.error('Error submitting guess:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Reward Animation */}
      {showReward && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce-slow">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-8 shadow-2xl">
              <Coins className="w-16 h-16 text-white" />
            </div>
            <div className="text-center mt-4">
              <p className="text-2xl font-bold text-yellow-400">+100 SORA</p>
              <p className="text-sm text-white/80">Tokens Earned!</p>
            </div>
          </div>
        </div>
      )}

      <div className="card max-w-2xl mx-auto">
        {/* Video Container */}
        <div className="relative bg-black rounded-xl overflow-hidden mb-6 aspect-video">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
            playsInline
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium">Sora Generated</span>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">What's the Prompt?</h2>
          <p className="text-white/70">
            Watch the video and guess the AI prompt used to generate it. Correct guesses earn you SORA tokens!
          </p>
        </div>

        {/* Guess Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="guess" className="block text-sm font-medium mb-2">
              Your Guess
            </label>
            <textarea
              id="guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="e.g., A cat playing with a ball of yarn in a cozy living room..."
              className="input-field min-h-[100px] resize-none"
              disabled={submitting || !publicKey}
            />
          </div>

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              result === 'correct' 
                ? 'bg-green-500/20 border border-green-500/50' 
                : 'bg-red-500/20 border border-red-500/50'
            }`}>
              {result === 'correct' ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="font-semibold text-green-400">Correct! 🎉</p>
                    <p className="text-sm text-white/70">You earned 100 SORA tokens!</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="font-semibold text-red-400">Not quite right</p>
                    <p className="text-sm text-white/70">Try again with a different guess!</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          {!publicKey ? (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center">
              <p className="text-sm text-yellow-400">Connect your wallet to submit guesses</p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting || !guess.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Checking...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Guess
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

