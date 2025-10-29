use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Calculation overflow occurred")]
    CalculationOverflow,
    #[msg("Invalid API response")]
    InvalidApiResponse,
    #[msg("Unauthorized access")]
    Unauthorized,
}


