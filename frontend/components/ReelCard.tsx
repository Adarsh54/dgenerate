'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Send, Sparkles, Loader2, Heart, MessageCircle, Share2 } from 'lucide-react';

interface ReelCardProps {
  imageId: string;
  imageUrl: string;
  actualPrompt: string;
  onGuessSubmitted?: () => void;
  isActive: boolean;
}

export default function ReelCard({ imageId, imageUrl, actualPrompt, onGuessSubmitted, isActive }: ReelCardProps) {
  const { publicKey } = useWallet();
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !guess.trim()) return;

    setSubmitting(true);

    try {
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

      setGuess('');
      setShowInput(false);
      
      setTimeout(() => {
        onGuessSubmitted?.();
      }, 300);
      
    } catch (error) {
      console.error('Error submitting guess:', error);
      alert('Failed to submit guess. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reel-card">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        )}
        <img
          src={imageUrl}
          alt="AI Generated"
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Top Info */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-16 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">AI Generated</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions (Instagram Style) */}
      <div className="absolute right-4 bottom-32 z-10 flex flex-col items-center gap-6">
        <button
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <Heart
              className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">
            {liked ? '1.2k' : '1.1k'}
          </span>
        </button>

        <button
          onClick={() => setShowInput(!showInput)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">Guess</span>
        </button>

        <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">Share</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-10">
        <div className="space-y-3">
          {/* Challenge Prompt */}
          <div>
            <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
              🎯 Guess the AI Prompt
            </h3>
            <p className="text-white/90 text-sm drop-shadow-lg">
              What prompt created this image?
            </p>
          </div>

          {/* Input Section */}
          {showInput && (
            <div className="animate-slide-up">
              {!publicKey ? (
                <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-yellow-300 font-medium">
                    Connect wallet to submit guesses
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Type your guess..."
                      className="w-full bg-black/60 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none min-h-[80px]"
                      disabled={submitting}
                    />
                    <button
                      type="submit"
                      disabled={submitting || !guess.trim()}
                      className="absolute right-3 bottom-3 w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <Send className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

