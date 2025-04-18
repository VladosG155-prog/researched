'use client';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
                    <span className="text-[14px] text-white">{domToReact(domNode.children)}</span>
                </a>
            );
        }
    }
};

const InstructionModal = ({ isOpen, onClose }: InstructionModalProps) => {
    const { setIsShowGuideModal } = useCategoryContext();

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
                className="bg-[#444242] p-6 fixed left-1/2 top-1/2 z-60 -translate-1/2 max-w-[80%] md:max-w-[700px] max-h-[600px] overflow-y-scroll w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between mb-[40px]">
                    <h3 className="text-xl font-semibold text-white">Зачем мы тебе?</h3>
                    <button className="text-gray-400 hover:text-[#282828] bg-[#DEDEDE] cursor-pointer w-[110px] h-[50px]" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
                <div className="text-[#9D9D9D] whitespace-pre-line space-y-4 leading-relaxed text-[15px]">
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
                <button
                    onClick={setIsShowGuideModal}
                    className="flex items-center justify-center bg-[#D06E31] text-white font-['Martian_Mono'] font-normal text-[14px] h-[30px] px-4 border-none cursor-pointer transition-transform duration-300 mt-6"
                >
                    <span className="flex items-center gap-2">
                        Жми сюда
                        <ChevronRight size={16} />
                    </span>
                </button>
            </div>
        </div>,
        document.body
    );
};

export default InstructionModal;
