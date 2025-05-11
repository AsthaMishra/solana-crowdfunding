// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import CrowdfundingIDL from '../target/idl/crowdfunding.json'
import type { Crowdfunding } from '../target/types/crowdfunding'

// Re-export the generated IDL and type
export { Crowdfunding, CrowdfundingIDL }

// The programId is imported from the program IDL.
export const Crowdfunding_PROGRAM_ID = new PublicKey(CrowdfundingIDL.address)

// This is a helper function to get the Crowdfunding Anchor program.
export function getCrowdfundingProgram(provider: AnchorProvider) {
  return new Program(CrowdfundingIDL as Crowdfunding, provider)
}
