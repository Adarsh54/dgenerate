import { PublicKey } from '@solana/web3.js';

export interface GameState {
  tokenMint: PublicKey;
  totalMinted: number;
  currentReward: number;
  halvingThreshold: number;
  authority: PublicKey;
}

export interface VideoChallenge {
  id: string;
  url: string;
  prompt?: string; // Only available to admins
}

export interface GuessResult {
  success: boolean;
  message: string;
  tokensEarned?: number;
}

