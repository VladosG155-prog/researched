'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
import { usePathname } from 'next/navigation';

// Define categories
const mainCategories = [
    { name: 'Прокси', icon: Wifi, displayName: 'Прокси' },
    { name: 'Антики', icon: Shield },
    { name: 'DePIN прокси', icon: Network, href: '/proxy-depin', image: '/grasstobutton.png' },
    { name: 'Комиссии CEX', icon: DollarSign, href: 'https://t.me/researchedxyz' }
];

const mainCategoriesMobile = [
    { name: 'Прокси', icon: Wifi, displayName: 'Прокси' },
    { name: 'Антики', icon: Shield },
    { name: 'DePIN прокси', icon: Network, href: '/proxy-depin', image: '/grasstobutton.png' }
];

const expandedCategories = [
    { name: 'Аккаунт шопы', icon: ShoppingCart },
    { name: 'CEX', icon: TrendingUp },
    { name: 'Трейдинг боты', icon: Robot },
    { name: 'OTC', icon: Briefcase },
    { name: 'Кошельки', icon: Wallet }
];

const expandedCategoriesMobile = [
    { name: 'Аккаунт шопы', icon: ShoppingCart },
    { name: 'CEX', icon: TrendingUp },
    { name: 'Комиссии CEX', icon: DollarSign, href: 'https://t.me/researchedxyz' },
    { name: 'Трейдинг боты', icon: Robot },
    { name: 'OTC', icon: Briefcase },
    { name: 'Кошельки', icon: Wallet }
];

export const Footer = React.memo(function Categories() {
    const { selectedCategory, setSelectedCategory, isExpanded, toggleExpanded } = useCategoryContext();
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    const handleCategoryClick = useCallback(
        (category: string, href?: string) => {
            try {
                if (href) {
                    if (category === 'Комиссии') {
                        window.open(href);
                    } else {
                        window.location.href = href;
                    }
                } else {
                    if (category === 'Прокси') {
                        setSelectedCategory('Прокси Статические');
                    } else {
                        setSelectedCategory(category);
                    }
                }
            } catch (error) {
                console.error('Error selecting category:', error);
            }
        },
        [setSelectedCategory]
    );

    const categories = isMobile ? mainCategoriesMobile : mainCategories;
    const expand = isMobile ? expandedCategoriesMobile : expandedCategories;

    return (
        <div
            className={`w-full z-50 left-0 p-[15px] md:p-[0px] fixed bottom-0 transition-opacity duration-300 bg-[#121212] ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
                willChange: 'transform',
                paddingBottom: '20px',
                paddingTop: '20px',
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'padding-bottom 0.3s ease, padding-right 0.3s ease, opacity 0.3s ease, height 0.3s ease'
            }}
        >
            <div className="max-w-[1260px] mx-auto">
                {isMobile ? (
                    <>
                        {/* Mobile Layout: 3 items in a row + full-width "Другое" button */}
                        <div className="grid grid-cols-3 gap-2 auto-rows-[60px]">
                            {categories.map((category) => (
                                <button
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name, category.href)}
                                    className={`relative cursor-pointer flex flex-col items-center justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white text-[12px] overflow-hidden`}
                                >
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <span className="text-center text-[12px]">{category.name}</span>
                                        <category.icon className="w-5 h-5 mt-1" />
                                    </div>
                                    {category.name === 'DePIN прокси' && category.image && (
                                        <img
                                            src={category.image}
                                            alt="DePin background"
                                            className="absolute bottom-0 left-0 w-full h-[15px] object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="mt-2">
                            <button
                                onClick={toggleExpanded}
                                className="w-full flex flex-col cursor-pointer items-center justify-center px-2 py-4 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white  h-[70px]"
                            >
                                <span className="text-[12px]">{isExpanded ? 'Закрыть' : 'Другое'}</span>
                                {isExpanded ? <X className="w-8 h-8 mt-1" /> : <ChevronRight size={24} className="w-8 h-8 mt-1" />}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-5 gap-4 auto-rows-[88px]">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name, category.href)}
                                className={`relative cursor-pointer flex flex-col items-center justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white text-sm sm:text-md overflow-hidden`}
                            >
                                <div className="flex flex-col items-center justify-center h-full">
                                    <span className="text-center text-[14px]">{category.name}</span>
                                    <category.icon className="w-6 h-6 mt-2" />
                                </div>
                                {category.name === 'DePIN прокси' && category.image && (
                                    <img
                                        src={category.image}
                                        alt="DePin background"
                                        className="absolute bottom-0 left-0 w-full h-[20px] object-cover"
                                    />
                                )}
                            </button>
                        ))}
                        <button
                            onClick={toggleExpanded}
                            className="flex flex-col cursor-pointer items-center justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white text-sm sm:text-md"
                        >
                            <span>{isExpanded ? 'Закрыть' : 'Другое'}</span>
                            {isExpanded ? <X className="w-6 h-6 mt-2" /> : <ChevronRight className="w-6 h-6 mt-2" />}
                        </button>
                    </div>
                )}

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
                                    isMobile ? 'grid-cols-3 gap-2 auto-rows-[60px]' : 'grid-cols-5 gap-4 auto-rows-[88px]'
                                } mt-2`}
                            >
                                {expand.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => handleCategoryClick(category.displayName || category.name, category.href)}
                                        className={`flex flex-col items-center cursor-pointer justify-center px-2 bg-[#2C2C2C] hover:bg-[#444242] transition-colors text-white ${
                                            isMobile ? 'text-[12px]' : 'text-sm sm:text-md'
                                        }`}
                                    >
                                        <span className="text-center">{category.displayName || category.name}</span>
                                        <category.icon className={`${isMobile ? 'w-5 h-5 mt-1' : 'w-6 h-6 mt-2'}`} />
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
