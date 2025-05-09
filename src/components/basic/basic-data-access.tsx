'use client'

import { BASIC_PROGRAM_ID as programId, getBasicProgram } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BN } from '@coral-xyz/anchor'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useBasicProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const program = getBasicProgram(provider)

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const greet = useMutation({
    mutationKey: ['basic', 'greet', { cluster }],
    mutationFn: () => program.methods.greet().rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })

  // Campaign mutations
  const createCampaign = useMutation({
    mutationKey: ['basic', 'create-campaign', { cluster }],
    mutationFn: ({ title, description, imageUrl, goalAmount }: {
      title: string
      description: string
      imageUrl: string
      goalAmount: number
    }) => program.methods
      .createCampaign(title, description, imageUrl, new BN(goalAmount * 1e9))
      .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Campaign created successfully')
    },
    onError: () => toast.error('Failed to create campaign'),
  })

  const donate = useMutation({
    mutationKey: ['basic', 'donate', { cluster }],
    mutationFn: ({ campaignId, amount }: { campaignId: number, amount: number }) =>
      program.methods
        .donate(campaignId, new BN(amount * 1e9))
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Donation successful')
    },
    onError: () => toast.error('Failed to donate'),
  })

  const updateCampaign = useMutation({
    mutationKey: ['basic', 'update-campaign', { cluster }],
    mutationFn: ({ campaignId, title, description, imageUrl, goalAmount }: {
      campaignId: number
      title: string
      description: string
      imageUrl: string
      goalAmount: number
    }) => program.methods
      .updateCampaign(campaignId, title, description, imageUrl, new BN(goalAmount * 1e9))
      .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Campaign updated successfully')
    },
    onError: () => toast.error('Failed to update campaign'),
  })

  const deleteCampaign = useMutation({
    mutationKey: ['basic', 'delete-campaign', { cluster }],
    mutationFn: (campaignId: number) =>
      program.methods
        .deleteCampaign(campaignId)
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Campaign deleted successfully')
    },
    onError: () => toast.error('Failed to delete campaign'),
  })

  // Campaign queries
  const getCampaigns = useQuery({
    queryKey: ['basic', 'get-campaigns', { cluster }],
    queryFn: async () => {
      // TODO: Implement campaign fetching logic
      return []
    },
  })

  return {
    program,
    programId,
    getProgramAccount,
    greet,
    // Campaign methods
    createCampaign,
    donate,
    updateCampaign,
    deleteCampaign,
    getCampaigns,
  }
}
