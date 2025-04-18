'use client';
import { useState } from 'react';
import WalletCard from '@/components/wallet-card';
import { Filter } from '@/components/filter'; // Assuming the Filter component is here
import walletsData from '../../../data/wallet.json';

function Page() {
    const [selectedNetwork, setSelectedNetwork] = useState('');

    // Extract all networks from wallet.json
    const networks = walletsData.Data.wallets.info.allNetworks.map((network) => ({
        name: network,
        icon: '' // Icons not provided in allNetworks, can be added if available
    }));

    // Add "All Networks" option at the start
    const filterNetworks = [...networks];

    // Get wallet entries
    const wallets = Object.entries(walletsData.Data.wallets.tools);

    // Filter and sort wallets
    const filteredWallets = wallets
        .filter(([_, walletData]) => {
            // Check both networks and fullSupportedNetworks for compatibility
            return (
                walletData.networks?.some((net) => net.fullName === selectedNetwork) ||
                walletData.fullSupportedNetworks?.includes(selectedNetwork)
            );
        })
        .sort(([walletNameA], [walletNameB]) => {
            // Trust Wallet always at the end
            if (walletNameA === 'Trust Wallet') return 1;
            if (walletNameB === 'Trust Wallet') return -1;

            // Backpack at the top for Solana
            if (selectedNetwork === 'Solana') {
                if (walletNameA === 'Backpack') return -1;
                if (walletNameB === 'Backpack') return 1;
            }

            return 0; // Maintain original order for others
        });

    const finalData = selectedNetwork ? filteredWallets : wallets;
    return (
        <div className="container mx-auto px-4 py-8 pb-[250px]">
            {/* Network Filter */}
            <div className="mb-6">
                <Filter
                    name="Сеть"
                    selectedValue={selectedNetwork}
                    onChange={setSelectedNetwork}
                    filters={filterNetworks}
                    showSearch={true}
                />
            </div>

            {/* Wallet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {finalData.map(([walletName, walletData]) => (
                    <WalletCard key={walletName} name={walletName} wallet={walletData} />
                ))}
            </div>
        </div>
    );
}

export default Page;
