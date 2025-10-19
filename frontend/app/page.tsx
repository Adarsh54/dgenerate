'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageChallenge from '@/components/ImageChallenge';
import TokenBalance from '@/components/TokenBalance';
import GameStats from '@/components/GameStats';
import { ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

interface Image {
  id: string;
  image_url: string;
  prompt: string;
  difficulty?: string;
}

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch images from Supabase on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images?limit=10');
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

  // Safety check - if no images, default to first one or show error
  const currentImage = images[currentImageIndex] || images[0];
  const hasImages = images.length > 0;

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const refreshChallenge = () => {
    // Move to next image after submitting guess
    nextImage();
    setRefreshKey(prev => prev + 1);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="card max-w-2xl mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-400" />
            <h2 className="text-2xl font-bold mb-2">Loading Images...</h2>
            <p className="text-white/70">Fetching challenges from database</p>
          </div>
        </main>
      </div>
    );
  }

  // If no images, show a helpful message
  if (!hasImages) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="card max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">No Images Yet!</h2>
            <p className="text-white/70 mb-6">
              Add images to your Supabase database to start playing!
            </p>
            <div className="bg-black/30 p-4 rounded-lg text-left">
              <p className="text-sm text-white/70 mb-2">Option 1: Add via Supabase UI</p>
              <code className="text-sm text-primary-400">
                Dashboard → Table Editor → images → Insert row
              </code>
              <p className="text-sm text-white/70 mt-4 mb-2">Option 2: Generate with AI</p>
              <code className="text-sm text-primary-400">
                cd frontend && npm run generate-images
              </code>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            View AI-generated images and guess the prompts. Track your stats and compete with others!
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
              imageUrl={currentImage.image_url}
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
                  <span>Type your guess for the prompt</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>Submit and move to the next image!</span>
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

