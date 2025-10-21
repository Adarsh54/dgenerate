-- Sora Guesser Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (tracked by wallet ID)
CREATE TABLE IF NOT EXISTS users (
  wallet_id TEXT PRIMARY KEY,
  total_guesses INTEGER DEFAULT 0,
  correct_guesses INTEGER DEFAULT 0,
  total_tokens_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Guesses table
CREATE TABLE IF NOT EXISTS guesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  wallet_id TEXT NOT NULL REFERENCES users(wallet_id) ON DELETE CASCADE,
  guess_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  similarity_score DECIMAL(5,2) DEFAULT 0.0, -- 0.00 to 100.00
  tokens_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guesses_wallet_id ON guesses(wallet_id);
CREATE INDEX IF NOT EXISTS idx_guesses_image_id ON guesses(image_id);
CREATE INDEX IF NOT EXISTS idx_guesses_created_at ON guesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet_id ON users(wallet_id);

-- Function to update user stats automatically
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user stats
  INSERT INTO users (wallet_id, total_guesses, correct_guesses, total_tokens_earned)
  VALUES (
    NEW.wallet_id,
    1,
    CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
    NEW.tokens_earned
  )
  ON CONFLICT (wallet_id) 
  DO UPDATE SET
    total_guesses = users.total_guesses + 1,
    correct_guesses = users.correct_guesses + (CASE WHEN NEW.is_correct THEN 1 ELSE 0 END),
    total_tokens_earned = users.total_tokens_earned + NEW.tokens_earned,
    updated_at = TIMEZONE('utc'::text, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user stats when a guess is made
CREATE TRIGGER update_user_stats_trigger
AFTER INSERT ON guesses
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  wallet_id TEXT,
  total_guesses INTEGER,
  correct_guesses INTEGER,
  total_tokens_earned INTEGER,
  accuracy DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.wallet_id,
    u.total_guesses,
    u.correct_guesses,
    u.total_tokens_earned,
    CASE 
      WHEN u.total_guesses > 0 THEN (u.correct_guesses::DECIMAL / u.total_guesses::DECIMAL * 100)
      ELSE 0
    END as accuracy
  FROM users u
  WHERE u.total_guesses > 0
  ORDER BY u.total_tokens_earned DESC, u.correct_guesses DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample images (you can add more later)
INSERT INTO images (image_url, prompt, difficulty) VALUES
  ('https://picsum.photos/1024/1024?random=1', 'A futuristic city at sunset with flying cars', 'medium'),
  ('https://picsum.photos/1024/1024?random=2', 'A magical forest with glowing mushrooms', 'medium'),
  ('https://picsum.photos/1024/1024?random=3', 'An astronaut floating in colorful space', 'easy')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images (everyone can read)
CREATE POLICY "Anyone can view images"
  ON images FOR SELECT
  USING (true);

-- RLS Policies for guesses (users can insert their own, view their own)
CREATE POLICY "Users can insert their own guesses"
  ON guesses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view all guesses"
  ON guesses FOR SELECT
  USING (true);

-- RLS Policies for users (everyone can read leaderboard)
CREATE POLICY "Anyone can view user stats"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert/update user stats"
  ON users FOR ALL
  USING (true);


