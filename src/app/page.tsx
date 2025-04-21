'use client';

//@ts-nocheck
import React from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
// Update import if it's referencing the old location
import { useRouter, usePathname } from 'next/navigation';
import { GuidePopup } from '@/components/guide-popup';
import { ChevronRight } from 'lucide-react';
import { useCategoryContext } from '@/providers/category-provider';
/* import { GuidePopup } from "./popups/guide-popup" */

interface WelcomeProps {
    onMultiaccountingClick: () => void;
}

export function Welcome({ onMultiaccountingClick }: WelcomeProps) {
    const [clickCount, setClickCount] = useState(0);
    const [showCat, setShowCat] = useState(false);

    const { setIsShowGuideModal, isShowGuideModal } = useCategoryContext();

    // Using useMemo to prevent recreating the array of categories on each render
    const categories = useMemo(
        () => [
            { text: 'антики', color: 'text-purple-500' },
            { text: 'шопы', color: 'text-blue-500' },
            { text: 'CEX', color: 'text-green-500' },
            { text: 'кошельки', color: 'text-yellow-500' },
            { text: 'трейдинг боты', color: 'text-red-500' },
            { text: 'OTC', color: 'text-pink-500' },
            { text: 'прокси', color: 'text-cyan-500' }
        ],
        []
    );

    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    // Refs for timing control
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const catTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Animation constants
    const constants = useMemo(
        () => ({
            typingSpeed: 100,
            deletingSpeed: 33,
            pauseDelay: 1300,
            cursorBlinkInterval: 530
        }),
        []
    );

    // Add event listener for the guide popup
    useEffect(() => {
        const handleOpenGuidePopup = () => {
            setShowGuidePopup(true);
        };

        document.addEventListener('openGuidePopup', handleOpenGuidePopup);

        return () => {
            document.removeEventListener('openGuidePopup', handleOpenGuidePopup);
        };
    }, []);

    // Optimized text animation effect
    useEffect(() => {
        // Clear any existing timer to prevent memory leaks
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const currentCategory = categories[currentCategoryIndex].text;
        const isCompleted = displayText.length === currentCategory.length;
        const isEmpty = displayText.length === 0;

        // Calculate appropriate delay based on animation state
        const delay = isDeleting ? constants.deletingSpeed : isCompleted ? constants.pauseDelay : constants.typingSpeed;

        // Function to handle the next animation step
        const nextAnimationStep = () => {
            if (!isDeleting) {
                // Adding letters
                if (!isCompleted) {
                    setDisplayText(currentCategory.substring(0, displayText.length + 1));
                } else {
                    // Pause when word is complete before starting to delete
                    setIsDeleting(true);
                }
            } else {
                // Removing letters
                if (!isEmpty) {
                    setDisplayText(currentCategory.substring(0, displayText.length - 1));
                } else {
                    // Finished deleting - move to next word
                    setIsDeleting(false);
                    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
                }
            }
        };

        // Set the timer with appropriate delay
        timerRef.current = setTimeout(nextAnimationStep, delay);

        // Cleanup on unmount or when dependencies change
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [displayText, isDeleting, currentCategoryIndex, categories, constants]);

    // Optimized cursor blinking effect with RAF
    useEffect(() => {
        let animationFrameId: number;
        let lastToggleTime = 0;

        const blinkCursor = (timestamp: number) => {
            // Only toggle cursor state at the specified interval
            if (timestamp - lastToggleTime >= constants.cursorBlinkInterval) {
                setShowCursor((prev) => !prev);
                lastToggleTime = timestamp;
            }

            animationFrameId = requestAnimationFrame(blinkCursor);
        };

        animationFrameId = requestAnimationFrame(blinkCursor);

        return () => cancelAnimationFrame(animationFrameId);
    }, [constants.cursorBlinkInterval]);

    // Optimized logo click handler with useCallback
    const handleLogoClick = useCallback(() => {
        setClickCount((prev) => {
            const newCount = prev + 1;

            if (newCount >= 5) {
                // Clear any existing cat timer
                if (catTimerRef.current) {
                    clearTimeout(catTimerRef.current);
                }

                setShowCat(true);
                catTimerRef.current = setTimeout(() => {
                    setShowCat(false);
                    catTimerRef.current = null;
                }, 2000);

                return 0;
            }

            return newCount;
        });
    }, []);

    const iconSourcesRef = useRef<HTMLImageElement[]>([]);

    // Preload icon images for better performance
    useEffect(() => {
        // Pre-define icon sources and preload them
        const sources = [
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/handpie-krMyEJUWwsr5fjT1AB8oPllk03Kil9.webp',
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-heart-cVae3IoBP0nzLUn04gX8FOdY0pFZzn.webp'
        ];

        // Preload images
        sources.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            iconSourcesRef.current[index] = img;
        });

        // Cleanup function
        return () => {
            // Clear any timers
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (catTimerRef.current) {
                clearTimeout(catTimerRef.current);
            }
        };
    }, []);

    return (
        <>
            <GuidePopup isOpen={isShowGuideModal} onClose={setIsShowGuideModal} />
            <div className="main"></div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center overflow-hidden relative z-10"
            >
                {/* Hero section - combined title and button */}
                <motion.div
                    className="flex flex-col items-center mb-[150px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Title */}
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="text-center mb-10">
                        <h1 className="welcome-title  text-[24px] md:text-[48px]" onClick={handleLogoClick}>
                            Лучшие
                            <span className={`${categories[currentCategoryIndex].color} inline-flex ml-2.5 text-[24px] md:text-[48px]`}>
                                {displayText}
                                <span
                                    className={`${
                                        showCursor ? 'opacity-100' : 'opacity-0'
                                    } transition-opacity duration-100 ml-0.5 welcome-cursor`}
                                >
                                    |
                                </span>
                            </span>
                            <br />
                            для мультиаккаунтинга
                        </h1>
                    </motion.div>

                    {/* Button */}
                    <motion.button
                        className="group bg-[#D06E31] text-white font-['Martian_Mono'] font-normal text-[18px]  w-[305px] h-[50px] md:w-[805px] md:h-[86px]  border-none cursor-pointer  transition-transform duration-300"
                        onClick={setIsShowGuideModal}
                    >
                        <div
                            onClick={setIsShowGuideModal}
                            className="flex items-center justify-center relative z-10 cursor-pointer transition-transform duration-300 hover:scale-105"
                        >
                            <span onClick={setIsShowGuideModal} className="hidden md:flex items-center gap-2 text-[20px] ">
                                Бесплатный гайд по заработку через мультиаккаунтинг
                                <ChevronRight />
                            </span>
                            <span onClick={setIsShowGuideModal} className="md:hidden flex text-[14px]">
                                Гайд по мультиаккаунтингу
                                <ChevronRight />
                            </span>
                        </div>
                    </motion.button>
                </motion.div>
            </motion.div>

            {showCat && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                >
                    <img src="https://cataas.com/cat/cute" alt="Cute cat" className="max-w-full max-h-full object-contain" />
                </motion.div>
            )}
            {/*  {showGuidePopup && <GuidePopup onClose={handleGuideClose} />} */}
        </>
    );
}

// Optimize with React.memo
export default React.memo(Welcome);
