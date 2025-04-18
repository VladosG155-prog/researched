import type { Metadata } from 'next';
import { Martian_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '../components/header';
import { CategoryProvider } from '@/providers/category-provider';
import { Footer } from '@/components/footer';
import 'swiper/css';
export const dynamic = 'force-dynamic';

const martianMono = Martian_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-martian-mono'
});

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${martianMono.variable}`}>
            <body className={'bg-[#121212] h-[100vh] sm:p-[15px] md:p-[15px] lg:p-[20px]'}>
                <CategoryProvider>
                    <div className="flex flex-col h-[100%]">
                        <Header />
                        <div className="flex-1 justify-self-center self-center max-w-[1260px] flex justify-center items-center mx-auto w-full mt-[30px]">
                            {children}
                        </div>

                        <Footer />
                    </div>
                </CategoryProvider>
            </body>
        </html>
    );
}
