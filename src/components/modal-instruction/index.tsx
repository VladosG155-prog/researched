'use client';

import { ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import parse, { domToReact } from 'html-react-parser';
import { useCategoryContext } from '@/providers/category-provider';

interface InstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const options = {
    replace: (domNode) => {
        if (domNode.name === 'a' && domNode.attribs?.href) {
            return (
                <a
                    href={domNode.attribs.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <span className="text-sm text-white">{domToReact(domNode.children)}</span>
                </a>
            );
        }
    }
};

const InstructionModal = ({ isOpen, onClose }: InstructionModalProps) => {
    const { setIsShowGuideModal } = useCategoryContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure the component is only rendered in the browser
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    // Only render the portal when the component is mounted in the browser
    if (!isMounted) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 pb-[20px]"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#1e1e1e] text-white shadow-lg max-w-3xl w-full max-h-[85vh] overflow-hidden border border-neutral-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-700">
                            <h3 className="text-lg font-semibold">Зачем мы тебе?</h3>
                            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors" aria-label="Закрыть">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="px-6 py-4 overflow-y-auto max-h-[60vh] text-sm leading-relaxed text-neutral-300 space-y-4 whitespace-pre-line custom-scrollbar">
                            {parse(
                                `Привет, друг!

Каким-то образом ты попал на этот сайт, его пилим мы, два друга-криптана, которые уже 7 лет в рынке — <a href="https://t.me/cryppi">криптапиражок</a> и <a href="https://t.me/mioncrypto">Mion</a>. И нам, если честно, надоело искать нормальные сервисы и расходники — где-то плохое качество, где-то очень дорого, а где-то поддержка плохо отвечает. Поэтому мы решили создать <a href="https://researched.xyz">researched.xyz</a>

В нём мы собрали 100+ сервисов из 7 различных категорий:
• Антидетект браузеры
• Прокси сервисы
• Магазины аккаунтов
• Трейдинг боты
• Кошельки
• OTC
• CEX-биржи

И самое главное — всех их мы протестировали по куче различных метрик. Например, мы получили доступ к 60+ различным прокси и проверили их в реальных событиях, или, например, мы измерили скорость 43 трейдинг ботов. Короче, много чего у нас есть.

А если ты не понимаешь, как тебе всё это поможет в заработке, то прочитай наш бесплатный гайд по мультиаккаунтингу по кнопке ниже.`,
                                options
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 pb-[20px]">
                            <button
                                onClick={setIsShowGuideModal}
                                className="flex items-center justify-center bg-[#D06E31] hover:bg-[#bb5f29] transition-all text-white font-mono text-sm h-10 px-4 "
                            >
                                <span className="flex items-center gap-2">
                                    Жми сюда
                                    <ChevronRight size={16} />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default InstructionModal;
