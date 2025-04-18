'use client';

import { useState, useEffect, useRef } from 'react';

export default function Score({ totalScore, data }: { totalScore: number; data: { [key in string]: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
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
            }, 50); // Small delay to allow clicking
        }
    };

    if (!totalScore || totalScore === '-' || !data?.name)
        return (
            <div className="w-[96px] text-white bg-[#D06E31] flex h-[40px] justify-center items-center">
                <span>-</span>
                <span className="text-[#D2AE98]">/90</span>
            </div>
        );

    const dataStats = Object.entries(data)
        .filter((d) => d[0] !== 'name' && d[0] !== 'overall')
        .map(([key, info]) => {
            return {
                label: key,
                value: info.score
            };
        });

    const finalData = dataStats;

    return (
        <div className="relative inline-block">
            <div
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => isMobile && setIsOpen(!isOpen)}
                className="w-[96px] text-white bg-[#D06E31] flex h-[40px] justify-center items-center"
            >
                <span>{totalScore}</span>
                <span className="text-[#D2AE98]">/90</span>
            </div>

            {isOpen && (
                <div
                    className={`${
                        isMobile
                            ? 'fixed top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 flex items-center justify-center z-90 w-[300px]'
                            : 'absolute bottom-12 left-0 z-90'
                    }`}
                >
                    <div
                        ref={dropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`text-white p-4 ${isMobile ? 'w-max' : 'w-max'}`}
                    >
                        <div className="bg-[#282828] p-5 flex items-center justify-between">
                            <h3 className="text-[18px]">Общая оценка</h3>
                            <p className="text-[18px] text-green-500 ml-5">{data.overall}</p>
                        </div>

                        <ul className="bg-[#444242] p-5">
                            {finalData.map((stat, index) => (
                                <li key={index} className="flex justify-between bg-[#444242] py-1">
                                    <span className="text-[#949292]">{stat.label}</span>
                                    <span className="text-white">{stat.value}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href="https://example.com/researched-score"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#949292] hover:text-white transition-colors bg-[#282828] p-5 w-full block"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Что такое Researched Score?
                        </a>

                        {isMobile && (
                            <button className="w-full py-2 bg-[#282828] text-white" onClick={() => setIsOpen(false)}>
                                Закрыть
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
