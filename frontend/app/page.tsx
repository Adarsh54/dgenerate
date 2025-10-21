'use client';

import { useState, useEffect, useRef } from 'react';
import ReelCard from '@/components/ReelCard';
import { Loader2, Menu, User, TrendingUp } from 'lucide-react';
import TokenBalance from '@/components/TokenBalance';
import GameStats from '@/components/GameStats';

interface Image {
  id: string;
  image_url: string;
  prompt: string;
  difficulty?: string;
}

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch images from Supabase on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images?limit=20');
        if (response.ok) {
          const data = await response.json();
          setImages(data.images || []);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle scroll to update current index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const hasImages = images.length > 0;

  const scrollToNext = () => {
    if (containerRef.current && currentIndex < images.length - 1) {
      containerRef.current.scrollTo({
        top: (currentIndex + 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleGuessSubmitted = () => {
    setTimeout(() => {
      scrollToNext();
    }, 500);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Reels...</h2>
          <p className="text-white/70">Fetching challenges</p>
        </div>
      </div>
    );
  }

  // If no images, show a helpful message
  if (!hasImages) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black p-6">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold text-white mb-4">No Images Yet!</h2>
          <p className="text-white/70 mb-6">
            Add images to your Supabase database to start playing!
          </p>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-left border border-white/20">
            <p className="text-sm text-white/70 mb-2">Option 1: Add via Supabase UI</p>
            <code className="text-sm text-purple-400 block mb-4">
              Dashboard → Table Editor → images → Insert row
            </code>
            <p className="text-sm text-white/70 mb-2">Option 2: Generate with AI</p>
            <code className="text-sm text-purple-400 block">
              cd frontend && npm run generate-images
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white drop-shadow-lg">Sora Guesser</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
            <TrendingUp className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Reel Container */}
      <div
        ref={containerRef}
        className="reel-container"
      >
        {images.map((image, index) => (
          <ReelCard
            key={`${image.id}-${index}`}
            imageId={image.id}
            imageUrl={image.image_url}
            actualPrompt={image.prompt}
            onGuessSubmitted={handleGuessSubmitted}
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Side Menu Overlay */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        >
          <div 
            className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-slate-900 to-purple-900 p-6 overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <button 
                onClick={() => setShowMenu(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <TokenBalance />
              <GameStats />
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
                <ol className="space-y-3 text-sm text-white/70">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      1
                    </span>
                    <span>Swipe up/down to browse reels</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      2
                    </span>
                    <span>Tap "Guess" to submit your answer</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      3
                    </span>
                    <span>Earn tokens for each submission</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      4
                    </span>
                    <span>Compete on the leaderboard!</span>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-2">🎉 Token Rewards</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Base reward: <span className="text-yellow-400 font-semibold">100 tokens</span></li>
                  <li>• Halves every <span className="text-purple-400 font-semibold">100k tokens</span></li>
                  <li>• Early participants benefit most!</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-center text-white/50 text-sm">
              <p>Built on Solana • Powered by OpenAI</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

