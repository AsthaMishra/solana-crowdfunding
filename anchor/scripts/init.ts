import * as anchor from '@coral-xyz/anchor';
import  fs from 'fs';
import { Basic } from '../target/types/basic';
import idl from '../target/idl/basic.json';
import { PublicKey, SystemProgram } from '@solana/web3.js';



const main = async(cluster: string ) => {

    const clusterUrls : any = {
        'devnet': 'https://api.devnet.solana.com',
        'testnet': 'https://api.testnet.solana.com',
        'mainnet-beta': 'https://api.mainnet-beta.solana.com',
        'localhost': 'http://127.0.0.1:8899',
    }

    const clusterUrl = clusterUrls[cluster]

    //  craete connection
    const connection = new anchor.web3.Connection(clusterUrl, 'confirmed')

    //  create wallet
    //  get the keypair from the local file
    //  the keypair file is located at ~/.config/solana/id.json
    const keypairPath = `${process.env.HOME}/.config/solana/id.json`
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    const wallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(keypairData));
    const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), { 
        commitment: 'confirmed',
    });

    //  create anchor provider
    anchor.setProvider(provider);

    const program = new anchor.Program<Basic>(idl as any, provider);
    const [programStatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("program_state")],
        program.programId
    )


    try{
        const state = await program.account.programState.fetch(programStatePda);
        console.log("Program state already initialized !!! ", state.initialize);
    }
    catch(e){
        console.log("Exception cached || Program state not initialized !!! ");
        const tx = await program.methods.initialize()
        .accountsPartial({
            programState: programStatePda,
            signer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        }).rpc();
        console.log("Transaction signature", tx);

        await connection.confirmTransaction(tx, 'finalized');
        console.log("Program state  initialized !!! ");

    }
}

const cluster = process.env.CLUSTER || 'localhost';
main(cluster)
    .then(() => {
        console.log("Initialization completed !!!");
    }
    ).catch((err) => {
        console.log("Error: ", err);
    }
    ).finally(() => {
        console.log("Finally");
    });