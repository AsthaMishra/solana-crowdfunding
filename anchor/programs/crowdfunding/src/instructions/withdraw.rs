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

    let withdrawer = &ctx.accounts.withrawer;
    let platform_address = &ctx.accounts.platform_address;

    if campaign.campaign_id != campaign_id {
        return Err(CustomErrorCode::InvalidCampaignId.into());
    }

    if campaign.campaign_ower != withdrawer.key() {
        return Err(CustomErrorCode::UnAuthorizedWithdrawer.into());
    }

    if campaign.is_active == false {
        return Err(CustomErrorCode::CampaignNotActive.into());
    }

    // theer should not be any constraint for withdrawal amount
    // if amount <= MINIMUM_DONOATION_AMOUNT {
    //     return Err(CustomErrorCode::InvalidAmount.into());
    // }

    if campaign.balance < amount {
        return Err(CustomErrorCode::InsufficientBalance.into());
    }

    if platform_address.key() != program_state.platform_address.key() {
        return Err(CustomErrorCode::InvalidPlatformAddress.into());
    }

    let rent = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());

    if amount > **campaign.to_account_info().lamports.borrow() - rent {
        msg!("Insufficient balance to cover rent");
        return Err(CustomErrorCode::InsufficientBalanceToCoverRent.into());
    }

    let platform_fee = amount * program_state.platform_fee / 100;
    let withdraw_amount = amount - platform_fee;

    **campaign.to_account_info().try_borrow_mut_lamports()? -= withdraw_amount;
    **withdrawer.to_account_info().try_borrow_mut_lamports()? += withdraw_amount;

    //platform making money on every withrawal
    **campaign.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
    **withdrawer.to_account_info().try_borrow_mut_lamports()? += platform_fee;

    campaign.withdrawal_count += 1;
    campaign.balance -= amount;

    transaction.campaign_id = campaign_id;
    transaction.transaction_owner = withdrawer.key();
    transaction.amount = amount;
    transaction.is_credit = false;
    transaction.timestamp = Clock::get()?.unix_timestamp as u64;

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
    /// CHECK: platform address should be fetched from program state
    #[account(mut)]
    pub platform_address: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
