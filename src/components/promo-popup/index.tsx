'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PromoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    info?: {
        popupText: string;
        buttonName: string;
        promoCode: string;
        link: string;
    };
}

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
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
                className="p-6 fixed left-1/2 top-1/2 z-60 -translate-1/2 max-w-[80%] md:max-w-[400px] max-h-[600px] overflow-y-auto w-full bg-[#2C2C2C]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between mb-[20px]">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button className="text-gray-400 hover:text-[#282828] cursor-pointer " onClick={onClose}>
                        <X />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};

const PromoPopup = ({ isOpen, onClose, info }: PromoPopupProps) => {
    const router = useRouter();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(info.promoCode);
        alert('Промокод скопирован!');
    };

    useEffect(() => {
        if (info?.promoCode) {
            navigator.clipboard.writeText(info?.promoCode);
        }
    }, [info?.promoCode]);

    if (!isOpen) return null;
    if (!info?.promoCode) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={'Промокод скопирован:'}>
            <div>
                <div className="flex flex-col justify-center items-center mb-[20px]">
                    <div onClick={copyToClipboard} className="bg-[#444242] text-white p-[15px] text-center rounded-sm  w-full">
                        {info.promoCode}
                    </div>
                    <button
                        onClick={info.link ? () => window.open(info.link) : null}
                        className="flex justify-center gap-[8px] items-center w-full cursor-pointer bg-[#D06E31] py-[10px] mt-3 rounded-sm"
                    >
                        Перейти на сайт со скидкой
                    </button>
                </div>
                <p className="text-[#949292] text-start text-[12px] text-regular">{info.popupText}</p>
            </div>
        </Modal>
    );
};

export default PromoPopup;
