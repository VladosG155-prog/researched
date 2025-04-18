'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useCallback, useState } from 'react';
import { Monitor, Smartphone, Chrome } from 'lucide-react';
import { memo } from 'react';
import PromoPopup from '../promo-popup';

interface NetworkIcon {
    name: string;
    fullName: string;
    icon: string;
}

interface WalletTool {
    description: string;
    icon: string;
    url: string;
    networks: NetworkIcon[];
    platforms: string[];
    additionalNetworks?: string;
    fullSupportedNetworks?: string[];
}

interface WalletCardProps {
    name: string;
    wallet: WalletTool;
}

const WalletCard = memo(function WalletCard({ name, wallet }: WalletCardProps) {
    const [isOpenPromoModal, setIsOpenPromoModal] = useState(false);
    const classes = useMemo(
        () => ({
            container: 'bg-[#1a1a1a] border border-[#333333] -xl shadow-md hover:shadow-lg transition-all duration-200 h-[450px]',
            innerContainer: 'p-6 flex flex-col h-full',
            header: 'flex items-center justify-between mb-6',
            titleContainer: 'flex items-center',
            iconContainer: 'w-12 h-12 mr-4 relative',
            icon: 'object-contain',
            title: 'text-2xl font-bold text-white',
            platformsContainer: 'flex space-x-2',
            platformIcon: 'text-neutral-400',
            description: 'text-gray-400 mb-6 flex-grow',
            networksContainer: 'mb-6 flex flex-wrap gap-2',
            networkTag: 'bg-black -full px-3 py-1 flex items-center',
            networkIconContainer: 'w-5 h-5 mr-2 relative',
            networkIcon: 'object-contain max-w-[16px] max-h-[16px]',
            networkName: 'text-sm font-medium',
            additionalNetworksTag: 'bg-black -full px-3 py-1 flex items-center',
            additionalNetworksText: 'text-sm font-medium',
            button: 'mt-auto bg-white text-black py-3  text-center font-medium hover:bg-gray-100 transition-colors cursor-pointer'
        }),
        []
    );

    // Memoize the function to get platform icon
    const getPlatformIcon = useCallback((platform: string) => {
        switch (platform.toLowerCase()) {
            case 'extension':
                return <Chrome className="w-5 h-5" />;
            case 'mobile':
                return <Smartphone className="w-5 h-5" />;
            case 'desktop':
                return <Monitor className="w-5 h-5" />;
            default:
                return null;
        }
    }, []);

    return (
        <motion.div className={classes.container} whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(255, 255, 255, 0.1)' }}>
            <PromoPopup
                info={{
                    promoCode: 'researched',
                    buttonName: 'Промокод',
                    popupText: 'Промокод',
                    link: 'https://backpack.exchange/signup?referral=researched'
                }}
                isOpen={isOpenPromoModal}
                onClose={() => setIsOpenPromoModal(false)}
            />
            <div
                onClick={() => {
                    if (name === 'Backpack') {
                        setIsOpenPromoModal(true);
                    }
                }}
                className={classes.innerContainer}
            >
                <div className={classes.header}>
                    <div className={classes.titleContainer}>
                        <div className={classes.iconContainer}>
                            <Image
                                src={wallet.icon || '/placeholder.svg'}
                                alt={name}
                                width={48}
                                height={48}
                                className={classes.icon}
                                unoptimized
                            />
                        </div>
                        <h3 className={classes.title}>{name}</h3>
                    </div>

                    <div className={classes.platformsContainer}>
                        {wallet.platforms.map((platform) => (
                            <div key={platform} className={classes.platformIcon}>
                                {getPlatformIcon(platform)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={classes.description}>
                    <p>{wallet.description}</p>
                </div>

                <div className={classes.networksContainer}>
                    {wallet.networks.map((network) => (
                        <div key={network.name} className={classes.networkTag}>
                            <div className={classes.networkIconContainer}>
                                <Image
                                    src={network.icon || '/placeholder.svg'}
                                    alt={network.name}
                                    width={20}
                                    height={20}
                                    className={classes.networkIcon}
                                    unoptimized
                                />
                            </div>
                            <span className={classes.networkName}>{network.name}</span>
                        </div>
                    ))}
                    {wallet.additionalNetworks && (
                        <div className={classes.additionalNetworksTag}>
                            <span className={classes.additionalNetworksText}>{wallet.additionalNetworks}</span>
                        </div>
                    )}
                </div>

                {name === 'Backpack' ? (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpenPromoModal(true);
                        }}
                        className={classes.button}
                    >
                        Перейти
                    </button>
                ) : (
                    <a href={wallet.url} target="_blank" rel="noopener noreferrer" className={classes.button}>
                        Перейти
                    </a>
                )}
            </div>
        </motion.div>
    );
});

WalletCard.displayName = 'WalletCard';

export default WalletCard;
