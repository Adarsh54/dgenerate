'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Send, CheckCircle, XCircle, Sparkles, Coins, Loader2 } from 'lucide-react';
import RewardAnimation from './RewardAnimation';

interface ImageChallengeProps {
  imageId: string;
  imageUrl: string;
  actualPrompt: string;
  onGuessSubmitted?: () => void;
}

export default function ImageChallenge({ imageId, imageUrl, actualPrompt, onGuessSubmitted }: ImageChallengeProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !guess.trim()) return;

    setSubmitting(true);
    setResult(null);
    setShowReward(false);

    try {
      // Calculate similarity between guess and actual prompt
      const similarity = calculateSimilarity(guess.toLowerCase().trim(), actualPrompt.toLowerCase().trim());
      
      // Consider it correct if similarity is above 70%
      const isCorrect = similarity > 0.7;
      
      if (isCorrect) {
        // TODO: Integrate with your Solana program
        // For now, simulate the transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        
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

  // Simple similarity calculation (you can improve this)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  };

  return (
    <div className="relative">
      {/* Reward Animation */}
      {showReward && (
        <RewardAnimation amount={100} onComplete={() => setShowReward(false)} />
      )}

      <div className="card max-w-2xl mx-auto">
        {/* Image Container */}
        <div className="relative bg-black rounded-xl overflow-hidden mb-6 aspect-square">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-12 h-12 animate-spin text-primary-400" />
            </div>
          )}
          <img
            src={imageUrl}
            alt="AI Generated"
            className="w-full h-full object-contain"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium">AI Generated</span>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">What's the Prompt?</h2>
          <p className="text-white/70">
            Look at the AI-generated image and guess the prompt used to create it. Correct guesses earn you tokens!
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
              placeholder="e.g., A futuristic city at sunset with flying cars..."
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
                    <p className="text-sm text-white/70">You earned 100 tokens!</p>
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
                  <Loader2 className="w-5 h-5 animate-spin" />
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

