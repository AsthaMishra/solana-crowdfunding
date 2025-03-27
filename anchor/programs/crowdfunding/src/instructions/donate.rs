use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction::transfer},
};

use crate::{
    constants::{ANCHOR_DISCRIMINATOR_SIZE, MINIMUM_DONOATION_AMOUNT},
    errors::CustomErrorCode,
    state::{Campaign, Transaction},
};

pub fn donate(ctx: Context<Donate>, campaign_id: u64, amount: u64) -> Result<()> {
    let transaction = &mut ctx.accounts.transaction;
    let campaign = &mut ctx.accounts.campaign;

    if campaign.campaign_id != campaign_id {
        return Err(CustomErrorCode::InvalidCampaignId.into());
    }

    if campaign.is_active == false {
        return Err(CustomErrorCode::CampaignNotActive.into());
    }

    if amount <= MINIMUM_DONOATION_AMOUNT {
        return Err(CustomErrorCode::InvalidAmount.into());
    }

    if campaign.campaign_raised_amount >= campaign.campaign_goal_amount {
        return Err(CustomErrorCode::GoalAmountReached.into());
    }

    //this intruction needs to be invoked also
    let transaction_instruction = transfer(
        &ctx.accounts.transaction_owner.key(),
        &campaign.key(),
        amount,
    );

    let tx_result = invoke(
        &transaction_instruction,
        &[
            ctx.accounts.transaction_owner.to_account_info(),
            campaign.to_account_info(),
        ],
    );

    if let Err(e) = tx_result {
        msg!("Donation transfer failed: {:?}", e);
        return Err(e.into());
    }

    campaign.campaign_raised_amount += transaction.amount;
    campaign.donors_count += 1;
    campaign.balance += transaction.amount;

    transaction.amount = amount;
    transaction.campaign_id = campaign_id;
    transaction.transaction_owner = ctx.accounts.transaction_owner.key();
    transaction.is_credit = true;
    transaction.timestamp = Clock::get()?.unix_timestamp as u64;

    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct Donate<'info> {
    #[account(mut)]
    pub transaction_owner: Signer<'info>,

    #[account(init,
    payer = transaction_owner,
    space = ANCHOR_DISCRIMINATOR_SIZE + Transaction::INIT_SPACE,
    seeds = [b"donate", transaction_owner.key().as_ref(), 
    campaign_id.to_le_bytes().as_ref(),
    (campaign.donors_count+1).to_le_bytes().as_ref()],
    bump,
    )]
    pub transaction: Account<'info, Transaction>,

    //campaign account is mutable because we are updating the raised amount
    #[account(mut,
        seeds =  [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump,)]
    pub campaign: Account<'info, Campaign>,
    pub system_program: Program<'info, System>,
}
