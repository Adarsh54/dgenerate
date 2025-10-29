#![allow(unexpected_cfgs)]
mod error;
mod constants;
mod state;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use crate::error::ErrorCode;
use crate::state::GameState;

declare_id!("EPKw6RHc8Bf7m8BpKxv66NMmzqwnn7tSRwcyJ9cNbNnD");

#[program]
pub mod dgenerate {
    use super::*;

    // Initialize the game state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.token_mint = ctx.accounts.token_mint.key();
        game_state.total_minted = 0;
        game_state.current_reward = constants::INITIAL_REWARD; // Initial reward amount
        game_state.halving_threshold = constants::HALVING_THRESHOLD; // Threshold before halving
        game_state.authority = ctx.accounts.authority.key();
        Ok(())
    }


    pub fn reward_user(
        ctx: Context<RewardUser>,
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
            constants::GAME_AUTHORITY_SEED,
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
        space = crate::constants::GAME_STATE_SPACE, // discriminator + fields
    )]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    /// CHECK: PDA that acts as mint authority
    #[account(
        seeds = [crate::constants::GAME_AUTHORITY_SEED],
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
        seeds = [crate::constants::GAME_AUTHORITY_SEED],
        bump,
    )]
    pub game_authority: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}