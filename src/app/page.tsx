//'use client'; // Убрали директиву

import React from 'react'; // Оставили React
import type { Metadata } from 'next';
import { Welcome } from '@/components/welcome-client'; // Импортируем новый компонент

// Экспортируем метаданные
export const metadata = {
    title: 'Купить расходники для мультиаккаунтинга и крипты дёшево | researched.xyz',
    description:
        'researched.xyz — агрегатор сервисов для мультиаккаунтинга. Антидетекты, прокси, боты, кошельки, CEX, OTC и т.д. Всё купили, проверили и отсортировали.',
    openGraph: {
        title: 'Купить расходники для мультиаккаунтинга и крипты дёшево | researched.xyz',
        description: 'researched.xyz — агрегатор сервисов для мультиаккаунтинга...',
        url: 'https://researched.xyz/',
        siteName: 'researched.xyz',
        images: [
            {
                url: '/og/og-preview.jpg',
                width: 1200,
                height: 630,
                alt: 'OG image for /'
            }
        ],
        locale: 'ru_RU',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Купить расходники для мультиаккаунтинга и крипты дёшево | researched.xyz',
        description: 'researched.xyz — агрегатор сервисов для мультиаккаунтинга...',
        images: ['/og/og-preview.jpg'],
        creator: '@researchedxyz'
    },
    alternates: {
        canonical: 'https://researched.xyz/'
    }
};

// Основной компонент страницы (серверный)
export default function HomePage() {
    // Возвращаем клиентский компонент
    // Проп onMultiaccountingClick больше не нужен
    return <Welcome />;
}

// Удалили весь код компонента Welcome, который был перенесен
