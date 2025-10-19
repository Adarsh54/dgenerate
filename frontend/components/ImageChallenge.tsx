'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface ImageChallengeProps {
  imageId: string;
  imageUrl: string;
  actualPrompt: string;
  onGuessSubmitted?: () => void;
}

export default function ImageChallenge({ imageId, imageUrl, actualPrompt, onGuessSubmitted }: ImageChallengeProps) {
  const { publicKey } = useWallet();
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !guess.trim()) return;

    setSubmitting(true);

    try {
      // Submit guess to backend
      const response = await fetch('/api/submit-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          walletId: publicKey.toString(),
          guessText: guess.trim(),
          actualPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit guess');
      }

      // Clear input and move to next image immediately
      setGuess('');
      
      // Trigger moving to next image
      setTimeout(() => {
        onGuessSubmitted?.();
      }, 300); // Small delay for smooth transition
      
    } catch (error) {
      console.error('Error submitting guess:', error);
      alert('Failed to submit guess. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
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
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
            onLoad={() => {
              console.log('✅ Image loaded successfully:', imageUrl);
              setImageLoading(false);
            }}
            onError={(e) => {
              console.error('❌ Image failed to load:', imageUrl);
              console.error('Error:', e);
              setImageLoading(false);
            }}
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
            Look at the AI-generated image and guess the prompt used to create it. Submit your guess to continue!
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit & Next
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

