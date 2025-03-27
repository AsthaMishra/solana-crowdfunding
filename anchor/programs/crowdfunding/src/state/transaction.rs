use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Transaction {
    pub campaign_id: u64,
    pub transaction_owner: Pubkey,
    pub amount: u64,
    pub timestamp: u64,
    pub is_credit: bool,
}
