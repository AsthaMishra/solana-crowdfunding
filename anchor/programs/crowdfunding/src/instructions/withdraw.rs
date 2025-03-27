use anchor_lang::prelude::*;

use crate::{
    constants::{ANCHOR_DISCRIMINATOR_SIZE, MINIMUM_DONOATION_AMOUNT},
    errors::CustomErrorCode,
    state::{Campaign, ProgramState, Transaction},
};

pub fn withdraw(ctx: Context<Withdraw>, campaign_id: u64, amount: u64) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let transaction = &mut ctx.accounts.transaction;
    let program_state = &mut ctx.accounts.program_state;

    let withdrawer = ctx.accounts.withrawer.key();
    let platform_address = ctx.accounts.platform_address.key();

    if campaign.campaign_id != campaign_id {
        return Err(CustomErrorCode::InvalidCampaignId.into());
    }

    if campaign.campaign_ower != withdrawer {
        return Err(CustomErrorCode::UnAuthorizedWithdrawer.into());
    }

    if campaign.is_active == false {
        return Err(CustomErrorCode::CampaignNotActive.into());
    }

    if amount <= MINIMUM_DONOATION_AMOUNT {
        return Err(CustomErrorCode::InvalidAmount.into());
    }

    if campaign.balance < amount {
        return Err(CustomErrorCode::InsufficientBalance.into());
    }

    if platform_address != program_state.platform_address {
        return Err(CustomErrorCode::InvalidPlatformAddress.into());
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub withrawer: Signer<'info>,

    //withdrawal happening from the campaign account
    //withdrawer can only be owner of campaign account
    #[account(mut,
        seeds =  [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump,)]
    pub campaign: Account<'info, Campaign>,

    #[account(init,
        payer = withrawer,
        space = ANCHOR_DISCRIMINATOR_SIZE + Transaction::INIT_SPACE,
        seeds = [b"withdraw", withrawer.key().as_ref(), 
        campaign_id.to_le_bytes().as_ref(),
        (campaign.withdrawal_count+1).to_le_bytes().as_ref()],
        bump,
        )]
    pub transaction: Account<'info, Transaction>,

    //program state contains platform fees for commision
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,

    // why do we have plaftorm address here , why can't we fetch it from program state
    // to make sure , commision is going to platform address specified in program state
    #[account(mut)]
    pub platform_address: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
