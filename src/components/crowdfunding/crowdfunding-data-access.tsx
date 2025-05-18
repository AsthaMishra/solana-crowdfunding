'use client'

import { getCrowdfundingProgramId, getCrowdfundingProgram } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AnchorError, BN } from '@coral-xyz/anchor'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import * as anchor from "@coral-xyz/anchor";


interface CrowdfundingEntryArgs {
  campaign_title: string,
  campaign_description: string,
  campaign_image_url: string,
  campaign_goal_amount: number,
  campaign_id: number,
}

export function useCrowdfundingProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrowdfundingProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCrowdfundingProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['crowdfunding', 'all', { cluster }],
    queryFn: () => program.account.campaign.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // Campaign mutations
  const createCampaign = useMutation<string, Error, CrowdfundingEntryArgs>({
    mutationKey: ['crowdfunding', 'create-campaign', { cluster }],
    mutationFn: async ({ campaign_title, campaign_description, campaign_image_url, campaign_goal_amount }) => {

      const [programStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("program_state")],
        program.programId
      );

      const state = await program.account.programState.fetch(programStatePDA);
      console.log("Program state:", state);

      const campaignId = state.campaignCount as anchor.BN;
      const [campaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("campaign"), campaignId.toArrayLike(Buffer, 'le', 8)],
        program.programId
      );

      console.log("campaignId:", campaignId);
      console.log("campaignPDA:", campaignPDA);


      return await program.methods
        .createCampaign(campaign_title, campaign_description, campaign_image_url, new BN(campaign_goal_amount * 10e9)).accountsPartial({
          campaignOwner: provider.wallet.publicKey,
          campaign: campaignPDA,
          programState: programStatePDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to create campaign'),
  })


  return {
    program,
    programId,
    getProgramAccount,
    accounts,
    createCampaign,
  }
}

export function useCrowdfundingProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrowdfundingProgram()

  const accountQuery = useQuery({
    queryKey: ['crowdfunding', 'fetch', { cluster, account }],
    queryFn: () => program.account.campaign.fetch(account),
  })

  const donate = useMutation<string, Error, CrowdfundingEntryArgs>({
    mutationKey: ['crowdfunding', 'donate', { cluster }],
    mutationFn: ({ campaign_id, campaign_goal_amount }) => {
      return program.methods
        .donate(new BN(campaign_id), new BN(campaign_goal_amount * 1e9))
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to donate'),
  })

  const updateCampaign = useMutation<string, Error, CrowdfundingEntryArgs>({
    mutationKey: ['crowdfunding', 'update-campaign', { cluster }],
    mutationFn: ({ campaign_id, campaign_title, campaign_description, campaign_image_url, campaign_goal_amount }) => {
      return program.methods
        .updateCampaign(new BN(campaign_id), campaign_title, campaign_description, campaign_image_url, new BN(campaign_goal_amount * 1e9))
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Campaign updated successfully')
    },
    onError: () => toast.error('Failed to update campaign'),
  })

  const deleteCampaign = useMutation<string, Error, CrowdfundingEntryArgs>({
    mutationKey: ['crowdfunding', 'delete-campaign', { cluster }],
    mutationFn: ({ campaign_id }) => {
      return program.methods
        .deleteCampaign(new BN(campaign_id))
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Campaign deleted successfully')
    },
    onError: () => toast.error('Failed to delete campaign'),
  })

  // Campaign queries
  const getCampaigns = useQuery({
    queryKey: ['crowdfunding', 'get-campaigns', { cluster }],
    queryFn: async () => {
      // TODO: Implement campaign fetching logic
      return []
    },
  })


  return {
    accountQuery,
    donate,
    updateCampaign,
    deleteCampaign,
    getCampaigns,
  }
}
