'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type CategoryContextType = {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    hasVisitedCategory: boolean;
    setHasVisitedCategory: (visited: boolean) => void;
    isInitialized: boolean;
    isExpanded: boolean;
    setIsShowGuideModal: () => void;
    isShowGuideModal: boolean;
    toggleExpanded: () => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function useCategoryContext() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
}

interface CategoryProviderProps {
    children: React.ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [hasVisitedCategory, setHasVisitedCategory] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [isShowGuideModal, setIsShowGuideModal] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const toggleGuideModal = () => {
        setIsShowGuideModal((prev) => !prev);
    };

    // Мемоизация функций изменения состояния
    const handleSetSelectedCategory = useCallback((category: string | null) => {
        setSelectedCategory(category);
    }, []);

    const handleSetHasVisitedCategory = useCallback((visited: boolean) => {
        setHasVisitedCategory(visited);
    }, []);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    // Обработка изменения пути
    useEffect(() => {
        if (pathname === '/wallets') {
            setSelectedCategory('Кошельки');
            setIsInitialized(true);
            return;
        }

        if (pathname === '/') {
            setSelectedCategory(null);
            setIsInitialized(true);
            return;
        }

        const path = pathname.slice(1); // Remove the leading slash

        // Map path to category
        const categoryMap: Record<string, string> = {
            antiki: 'Антики',
            shops: 'Аккаунт шопы',
            cex: 'CEX',
            wallets: 'Кошельки',
            tradingbots: 'Трейдинг боты',
            otc: 'OTC',
            multiaccounting: 'multiaccounting',
            'proxy-static': 'Прокси Статические',
            'proxy-residential': 'Прокси Резидентские',
            'proxy-mobile': 'Прокси Мобильные',
            'proxy-depin': 'Прокси для DePin',
            article: 'article',
            wait: 'wait'
        };

        if (categoryMap[path]) {
            setSelectedCategory(categoryMap[path]);
        }

        // Mark initialization as complete
        setIsInitialized(true);
    }, [pathname]);

    // Обновление URL при изменении выбранной категории
    useEffect(() => {
        if (selectedCategory === null) {
            router.push('/');
            return;
        } else if (selectedCategory === 'Кошельки') {
            // Use replace instead of push for wallets to avoid adding to history stack
            router.push('/wallets', { scroll: true });
            setHasVisitedCategory(true);
            return;
        }

        // Map category to path
        const pathMap: Record<string, string> = {
            Антики: 'antiki',
            'Аккаунт шопы': 'shops',
            CEX: 'cex',
            Кошельки: 'wallets',
            'Трейдинг боты': 'tradingbots',
            OTC: 'otc',
            article: 'article',
            'Прокси Статические': 'proxy-static',
            'Прокси Резидентские': 'proxy-residential',
            'Прокси Мобильные': 'proxy-mobile',
            'Прокси для DePin': 'proxy-depin',
            multiaccounting: 'multiaccounting',
             wait: 'wait'
        };

        if (pathMap[selectedCategory]) {
            router.push(`/${pathMap[selectedCategory]}`, { scroll: true });
            setIsExpanded(false);
            setHasVisitedCategory(true);
        }
    }, [selectedCategory, router, pathname, isInitialized]);

    // Мемоизация значения контекста
    const contextValue = useMemo(
        () => ({
            selectedCategory,
            setSelectedCategory: handleSetSelectedCategory,
            hasVisitedCategory,
            setHasVisitedCategory: handleSetHasVisitedCategory,
            isInitialized,
            isExpanded,
            toggleExpanded,
            isShowGuideModal,
            setIsShowGuideModal: toggleGuideModal
        }),
        [
            selectedCategory,
            handleSetSelectedCategory,
            hasVisitedCategory,
            handleSetHasVisitedCategory,
            isInitialized,
            isExpanded,
            toggleExpanded,
            toggleGuideModal,
            isShowGuideModal
        ]
    );

    return <CategoryContext.Provider value={contextValue}>{children}</CategoryContext.Provider>;
}
