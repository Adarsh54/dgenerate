import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Image {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Guess {
  id: string;
  image_id: string;
  wallet_id: string;
  guess_text: string;
  is_correct: boolean;
  similarity_score: number;
  tokens_earned: number;
  created_at: string;
}

export interface User {
  wallet_id: string;
  total_guesses: number;
  correct_guesses: number;
  total_tokens_earned: number;
  created_at: string;
  updated_at: string;
}


