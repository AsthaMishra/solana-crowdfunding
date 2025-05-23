import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCrowdfundingProgram } from './crowdfunding-data-access';

interface CreateCampaignProps {
    onSuccess?: () => void;
}

export const CreateCampaign = ({ onSuccess }: CreateCampaignProps) => {
    const { publicKey } = useWallet();
    const { createCampaign, accounts } = useCrowdfundingProgram();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        goalAmount: '',
    });
    const [message, setMessage] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) return;

        createCampaign.mutateAsync({
            campaign_title: formData.title,
            campaign_description: formData.description,
            campaign_image_url: formData.imageUrl,
            campaign_goal_amount: parseFloat(formData.goalAmount),
            campaign_id: 0, // This should be set to the next available ID
        }, {
            onSuccess: () => {
                accounts.refetch();
                setMessage(message);
            },
        }
        );

        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            goalAmount: '',
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-base-300 shadow-sm focus:border-primary focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-base-300 shadow-sm focus:border-primary focus:ring-primary"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Image URL</label>
                    <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="mt-1 block w-full rounded-md border-base-300 shadow-sm focus:border-primary focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Goal Amount (SOL)</label>
                    <input
                        type="number"
                        value={formData.goalAmount}
                        onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                        className="mt-1 block w-full rounded-md border-base-300 shadow-sm focus:border-primary focus:ring-primary"
                        step="0.1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={createCampaign.isPending || !publicKey}
                    className="btn btn-primary w-full"
                >
                    {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
                </button>
            </form>
        </div>
    );
}; 