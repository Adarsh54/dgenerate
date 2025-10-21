import { useState, useEffect } from 'react';
import { SupabaseService } from '@/lib/supabase';
import { 
  User, 
  ImageChallenge, 
  UserGuess, 
  UserStats, 
  LeaderboardEntry,
  CreateChallengeRequest,
  SubmitGuessRequest,
  CreateUserRequest
} from '@/types/supabase';

// Hook for managing user data
export function useUser(walletAddress: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await SupabaseService.getUserByWallet(walletAddress);
        setUser(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [walletAddress]);

  const createOrUpdateUser = async (username?: string) => {
    if (!walletAddress) return null;
    
    setLoading(true);
    setError(null);
    try {
      const userId = await SupabaseService.createOrUpdateUser(walletAddress, username);
      const userData = await SupabaseService.getUserByWallet(walletAddress);
      setUser(userData);
      return userId;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, createOrUpdateUser };
}

// Hook for managing challenges
export function useChallenges() {
  const [challenges, setChallenges] = useState<ImageChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getActiveChallenges(limit);
      setChallenges(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRandomChallenge = async () => {
    setLoading(true);
    setError(null);
    try {
      const challenge = await SupabaseService.getRandomChallenge();
      return challenge;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (challengeData: CreateChallengeRequest) => {
    setLoading(true);
    setError(null);
    try {
      const challenge = await SupabaseService.createChallenge(challengeData);
      setChallenges(prev => [challenge, ...prev]);
      return challenge;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    challenges, 
    loading, 
    error, 
    fetchChallenges, 
    getRandomChallenge, 
    createChallenge 
  };
}

// Hook for managing user guesses
export function useGuesses(userId: string | null) {
  const [guesses, setGuesses] = useState<UserGuess[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setGuesses([]);
      return;
    }

    const fetchGuesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SupabaseService.getUserGuesses(userId);
        setGuesses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuesses();
  }, [userId]);

  const submitGuess = async (guessData: SubmitGuessRequest) => {
    setLoading(true);
    setError(null);
    try {
      const guess = await SupabaseService.submitGuess(guessData);
      setGuesses(prev => [guess, ...prev]);
      return guess;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { guesses, loading, error, submitGuess };
}

// Hook for managing user statistics
export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SupabaseService.getUserStats(userId);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const refreshStats = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getUserStats(userId);
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refreshStats };
}

// Hook for managing leaderboard
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getLeaderboard(limit);
      setLeaderboard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { leaderboard, loading, error, fetchLeaderboard };
}

// Hook for managing game sessions
export function useGameSession(userId: string | null) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setSession(null);
      return;
    }

    const fetchActiveSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const activeSession = await SupabaseService.getActiveSession(userId);
        setSession(activeSession);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSession();
  }, [userId]);

  const createSession = async () => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    try {
      const newSession = await SupabaseService.createGameSession(userId);
      setSession(newSession);
      return newSession;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (sessionId: string, updateData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSession = await SupabaseService.updateGameSession(sessionId, updateData);
      setSession(updatedSession);
      return updatedSession;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { session, loading, error, createSession, updateSession };
}
