'use client'

import { useBasicProgram } from './basic-data-access'
import { CreateCampaign } from './CreateCampaign'
import { CampaignList } from './CampaignList'
import { useState } from 'react'

export function BasicCreate() {
  const { greet } = useBasicProgram()

  return (
    <div className="space-y-4">
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => greet.mutateAsync()}
        disabled={greet.isPending}
      >
        Run program{greet.isPending && '...'}
      </button>

      <div className="divider">OR</div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Create Campaign</h2>
        <CreateCampaign />
      </div>
    </div>
  )
}

export function BasicProgram() {
  const { getProgramAccount } = useBasicProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Program Account Data</h3>
        <pre className="text-sm">{JSON.stringify(getProgramAccount.data.value, null, 2)}</pre>
      </div>

      <div className="divider">Campaigns</div>

      <CampaignList />
    </div>
  )
}
