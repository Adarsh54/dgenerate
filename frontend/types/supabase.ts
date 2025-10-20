// Supabase Database Types for Sora Guesser
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      image_challenges: {
        Row: {
          id: string;
          image_url: string;
          actual_prompt: string;
          image_id: string;
          created_by: string | null;
          is_active: boolean;
          difficulty_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          actual_prompt: string;
          image_id: string;
          created_by?: string | null;
          is_active?: boolean;
          difficulty_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          actual_prompt?: string;
          image_id?: string;
          created_by?: string | null;
          is_active?: boolean;
          difficulty_level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_guesses: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          guess_text: string;
          similarity_score: number | null;
          is_correct: boolean;
          tokens_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          guess_text: string;
          similarity_score?: number | null;
          is_correct?: boolean;
          tokens_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          guess_text?: string;
          similarity_score?: number | null;
          is_correct?: boolean;
          tokens_earned?: number;
          created_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          total_guesses: number;
          correct_guesses: number;
          total_tokens_earned: number;
          current_streak: number;
          best_streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_guesses?: number;
          correct_guesses?: number;
          total_tokens_earned?: number;
          current_streak?: number;
          best_streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_guesses?: number;
          correct_guesses?: number;
          total_tokens_earned?: number;
          current_streak?: number;
          best_streak?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_start: string;
          session_end: string | null;
          challenges_attempted: number;
          correct_answers: number;
          tokens_earned: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_start?: string;
          session_end?: string | null;
          challenges_attempted?: number;
          correct_answers?: number;
          tokens_earned?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_start?: string;
          session_end?: string | null;
          challenges_attempted?: number;
          correct_answers?: number;
          tokens_earned?: number;
        };
      };
    };
    Functions: {
      create_or_update_user: {
        Args: {
          wallet_addr: string;
          username_val?: string | null;
        };
        Returns: string;
      };
      get_user_stats: {
        Args: {
          user_uuid: string;
        };
        Returns: {
          total_guesses: number;
          correct_guesses: number;
          total_tokens_earned: number;
          current_streak: number;
          best_streak: number;
          accuracy_rate: number;
        }[];
      };
      get_leaderboard: {
        Args: {
          limit_count?: number;
        };
        Returns: {
          wallet_address: string;
          username: string | null;
          total_tokens_earned: number;
          correct_guesses: number;
          accuracy_rate: number;
          best_streak: number;
        }[];
      };
    };
  };
}

// Type aliases for easier use
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type ImageChallenge = Database['public']['Tables']['image_challenges']['Row'];
export type ImageChallengeInsert = Database['public']['Tables']['image_challenges']['Insert'];
export type ImageChallengeUpdate = Database['public']['Tables']['image_challenges']['Update'];

export type UserGuess = Database['public']['Tables']['user_guesses']['Row'];
export type UserGuessInsert = Database['public']['Tables']['user_guesses']['Insert'];
export type UserGuessUpdate = Database['public']['Tables']['user_guesses']['Update'];

export type UserStats = Database['public']['Tables']['user_stats']['Row'];
export type UserStatsInsert = Database['public']['Tables']['user_stats']['Insert'];
export type UserStatsUpdate = Database['public']['Tables']['user_stats']['Update'];

export type GameSession = Database['public']['Tables']['game_sessions']['Row'];
export type GameSessionInsert = Database['public']['Tables']['game_sessions']['Insert'];
export type GameSessionUpdate = Database['public']['Tables']['game_sessions']['Update'];

// Function return types
export type UserStatsResult = Database['public']['Functions']['get_user_stats']['Returns'][0];
export type LeaderboardEntry = Database['public']['Functions']['get_leaderboard']['Returns'][0];

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateChallengeRequest {
  imageUrl: string;
  actualPrompt: string;
  imageId: string;
  userId: string;
  difficultyLevel?: number;
}

export interface SubmitGuessRequest {
  userId: string;
  challengeId: string;
  guessText: string;
  similarityScore: number;
  isCorrect: boolean;
  tokensEarned: number;
}

export interface CreateUserRequest {
  walletAddress: string;
  username?: string;
}

export interface UserStatsResponse {
  totalGuesses: number;
  correctGuesses: number;
  totalTokensEarned: number;
  currentStreak: number;
  bestStreak: number;
  accuracyRate: number;
}

export interface LeaderboardResponse {
  walletAddress: string;
  username: string | null;
  totalTokensEarned: number;
  correctGuesses: number;
  accuracyRate: number;
  bestStreak: number;
}
