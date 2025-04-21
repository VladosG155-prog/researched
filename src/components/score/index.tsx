'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Score({ totalScore, data }: { totalScore: number; data: { [key: string]: any } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen && !isMobile) {
            const triggerRect = buttonRef.current?.getBoundingClientRect();
            const dropdown = dropdownRef.current;

            if (triggerRect && dropdown) {
                const dropdownHeight = dropdown.offsetHeight;
                const spaceAbove = triggerRect.top;
                const spaceBelow = window.innerHeight - triggerRect.bottom - 40;

                if (spaceAbove >= dropdownHeight) {
                    setDropdownPosition('top');
                } else if (spaceBelow >= dropdownHeight) {
                    setDropdownPosition('bottom');
                } else {
                    // Выбираем большее из двух
                    setDropdownPosition(spaceAbove > spaceBelow ? 'top' : 'bottom');
                }
            }
        }
    }, [isOpen, isMobile]);

    const handleMouseEnter = () => {
        if (!isMobile) {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            closeTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 100);
        }
    };

    if (!totalScore || totalScore === '-' || !data?.name) {
        return (
            <div className="w-[96px] text-white bg-[#D06E31] flex h-[40px] justify-center items-center">
                <span>-</span>
                <span className="text-[#D2AE98]">/90</span>
            </div>
        );
    }

    const dataStats = Object.entries(data)
        .filter(([key]) => key !== 'name' && key !== 'overall')
        .map(([key, info]) => ({
            label: key,
            value: info.score
        }));

    const link = pathname.includes('proxy') ? '/rs-score-proxy' : '/rs-score-antidetect';

    return (
        <div className="relative inline-block">
            <div
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                    e.stopPropagation();
                    isMobile && setIsOpen(!isOpen);
                }}
                className="w-[60px] md:w-[96px] text-white bg-[#D06E31] flex h-[40px] justify-center items-center cursor-pointer"
            >
                <span className="text-[14px] md:text-[16px]">{totalScore}</span>
                <span className="text-[#D2AE98] text-[14px] md:text-[16px]">/90</span>
            </div>

            {isOpen && (
                <div
                    className={`${
                        isMobile
                            ? 'fixed top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 flex items-center justify-center z-120 w-[300px]'
                            : `absolute left-0 z-120 ${dropdownPosition === 'top' ? 'bottom-[48px]' : 'top-[48px]'}`
                    }`}
                >
                    <div
                        ref={dropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="text-white w-max bg-[#282828] rounded shadow-lg"
                    >
                        <div className="p-5 flex items-center justify-between border-b border-[#444]">
                            <h3 className="text-[18px]">Общая оценка</h3>
                            <p className="text-[18px] text-green-500 ml-5">{data.overall}</p>
                        </div>

                        <ul className="bg-[#444242] p-5">
                            {dataStats.map((stat, index) => (
                                <li key={index} className="flex justify-between py-1">
                                    <span className="text-[#949292]">{stat.label}</span>
                                    <span className="text-white">{stat.value}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#949292] hover:text-white transition-colors bg-[#282828] p-5 w-full block"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Что такое Researched Score?
                        </a>

                        {isMobile && (
                            <button
                                className="w-full py-2 bg-[#282828] text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                            >
                                Закрыть
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
