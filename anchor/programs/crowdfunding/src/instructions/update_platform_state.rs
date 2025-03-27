use anchor_lang::prelude::*;

use crate::{constants::MAX_PLATFORM_FEE, errors::CustomErrorCode, state::ProgramState};

pub fn update_platform_state(ctx: Context<UpdatePlatformState>, platform_fee: u64) -> Result<()> {
    let program_state = &mut ctx.accounts.program_state;

    if program_state.initialize == false {
        return Err(CustomErrorCode::ProgramNotInitialized.into());
    }

    if ctx.accounts.signer.key() != program_state.platform_address.key() {
        return Err(CustomErrorCode::UnAuthorizedAccessForPlatformStateUpdate.into());
    }

    if platform_fee > MAX_PLATFORM_FEE || platform_fee < 0 {
        return Err(CustomErrorCode::InvalidPlatformFee.into());
    }

    if program_state.platform_fee == platform_fee {
        return Err(CustomErrorCode::PlatformFeeAlreadyUpdated.into());
    }

    program_state.platform_fee = platform_fee;
    Ok(())
}

#[derive(Accounts)]
pub struct UpdatePlatformState<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
    )]
    pub program_state: Account<'info, ProgramState>,

    pub system_program: Program<'info, System>,
}
