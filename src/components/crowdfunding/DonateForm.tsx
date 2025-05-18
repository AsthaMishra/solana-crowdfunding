import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCrowdfundingProgram, useCrowdfundingProgramAccount } from './crowdfunding-data-access';
import * as anchor from "@coral-xyz/anchor";


interface DonateFormProps {
    campaignId: number;
    onSuccess?: () => void;
}

export const DonateForm = ({ campaignId, onSuccess }: DonateFormProps, { account }: { account: anchor.web3.PublicKey }) => {
    const { publicKey } = useWallet();
    const { donate, accountQuery } = useCrowdfundingProgramAccount({ account });
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) return;

        donate.mutateAsync({
            campaign_id: campaignId, campaign_goal_amount: parseInt(amount),
            campaign_title: '',
            campaign_description: '',
            campaign_image_url: ''
        }, {
            onSuccess: () => {
                accountQuery.refetch();
                setMessage(message);
            },
        }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">
                    Donation Amount (SOL)
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input input-bordered w-full"
                    step="0.1"
                    min="0.1"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={donate.isPending || !publicKey}
                className="btn btn-primary w-full"
            >
                {donate.isPending ? 'Processing...' : 'Donate'}
            </button>
        </form>
    );
}; 