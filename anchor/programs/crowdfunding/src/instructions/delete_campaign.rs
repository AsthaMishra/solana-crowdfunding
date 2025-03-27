use anchor_lang::prelude::*;

use crate::{errors::CustomErrorCode, state::Campaign};

pub fn delete_campaign(ctx: Context<DeleteCampaign>, campaign_id: u64) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    if campaign.campaign_id != campaign_id {
        return Err(CustomErrorCode::InvalidCampaignId.into());
    }

    if campaign.is_active == false {
        return Err(CustomErrorCode::CampaignAlreadyDeleted.into());
    }

    campaign.is_active = false;
    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct DeleteCampaign<'info> {
    #[account(mut)]
    pub campaign_ower: Signer<'info>,

    //no space reallocation required
    #[account(mut,
        has_one = campaign_ower, //has same key with same value
        // has_one = campaign_id, // this gives error because has_one can only be used for pubkeys
        seeds =  [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,
    pub system_program: Program<'info, System>,
}
