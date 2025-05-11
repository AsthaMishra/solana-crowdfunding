import { useWallet } from '@solana/wallet-adapter-react';
import { useCrowdfundingProgram } from './crowdfunding-data-access';
import { CampaignCard, Campaign } from './CampaignCard';

export const CampaignList = () => {
    const { publicKey } = useWallet();
    const { accounts, getProgramAccount } = useCrowdfundingProgram()

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
        <div className={'space-y-6'}>
            {accounts.isLoading ? (
                <span className="loading loading-spinner loading-lg"></span>
            ) : accounts.data?.length ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {accounts.data?.map((account) => (
                        // <CrudCard key={account.publicKey.toString()} account={account.publicKey} />

                        <CampaignCard campaign={account as unknown as Campaign} />
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <h2 className={'text-2xl'}>No accounts</h2>
                    No accounts found. Create one above to get started.
                </div>
            )}
        </div>
    )
}; 