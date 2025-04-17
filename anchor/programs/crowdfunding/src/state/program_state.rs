use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProgramState {
    pub initialize: bool,
    pub campaign_count: u64,
    pub platform_fee: u64,
    pub platform_address: Pubkey,
}

// we can have one more field here, how much money is raised so far on this platform
