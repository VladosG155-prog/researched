'use client';
import { Metadata } from 'next';
import { Martian_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { Header } from '../components/header';
import { CategoryProvider } from '@/providers/category-provider';
import { Footer } from '@/components/footer';
import 'swiper/css';

import ClientRedirect from '@/components/client-redirect';

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
        <html lang="en" className={`${martianMono.variable} ${pressStart.variable}`}>
            <head>
                <link rel="preload" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&subset=cyrillic" as="style" />
            </head>
            <body className={'bg-[#121212] h-[100vh] sm:p-[15px] md:p-[15px] lg:p-[20px]'}>
                <ClientRedirect>
                    <CategoryProvider>
                        <div className="flex flex-col h-[100%]">
                            {/*  <Header /> */}
                            <div className="flex-1 justify-self-center self-center max-w-[1260px] flex justify-center items-center mx-auto w-full mt-[30px]">
                                {children}
                            </div>
                            {/* <Footer /> */}
                        </div>
                    </CategoryProvider>
                </ClientRedirect>
            </body>
        </html>
    );
}
