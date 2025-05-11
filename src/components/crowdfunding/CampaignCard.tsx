import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCrowdfundingProgram } from './crowdfunding-data-access';
import { DonateForm } from './DonateForm';
import { CampaignManagement } from './CampaignManagement';

export interface Campaign {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    goalAmount: number;
    currentAmount: number;
    authority: string;
}

interface CampaignCardProps {
    campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
    const { publicKey } = useWallet();
    const [showDonateForm, setShowDonateForm] = useState(false);
    const progress = (campaign.currentAmount / campaign.goalAmount) * 100;

    return (
        <div className="card bg-base-100 shadow-xl">
            <figure>
                <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{campaign.title}</h2>
                <p className="line-clamp-2">{campaign.description}</p>

                <div className="w-full">
                    <div className="flex justify-between text-sm opacity-70 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <progress
                        className="progress progress-primary w-full"
                        value={progress}
                        max="100"
                    ></progress>
                </div>

                <div className="flex justify-between text-sm opacity-70">
                    <span>Raised: {campaign.currentAmount} SOL</span>
                    <span>Goal: {campaign.goalAmount} SOL</span>
                </div>

                {publicKey && (
                    <div className="card-actions justify-end mt-4">
                        <button
                            onClick={() => setShowDonateForm(!showDonateForm)}
                            className="btn btn-primary"
                        >
                            {showDonateForm ? 'Cancel' : 'Donate'}
                        </button>
                    </div>
                )}

                {showDonateForm && publicKey && (
                    <div className="mt-4">
                        <DonateForm campaignId={campaign.id} />
                    </div>
                )}

                <CampaignManagement campaign={campaign} />
            </div>
        </div>
    );
}; 