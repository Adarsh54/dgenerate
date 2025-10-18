use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sora_guesser {
    use super::*;

    // Initialize the game state with the token mint
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.token_mint = ctx.accounts.token_mint.key();
        game_state.total_minted = 0;
        game_state.current_reward = 100; // Initial reward of 100 tokens
        Ok(())
    }

    // Reward a winner with tokens
    pub fn reward_winner(ctx: Context<RewardWinner>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        // Calculate current reward amount
        let reward_amount = game_state.current_reward;
        
        // Update total minted
        game_state.total_minted = game_state.total_minted.checked_add(reward_amount)
            .ok_or(ErrorCode::CalculationOverflow)?;
            
        // Check if we need to halve the reward
        if game_state.total_minted >= 100_000 {
            game_state.current_reward = game_state.current_reward.checked_div(2)
                .ok_or(ErrorCode::CalculationOverflow)?;
            // Reset total_minted counter for next halving
            game_state.total_minted = game_state.total_minted.checked_sub(100_000)
                .ok_or(ErrorCode::CalculationOverflow)?;
        }

        // Mint tokens to winner
        let seeds = &[
            b"game_authority".as_ref(),
            &[ctx.bumps.game_authority],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.winner_token_account.to_account_info(),
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
        space = 8 + 32 + 8 + 8, // discriminator + pubkey + u64 + u64
    )]
    pub game_state: Account<'info, GameState>,
    
    pub token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RewardWinner<'info> {
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
    pub winner_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct GameState {
    pub token_mint: Pubkey,
    pub total_minted: u64,
    pub current_reward: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Calculation overflow occurred")]
    CalculationOverflow,
}
