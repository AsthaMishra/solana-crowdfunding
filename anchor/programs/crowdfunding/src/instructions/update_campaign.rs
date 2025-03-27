use anchor_lang::prelude::*;

use crate::state::{Campaign, ProgramState};

use crate::errors::*;

pub fn update_campaign(
    ctx: Context<UpdateCampaign>,
    campaign_id: u64,
    campaign_title: String,
    campaign_description: String,
    campaign_image_url: String,
    campaign_goal_amount: u64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;

    if campaign.campaign_id != campaign_id {
        return Err(CustomErrorCode::InvalidCampaignId.into());
    }

    if campaign_title.len() > 64 || campaign_title.len() <= 0 {
        return Err(CustomErrorCode::TitleTooLongOrTooShort.into());
    }

    if campaign_description.len() > 512 || campaign_description.len() <= 0 {
        return Err(CustomErrorCode::DescriptionTooLongOrTooShort.into());
    }

    if campaign_image_url.len() > 256 || campaign_image_url.len() <= 0 {
        return Err(CustomErrorCode::ImageUrlTooLongOrTooShort.into());
    }

    if campaign_goal_amount <= 0 {
        return Err(CustomErrorCode::InvalidGoalAmount.into());
    }

    campaign.campaign_title = campaign_title;
    campaign.campaign_description = campaign_description;
    campaign.campaign_image_url = campaign_image_url;
    campaign.campaign_goal_amount = campaign_goal_amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct UpdateCampaign<'info> {
    #[account(mut)]
    pub campaign_ower: Signer<'info>,

    //teher shoudl be space realocation
    #[account(mut,
        has_one = campaign_ower, //has same key with same value
        // has_one = campaign_id, // this gives error because has_one can only be used for pubkeys
        seeds =  [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,
    pub system_program: Program<'info, System>,
}
