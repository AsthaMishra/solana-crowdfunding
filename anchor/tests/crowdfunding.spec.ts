import  * as anchor from "@coral-xyz/anchor";
import { stat } from "fs";
import { describe, it } from "node:test";
import { isAnyArrayBuffer } from "util/types";
import { Crowdfunding } from '../target/types/crowdfunding';
import idl from '../target/idl/crowdfunding.json';

describe('crowdfunding', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
 
    const program = new anchor.Program<Crowdfunding>(idl as any, provider);

    let campaignId: any;

it('should run the program', async () => { 
    // Add your test here.
  const campaign_owner = provider.wallet.publicKey;
  console.log("Campaign owner:", campaign_owner.toString(), "program.programId :", program.programId.toString());

  const [programStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const state = await program.account.programState.fetch(programStatePDA);
  console.log("Program state:", state); 

 campaignId = state.campaignCount as anchor.BN;

  // campaignId = campaignId.add(new anchor.BN(1));
  console.log("Campaign ID:", campaignId.toString());

  const [campaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), campaignId.toArrayLike(Buffer, 'le', 8)],
    program.programId
  );
  console.log("Campaign PDA:", campaignPDA.toString() , "programStatePDA :", programStatePDA.toString());

  const title = "Test Campaign";
  const description = "This is a test campaign";
  const imageUrl = "https://example.com/image.png";
  const goalAmount = new anchor.BN(1000 * 1e9); // 1000 SOL

    const tx = await program.methods
        .createCampaign(title, description, imageUrl, goalAmount)
        .accountsPartial({
          campaignOwner: campaign_owner,
          campaign: campaignPDA,
          programState:   programStatePDA,
          systemProgram: anchor.web3.SystemProgram.programId,
          })
        .rpc();

        console.log("Transaction signature", tx);

        const campaign = await program.account.campaign.fetch(campaignPDA);
        console.log("Campaign created with ID:", campaignId.toString());
        console.log("Campaign details:", campaign);

  });  
})

//    Attempted to log "Campaign PDA: 5GrEaaiqQiZETdwjqMzqcrSTCYTCzkf1zDE3pDZUMmFN".