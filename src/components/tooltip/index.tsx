'use client';

import React, { ReactNode, useState } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top', delay = 200 }) => {
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        const id = setTimeout(() => {
            setVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    return (
        <div className="relative inline-block">
            <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip} className="inline-block">
                {children}
            </div>

            {visible && (
                <div
                    className={`absolute z-50 w-max max-w-xs px-3 py-2 text-sm text-white bg-gray-800 -md shadow-lg transition-opacity duration-200 ${positionClasses[position]}`}
                    role="tooltip"
                >
                    {content}
                    <div
                        className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
                            position === 'top' && '-bottom-1 left-1/2 -translate-x-1/2'
                        } ${position === 'bottom' && '-top-1 left-1/2 -translate-x-1/2'} ${
                            position === 'left' && '-right-1 top-1/2 -translate-y-1/2'
                        } ${position === 'right' && '-left-1 top-1/2 -translate-y-1/2'}`}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
