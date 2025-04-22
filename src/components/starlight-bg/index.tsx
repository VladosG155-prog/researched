'use client';

import { useEffect, useRef } from 'react';
import './animation.css';
import { usePathname } from 'next/navigation';

const TwinklingStarsGrid = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== '/') return;

        const starsGrid = gridRef.current;
        if (!starsGrid) {
            console.error('Grid ref is not attached');
            return;
        }

        const cellSize = 20;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const cols = Math.ceil(windowWidth / cellSize);
        const rows = Math.ceil(windowHeight / cellSize);
        const totalCells = rows * cols;

        // Set grid dimensions
        starsGrid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
        starsGrid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

        // Create grid cells
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'bg-black w-[20px] h-[20px]';
            starsGrid.appendChild(cell);
        }

        const cells = starsGrid.querySelectorAll('div');
        const numberOfStars = Math.floor(totalCells * 0.03125);
        const insideEllipseStars = Math.floor(numberOfStars * 0.7);
        const outsideEllipseStars = numberOfStars - insideEllipseStars;

        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;
        const radiusX = windowWidth / 3;
        const radiusY = windowHeight / 3;

        const isInsideEllipse = (x: number, y: number) => (x - centerX) ** 2 / radiusX ** 2 + (y - centerY) ** 2 / radiusY ** 2 <= 1;

        const insideEllipseIndices: number[] = [];
        const outsideEllipseIndices: number[] = [];

        for (let i = 0; i < totalCells; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * cellSize + cellSize / 2;
            const y = row * cellSize + cellSize / 2;

            if (isInsideEllipse(x, y)) {
                insideEllipseIndices.push(i);
            } else {
                outsideEllipseIndices.push(i);
            }
        }

        const shuffle = (array: number[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        shuffle(insideEllipseIndices);
        shuffle(outsideEllipseIndices);

        const applyTwinkle = (index: number) => {
            const cell = cells[index] as HTMLElement;
            cell.className = 'bg-[#212121] opacity-0 twinkle-animation w-[20px] h-[20px]';
            cell.style.animationDelay = `${Math.random() * 5}s`;
        };

        for (let i = 0; i < Math.min(insideEllipseStars, insideEllipseIndices.length); i++) {
            applyTwinkle(insideEllipseIndices[i]);
        }

        for (let i = 0; i < Math.min(outsideEllipseStars, outsideEllipseIndices.length); i++) {
            applyTwinkle(outsideEllipseIndices[i]);
        }

        return () => {
            while (starsGrid.firstChild) {
                starsGrid.removeChild(starsGrid.firstChild);
            }
        };
    }, [pathname]);

    if (pathname !== '/') return null;

    return (
        <>
            {/* Ensure Tailwind includes these classes in production */}
            <div className="hidden bg-black w-[20px] h-[20px] bg-gray-800 opacity-0 twinkle-animation" />
            <div className="fixed inset-0 grid bg-black overflow-hidden z-0" ref={gridRef} />
        </>
    );
};

export default TwinklingStarsGrid;
