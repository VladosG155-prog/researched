'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '@/hooks/useIsMobile';
import { MobileProxyFilters } from '@/components/mobile-proxy-filter';
import { usePathname, useRouter } from 'next/navigation';

interface CategoryLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}
export const dynamic = 'force-dynamic';
const variants = {
    hidden: { opacity: 0, x: -20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
};
const PROXY_FILTERS = [
    { name: 'Статические', link: 'proxy-static' },
    { name: 'Резидентские', link: 'proxy-residential' },
    { name: 'Мобильные', link: 'proxy-mobile' },
    { name: 'Для DePIN', link: 'proxy-depin' }
];

function CategoriesLayout({ children, title, description }: CategoryLayoutProps) {
    const isMobile = useIsMobile();
    const router = useRouter();
    const pathname = usePathname();
    const handleClickFilter = (link: string) => {
        router.push(link);
    };

    return (
        <motion.div
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            className="flex  min-w-full flex-col bg-[#121212] bg-opacity-40 text-white relative z-10 pt-[30px] pb-[250px] "
        >
            <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
                {isMobile && pathname.includes('proxy') && (
                    <MobileProxyFilters filters={PROXY_FILTERS} pathname={pathname} handleClickFilter={handleClickFilter} />
                )}
                <div className="w-full max-w-[1260px] mx-auto pb-16">
                    <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start">
                        <h1 className="font-['Martian_Mono'] font-normal text-[32px] sm:text-[44px] mb-2">{title}</h1>
                        <p className="font-['Martian_Mono'] font-normal text-[16px] leading-[160%] text-neutral-400 max-w-md min-w-[50%]">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}
export default CategoriesLayout;
