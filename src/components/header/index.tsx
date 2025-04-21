'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import InstructionModal from '../modal-instruction';
import { useCategoryContext } from '@/providers/category-provider';

interface HeaderProps {
    onInstructionsClick?: () => void;
}

export function Header({}: HeaderProps = {}) {
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
            iconSourcesRef.current[index] = img;
        });
    }, []);

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
        const icons = [];

        for (let i = 0; i < iconsCount; i++) {
            const icon = document.createElement('img');
            const isHeart = Math.random() > 0.5;
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

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleInstructionsClick = () => {
        toggleModal();
    };

    return (
        <header className="w-full max-w-[1260px] mx-auto flex items-center z-[70] justify-between h-[70px] px-4">
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
            <div className="flex md:hidden items-center h-full gap-2">
                <button
                    onClick={handleInstructionsClick}
                    className="h-[40px] w-[40px] flex items-center justify-center bg-[#D9D7D5] text-black hover:bg-[#C9C7C5] transition-colors"
                    title="Зачем мы тебе?"
                >
                    ?
                </button>
                <a
                    href="https://t.me/researchedxyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[40px] w-[40px] flex items-center justify-center bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors"
                    title="Telegram"
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
        </header>
    );
}
