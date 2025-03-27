use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub campaign_id: u64,
    pub campaign_ower: Pubkey,
    #[max_len(64)]
    pub campaign_title: String,
    #[max_len(512)]
    pub campaign_description: String,
    #[max_len(256)]
    pub campaign_image_url: String,
    pub campaign_goal_amount: u64,
    pub campaign_raised_amount: u64,
    pub timestamp: u64,
    pub donors_count: u64,
    pub withdrawal_count: u64,
    pub balance: u64,
    pub is_active: bool,
}
