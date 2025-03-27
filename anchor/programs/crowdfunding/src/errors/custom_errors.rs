use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrorCode {
    #[msg("Program Already Initialized")]
    ProgramAlreadyInitialized,
    #[msg("Campaign Title either too long or too short")]
    TitleTooLongOrTooShort,
    #[msg("Campaign Description either too long or too short")]
    DescriptionTooLongOrTooShort,
    #[msg("Campaign Image URL either too long or too short")]
    ImageUrlTooLongOrTooShort,
    #[msg("Invalid Goal Amount")]
    InvalidGoalAmount,
    #[msg("Invalid Campaign Id")]
    InvalidCampaignId,
    #[msg("Campaign Already Deleted")]
    CampaignAlreadyDeleted,
    #[msg("Campaign Not Active")]
    CampaignNotActive,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Goal Amount Reached")]
    GoalAmountReached,
    #[msg("UnAuthorized Withdrawer")]
    UnAuthorizedWithdrawer,
    #[msg("Insufficient Balance")]
    InsufficientBalance,
    #[msg("Invalid Platform Address")]
    InvalidPlatformAddress,
    #[msg("Invalid Platform Fee")]
    InvalidPlatformFee,
    #[msg("UnAuthorized Access For Platform State Update")]
    UnAuthorizedAccessForPlatformStateUpdate,
}
