'use client';

import Link from 'next/link';
//@ts-nocheck
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import InstructionModal from '../modal-instruction';
import { useCategoryContext } from '@/providers/category-provider';

interface HeaderProps {
    onInstructionsClick?: () => void;
}

export function Header({}: HeaderProps = {}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const lastAnimationRef = useRef(0);
    const iconSourcesRef = useRef([]);

    const { isShowGuideModal } = useCategoryContext();

    useEffect(() => {
        const sources = [
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/handpie-krMyEJUWwsr5fjT1AB8oPllk03Kil9.webp',
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-heart-cVae3IoBP0nzLUn04gX8FOdY0pFZzn.webp'
        ];
        sources.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            iconSourcesRef.current[index] = img;
        });
    }, []);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const handleIconBurst = useCallback((event) => {
        const now = Date.now();
        if (now - lastAnimationRef.current < 300) return;
        lastAnimationRef.current = now;

        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const iconsCount = 6;
        const fragment = document.createDocumentFragment();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const icons = [];

        for (let i = 0; i < iconsCount; i++) {
            const icon = document.createElement('img');
            const isHeart = Math.random() > 0.5;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            icon.src = isHeart ? iconSourcesRef.current[1].src : iconSourcesRef.current[0].src;
            const size = isHeart ? 16 : 24;
            icon.style.position = 'fixed';
            icon.style.width = `${size}px`;
            icon.style.height = `${size}px`;
            icon.style.left = `${centerX}px`;
            icon.style.top = `${centerY}px`;
            icon.style.transform = 'translate(-50%, -50%)';
            icon.style.pointerEvents = 'none';
            icon.style.zIndex = '1000';
            fragment.appendChild(icon);
            icons.push(icon);
        }

        document.body.appendChild(fragment);
        requestAnimationFrame(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            icons.forEach((icon) => {
                const angle = Math.random() * 360;
                const distance = 30 + Math.random() * 60;
                const duration = 1200 + Math.random() * 400;
                icon.style.transition = `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${duration * 0.6}ms ease-out`;
                setTimeout(() => {
                    icon.style.transform = `translate(calc(-50% + ${Math.cos((angle * Math.PI) / 180) * distance}px), calc(-50% + ${
                        Math.sin((angle * Math.PI) / 180) * distance
                    }px)) rotate(${Math.random() * 180 - 90}deg) scale(0.8)`;
                    icon.style.opacity = '0';
                }, 20);
                setTimeout(() => {
                    if (document.body.contains(icon)) document.body.removeChild(icon);
                }, duration + 100);
            });
        });
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleInstructionsClick = () => {
        toggleModal();
    };

    return (
        <header className="w-full max-w-[1260px] mx-auto flex items-center justify-between h-[70px]">
            <InstructionModal isOpen={isModalOpen && !isShowGuideModal} onClose={toggleModal} />
            <div className="flex items-center h-full">
                {isHomePage ? (
                    <motion.button
                        className="text-lg sm:text-xl font-semibold text-neutral-300 hover:text-white transition-colors h-full"
                        onClick={handleIconBurst}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        researched.xyz
                    </motion.button>
                ) : (
                    <Link href="/" className="h-full flex items-center">
                        <motion.span
                            className="text-lg sm:text-xl font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            researched.xyz
                        </motion.span>
                    </Link>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center h-full gap-4">
                {/*   <a href="/blog" className="h-full flex items-center px-4 text-[#444242] hover:text-white transition-colors text-[18px]">
                    Блог
                </a> */}
                <button
                    onClick={handleInstructionsClick}
                    className="h-[70px] px-6 flex items-center justify-center bg-[#D9D7D5] text-black hover:bg-[#C9C7C5] transition-colors text-[18px] cursor-pointer"
                >
                    Зачем мы тебе?
                </button>
                <a
                    href="https://t.me/researchedxyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[70px] px-6 flex items-center justify-center bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors text-white text-[18px]"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.6281 14.1601L15.4742 9.31397M20.4316 6.35645L16.341 19.651C15.9744 20.8425 15.7909 21.4385 15.4748 21.636C15.2005 21.8074 14.8609 21.836 14.5623 21.7121C14.2178 21.5692 13.9383 21.0111 13.3807 19.8958L10.7897 14.7139C10.7012 14.5369 10.6569 14.4488 10.5978 14.3721C10.5453 14.304 10.4848 14.2427 10.4168 14.1903C10.3418 14.1325 10.2552 14.0892 10.0861 14.0046L4.89224 11.4077C3.77693 10.8501 3.21923 10.571 3.07632 10.2266C2.95238 9.92787 2.98064 9.588 3.152 9.31375C3.34959 8.99751 3.94555 8.8138 5.13735 8.44709L18.4319 4.35645C19.3689 4.06815 19.8376 3.92412 20.154 4.0403C20.4297 4.1415 20.647 4.35861 20.7482 4.63428C20.8644 4.9506 20.7202 5.41904 20.4322 6.35506L20.4316 6.35645Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center  w-10 h-10 gap-2">
                <button onClick={toggleMenu} className="text-white w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                        />
                    </svg>
                </button>
            </div>

            {/* Burger Menu */}
            {isMenuOpen && (
                <motion.div className="md:hidden top-0 absolute  left-0 right-0 bg-[#1A1A1A] shadow-lg z-50">
                    <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex flex-col items-start p-4 gap-2">
                        {/* <a href="/blog" className="w-full py-2 px-4 text-[#444242] hover:text-white transition-colors text-[18px]">
                            Блог
                        </a> */}
                        <button
                            onClick={handleInstructionsClick}
                            className="py-2 px-4 w-[95%] text-left bg-[#D9D7D5] text-black hover:bg-[#C9C7C5] transition-colors text-[18px] cursor-pointer"
                        >
                            Зачем мы тебе?
                        </button>
                        <a
                            href="https://t.me/researchedxyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-[50px] w-[95%] mr-5 px-4 flex items-center justify-center gap-3 bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors text-white text-sm "
                        >
                            <svg className="mr-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.6281 14.1601L15.4742 9.31397M20.4316 6.35645L16.341 19.651C15.9744 20.8425 15.7909 21.4385 15.4748 21.636C15.2005 21.8074 14.8609 21.836 14.5623 21.7121C14.2178 21.5692 13.9383 21.0111 13.3807 19.8958L10.7897 14.7139C10.7012 14.5369 10.6569 14.4488 10.5978 14.3721C10.5453 14.304 10.4848 14.2427 10.4168 14.1903C10.3418 14.1325 10.2552 14.0892 10.0861 14.0046L4.89224 11.4077C3.77693 10.8501 3.21923 10.571 3.07632 10.2266C2.95238 9.92787 2.98064 9.588 3.152 9.31375C3.34959 8.99751 3.94555 8.8138 5.13735 8.44709L18.4319 4.35645C19.3689 4.06815 19.8376 3.92412 20.154 4.0403C20.4297 4.1415 20.647 4.35861 20.7482 4.63428C20.8644 4.9506 20.7202 5.41904 20.4322 6.35506L20.4316 6.35645Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
