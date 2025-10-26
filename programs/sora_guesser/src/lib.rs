#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sora_guesser {
    use super::*;

    // Initialize the game state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.token_mint = ctx.accounts.token_mint.key();
        game_state.total_minted = 0;
        game_state.current_reward = 10_000; // Initial reward of 10000 tokens
        game_state.halving_threshold = 10_000_000_000; // Tokens to mint before halving
        game_state.authority = ctx.accounts.authority.key();
        Ok(())
    }


    pub fn reward_user(
        ctx: Context<RewardUser>,
        recipient_wallet: Pubkey,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        let reward_amount = game_state.current_reward;
        
        // Update total minted
        game_state.total_minted = game_state.total_minted.checked_add(reward_amount)
            .ok_or(ErrorCode::CalculationOverflow)?;
            
        // Check if we need to halve the reward
        if game_state.total_minted >= game_state.halving_threshold {
            game_state.current_reward = game_state.current_reward.checked_div(2)
                .ok_or(ErrorCode::CalculationOverflow)?;
            // reset counter
            game_state.total_minted = game_state.total_minted.checked_sub(game_state.halving_threshold)
                .ok_or(ErrorCode::CalculationOverflow)?;
        }

        // Mint tokens to recipient
        let bump = ctx.bumps.game_authority;
        let seeds = &[
            b"game_authority".as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.game_authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::mint_to(cpi_ctx, reward_amount)?;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 8 + 8 + 8 + 32, // discriminator + token_mint + total_minted + current_reward + halving_threshold + authority
    )]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    /// CHECK: PDA that acts as mint authority
    #[account(
        seeds = [b"game_authority"],
        bump,
    )]
    pub game_authority: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RewardUser<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    /// CHECK: PDA that acts as mint authority
    #[account(
        seeds = [b"game_authority"],
        bump,
    )]
    pub game_authority: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateReward<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    
    #[account(
        constraint = authority.key() == game_state.authority @ ErrorCode::Unauthorized
    )]
    pub authority: Signer<'info>,
}

#[account]
pub struct GameState {
    pub token_mint: Pubkey,
    pub total_minted: u64,
    pub current_reward: u64,
    pub halving_threshold: u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Calculation overflow occurred")]
    CalculationOverflow,
    #[msg("Invalid API response")]
    InvalidApiResponse,
    #[msg("Unauthorized access")]
    Unauthorized,
}
