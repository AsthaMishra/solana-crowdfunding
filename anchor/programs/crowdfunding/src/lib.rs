pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

declare_id!("6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF");
use crate::instructions::*;

#[program]
pub mod basic {
    use super::*;

    pub fn initialize(ctx: Context<InitializeProgramState>) -> Result<()> {
        instructions::initialize_program_state(ctx)
    }

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        campaign_title: String,
        campaign_description: String,
        campaign_image_url: String,
        campaign_goal_amount: u64,
    ) -> Result<()> {
        instructions::create_campaign(
            ctx,
            campaign_title,
            campaign_description,
            campaign_image_url,
            campaign_goal_amount,
        )
    }

    pub fn update_campaign(
        ctx: Context<UpdateCampaign>,
        campaign_id: u64,
        campaign_title: String,
        campaign_description: String,
        campaign_image_url: String,
        campaign_goal_amount: u64,
    ) -> Result<()> {
        instructions::update_campaign(
            ctx,
            campaign_id,
            campaign_title,
            campaign_description,
            campaign_image_url,
            campaign_goal_amount,
        )
    }

    pub fn delete_campaign(ctx: Context<DeleteCampaign>, campaign_id: u64) -> Result<()> {
        instructions::delete_campaign(ctx, campaign_id)
    }

    pub fn donate(ctx: Context<Donate>, campaign_id: u64, amount: u64) -> Result<()> {
        instructions::donate(ctx, campaign_id, amount)
    }
}
