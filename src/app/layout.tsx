import { Metadata } from 'next';
import { Martian_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { Header } from '../components/header';
import { CategoryProvider } from '@/providers/category-provider';
import { Footer } from '@/components/footer';
import 'swiper/css';

import ClientRedirect from '@/components/client-redirect';
import TwinklingStarsGrid from '@/components/starlight-bg';

export const dynamic = 'force-dynamic';

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

const martianMono = Martian_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-martian-mono'
});
const pressStart = Press_Start_2P({
    subsets: ['cyrillic'],
    display: 'swap',
    weight: '400',
    variable: '--font-martian-pressStart'
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={`${martianMono.variable} ${pressStart.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="preload" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&subset=cyrillic" as="style" />
                <script defer src="https://metric.researched.xyz/script.js" data-website-id="a9b97fed-3e50-4ffa-bcff-3e1efc93b33f" />
            </head>
            <body className={'bg-[#121212] h-[100vh] sm:p-[15px] md:p-[15px] lg:p-[20px]'}>
                <TwinklingStarsGrid />
                <CategoryProvider>
                    <div className="flex flex-col h-[100%]">
                        <Header />
                        <div className="flex-1 justify-self-center self-center max-w-[1260px] flex justify-center items-center mx-auto w-full mt-[20px] md:mt-[30px]">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </CategoryProvider>
            </body>
        </html>
    );
}
