'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'scroll';
        };
    }, [isOpen]);
    if (!isOpen) return null;
    return createPortal(
        <div className="">
            <div
                className="fixed inset-0 bg-black bg-opacity-70 opacity-40 flex justify-center items-center z-51 p-4 right-[0px] left-[0px] top-[0px] bottom-[0px]"
                onClick={onClose}
            ></div>
            <div
                className="bg-[#444242]  p-6 fixed left-1/2 top-1/2 z-60 -translate-1/2 max-w-[80%] md:max-w-[700px] max-h-[600px] overflow-y-auto w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between mb-[60px]">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button className="text-gray-400 hover:text-[#282828] bg-[#DEDEDE] cursor-pointer w-[110px] h-[50px]" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
