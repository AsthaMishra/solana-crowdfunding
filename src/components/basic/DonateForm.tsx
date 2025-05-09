import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBasicProgram } from './basic-data-access';

interface DonateFormProps {
    campaignId: number;
    onSuccess?: () => void;
}

export const DonateForm = ({ campaignId, onSuccess }: DonateFormProps) => {
    const { publicKey } = useWallet();
    const { donate } = useBasicProgram();
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) return;

        try {
            await donate.mutateAsync({
                campaignId,
                amount: parseFloat(amount),
            });

            setAmount('');
            onSuccess?.();
        } catch (error) {
            console.error('Error donating:', error);
        }
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