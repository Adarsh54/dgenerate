'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ImageChallenge from '@/components/ImageChallenge';
import TokenBalance from '@/components/TokenBalance';
import GameStats from '@/components/GameStats';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

// Sample image data - these are pre-generated examples
// You can generate new ones using the /api/generate-image endpoint
const SAMPLE_IMAGES = [
  {
    id: 'image_1',
    url: 'https://images.unsplash.com/photo-1680868543815-b8666dba60f7?w=1024&h=1024&fit=crop',
    prompt: 'A futuristic city at sunset with flying cars'
  },
  {
    id: 'image_2',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1024&h=1024&fit=crop',
    prompt: 'A magical forest with glowing mushrooms'
  },
  {
    id: 'image_3',
    url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1024&h=1024&fit=crop',
    prompt: 'An astronaut floating in colorful space'
  },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentImage = SAMPLE_IMAGES[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % SAMPLE_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + SAMPLE_IMAGES.length) % SAMPLE_IMAGES.length);
  };

  const refreshChallenge = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
            Guess the AI Prompt
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            View AI-generated images and guess the prompts. Earn tokens for every correct guess!
          </p>
        </div>

        {/* Game Stats */}
        <GameStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Challenge - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ImageChallenge
              key={refreshKey}
              imageId={currentImage.id}
              imageUrl={currentImage.url}
              actualPrompt={currentImage.prompt}
              onGuessSubmitted={refreshChallenge}
            />
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevImage}
                className="btn-secondary flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              
              <button
                onClick={refreshChallenge}
                className="btn-secondary flex items-center gap-2"
                title="Refresh Challenge"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextImage}
                className="btn-secondary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TokenBalance />
            
            <div className="card">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <ol className="space-y-3 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Connect your Solana wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>View the AI-generated image</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Guess the prompt that created it</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>Earn tokens for correct guesses!</span>
                </li>
              </ol>
            </div>

            <div className="card bg-gradient-to-br from-primary-500/20 to-accent-500/20">
              <h3 className="text-xl font-bold mb-2">🎉 Token Economics</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Initial reward: <span className="text-yellow-400 font-semibold">100 tokens</span></li>
                <li>• Reward halves every <span className="text-primary-400 font-semibold">100,000 tokens</span></li>
                <li>• Limited supply makes early participation valuable!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-white/50 text-sm mt-12">
          <p>Built on Solana • Powered by OpenAI</p>
        </div>
      </main>
    </div>
  );
}

