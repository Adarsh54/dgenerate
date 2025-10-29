use anchor_lang::prelude::*;

#[account]
pub struct GameState {
    pub token_mint: Pubkey,
    pub total_minted: u64,
    pub current_reward: u64,
    pub halving_threshold: u64,
    pub authority: Pubkey,
}