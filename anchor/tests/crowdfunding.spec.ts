import  * as anchor from "@coral-xyz/anchor";
import { stat } from "fs";
import { describe, it } from "node:test";
import { isAnyArrayBuffer } from "util/types";
import {Basic} from "../target/types/basic";

describe('crowdfunding', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
 
  const program = anchor.workspace.Crowdfunding as anchor.Program<Basic>;

    let campaignId: any;

it('should run the program', async () => {
    // Add your test here.
  const campaign_owner = provider.wallet.publicKey;
  const [programStatePDA] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const state = await program.account.programState.fetch(programStatePDA);
  console.log("Program state:", state); 

  campaignId = state.campaignCount.toString();

  const [campaignPDA] = await anchor.web3.PublicKey.findProgramAddressSync(  
    [Buffer.from("campaign"),campaignId.toArrayLike(Buffer, 'le', 8)],
    program.programId
  );

  const title = "Test Campaign";
  const description = "This is a test campaign";
  const imageUrl = "https://example.com/image.png";
  const goalAmount = new anchor.BN(1000 * 1e9); // 1000 SOL

    const tx = await program.methods
        .createCampaign(title, description, imageUrl, goalAmount)
        .accounts({
        campaign_owner: campaign_owner,
        campaign: campaignPDA,
        programState: programStatePDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

  });  
})