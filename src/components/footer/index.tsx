'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronRight,
    Shield,
    ShoppingCart,
    TrendingUp,
    Wallet,
    BotIcon as Robot,
    Briefcase,
    Wifi,
    Network,
    DollarSign
} from 'lucide-react';
import { useCategoryContext } from '@/providers/category-provider';
import { usePathname, useRouter } from 'next/navigation';

// Define categories
const mainCategories = [
    { name: 'Прокси', icon: Wifi, href: '/proxy-static', displayName: 'Прокси' },
    { name: 'Антики', icon: Shield, href: '/antiki' },
    { name: 'DePIN прокси', icon: Network, href: '/proxy-depin', image: '/grasstobutton.png' },
    { name: 'Комиссии CEX', icon: DollarSign, href: 'https://t.me/researchedxyz' },
    { name: 'Кошельки', icon: Wallet, href: '/wallets' }
];

const expandedCategories = [
    { name: 'Аккаунт шопы', icon: ShoppingCart, href: '/shops' },
    { name: 'CEX', icon: TrendingUp, href: '/cex' },
    { name: 'Трейдинг боты', icon: Robot, href: '/tradingbots' },
    { name: 'OTC', icon: Briefcase, href: '/otc' },
    { name: 'Кошельки', icon: Wallet, href: '/wallets' }
];

export const Footer = React.memo(function Categories() {
    const { isExpanded, toggleExpanded } = useCategoryContext();
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (pathname === '/wait') {
        return null;
    }

    const handleCategoryClick = (category, href) => {
        console.log('href', href);
        if (category === 'Комиссии CEX') {
            window.open(href);
        } else {
            router.push(href);
        }
    };

    return (
        <div
            className={`w-full z-50 left-0 p-[5px] md:p-[0px] fixed bottom-0 transition-opacity duration-300 bg-[#121212] ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
                willChange: 'transform',
                paddingBottom: '15px',
                paddingTop: '15px',
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'padding-bottom 0.3s ease, padding-right 0.3s ease, opacity 0.3s ease, height 0.3s ease'
            }}
        >
            <div className="max-w-[1260px] mx-auto">
                {/* Main Categories */}
                <div className={`grid ${isMobile ? 'grid-cols-5 gap-2 auto-rows-[60px]' : 'grid-cols-5 gap-4 auto-rows-[88px]'}`}>
                    {mainCategories.slice(0, 4).map((category) => (
                        <button
                            key={category.name}
                            onClick={() => handleCategoryClick(category.name, category.href)}
                            className={`relative cursor-pointer flex flex-col items-center justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white overflow-hidden ${
                                isMobile ? 'text-[10px]' : 'text-sm sm:text-md'
                            }`}
                        >
                            <div className="flex flex-col items-center justify-center h-full">
                                <span className="text-center">{category.name}</span>
                                <category.icon className={`${isMobile ? 'w-3 h-3 mt-1' : 'w-6 h-6 mt-2'}`} />
                            </div>
                            {category.name === 'DePIN прокси' && category.image && (
                                <img
                                    src={category.image}
                                    alt="DePin background"
                                    className={`absolute bottom-0 left-0 w-full object-cover ${isMobile ? 'h-[12px]' : 'h-[20px]'}`}
                                />
                            )}
                        </button>
                    ))}
                    <button
                        onClick={toggleExpanded}
                        className={`flex flex-col cursor-pointer items-center justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white ${
                            isMobile ? 'text-[10px]' : 'text-sm sm:text-md'
                        }`}
                    >
                        <span>{isExpanded ? 'Закрыть' : 'Другое'}</span>
                        {isExpanded ? (
                            <X className={`${isMobile ? 'w-4 h-4 mt-1' : 'w-6 h-6 mt-2'}`} />
                        ) : (
                            <ChevronRight className={`${isMobile ? 'w-4 h-4 mt-1' : 'w-6 h-6 mt-2'}`} />
                        )}
                    </button>
                </div>

                {/* Expanded Categories */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="col-span-full"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeInOut'
                            }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div
                                className={`grid ${
                                    isMobile ? 'grid-cols-5 gap-2 auto-rows-[60px]' : 'grid-cols-5 gap-4 auto-rows-[88px]'
                                } mt-2`}
                            >
                                {expandedCategories.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => handleCategoryClick(category.displayName || category.name, category.href)}
                                        className={`flex flex-col items-center cursor-pointer justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white ${
                                            isMobile ? 'text-[10px]' : 'text-sm sm:text-md'
                                        }`}
                                    >
                                        <span className="text-center">{category.displayName || category.name}</span>
                                        <category.icon className={`${isMobile ? 'w-3 h-3 mt-1' : 'w-6 h-6 mt-2'}`} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
});
