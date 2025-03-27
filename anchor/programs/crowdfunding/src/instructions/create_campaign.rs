use anchor_lang::prelude::*;

use crate::{
    constants::ANCHOR_DISCRIMINATOR_SIZE,
    errors::CustomErrorCode,
    state::{program_state, Campaign, ProgramState},
};

pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    campaign_title: String,
    campaign_description: String,
    campaign_image_url: String,
    campaign_goal_amount: u64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let program_state = &mut ctx.accounts.program_state;

    // why not check if the program is initialized
    // if(program_state.initialize)

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

    program_state.campaign_count += 1;

    campaign.campaign_id = program_state.campaign_count;
    campaign.campaign_ower = ctx.accounts.campaign_owner.key();
    campaign.campaign_title = campaign_title;
    campaign.campaign_description = campaign_description;
    campaign.campaign_image_url = campaign_image_url;
    campaign.campaign_goal_amount = campaign_goal_amount;
    campaign.campaign_raised_amount = 0;
    campaign.timestamp = Clock::get()?.unix_timestamp as u64;
    campaign.donors_count = 0;
    campaign.withdrawal_count = 0;
    campaign.balance = 0;
    campaign.is_active = true;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub campaign_owner: Signer<'info>,

    #[account(init,
        payer = campaign_owner,
        space = ANCHOR_DISCRIMINATOR_SIZE + Campaign::INIT_SPACE,
        seeds = [b"campaign",program_state.campaign_count.to_le_bytes().as_ref()],   
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    //it should be mutable
    pub program_state: Account<'info, ProgramState>,
    pub system_program: Program<'info, System>,
}
