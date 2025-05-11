import { useWallet } from '@solana/wallet-adapter-react';
import { useBasicProgram } from './crowdfunding-data-access';
import { CampaignCard } from './CampaignCard';

export const CampaignList = () => {
    const { publicKey } = useWallet();
    const { getCampaigns } = useBasicProgram();

    if (getCampaigns.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!getCampaigns.data || getCampaigns.data.length === 0) {
        return (
            <div className="text-center text-base-content/70 py-8">
                No campaigns found. Be the first to create one!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCampaigns.data.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
        </div>
    );
}; 