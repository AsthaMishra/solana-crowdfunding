use anchor_lang::prelude::*;

use crate::{constants::ANCHOR_DISCRIMINATOR_SIZE, errors::CustomErrorCode, state::ProgramState};

pub fn initialize_program_state(ctx: Context<InitializeProgramState>) -> Result<()> {

    let initialized_program = &mut ctx.accounts.program_state;

    if initialized_program.initialize{
        return Err(CustomErrorCode::ProgramAlreadyInitialized.into());
    }

    initialized_program.platform_address = ctx.accounts.signer.key();
    initialized_program.campaign_count = 0;
    initialized_program.platform_fee = 5; // 5 percent by defautlt
    initialized_program.initialize = true;

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeProgramState<'info> {
    #[account(mut)]
    pub signer : Signer<'info>, //deployer

    #[account(
        init,                    
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + ProgramState::INIT_SPACE,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    pub system_program: Program<'info, System>,
}
