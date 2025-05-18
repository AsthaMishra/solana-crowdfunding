import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor'


interface Campaign {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    goalAmount: number;
    currentAmount: number;
    authority: string;
}

interface CampaignManagementProps {
    campaign: Campaign;
    onSuccess?: () => void;
}

export const CampaignManagement = ({ campaign, onSuccess }: CampaignManagementProps) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        title: campaign.title,
        description: campaign.description,
        imageUrl: campaign.imageUrl,
        goalAmount: campaign.goalAmount,
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) return;

        try {
            setLoading(true);
            const goalAmount = new BN(parseFloat(formData.goalAmount) * 1e9);

            // TODO: Implement update logic using your program
            // This is a placeholder for the actual implementation
            console.log('Updating campaign', campaign.id, 'with new data:', formData);

            setShowEditForm(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error updating campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!publicKey) return;

        try {
            setLoading(true);
            // TODO: Implement delete logic using your program
            // This is a placeholder for the actual implementation
            console.log('Deleting campaign', campaign.id);

            onSuccess?.();
        } catch (error) {
            console.error('Error deleting campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey || publicKey.toString() !== campaign.authority) {
        return null;
    }

    return (
        <div className="mt-4 space-y-4">
            {!showEditForm ? (
                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowEditForm(true)}
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Edit Campaign
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Delete Campaign'}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Goal Amount (SOL)</label>
                        <input
                            type="number"
                            value={formData.goalAmount}
                            onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            step="0.1"
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Campaign'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEditForm(false)}
                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}; 