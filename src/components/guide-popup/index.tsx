'use client';
import { getCookie, setCookie } from 'cookies-next';
import { Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const VALID_CODES = [
    'rteoE7',
    'V8LjRQ',
    'lWfI5n',
    'm45bQ5',
    'lt91Ed',
    'x1PIwf',
    'O6PrtG',
    'N1j3mK',
    '0cGMwm',
    'PG2WzT',
    '2E8CfR',
    'RJ6X1s',
    'z0NoGG',
    'ePxt2X',
    '5UyltJ',
    'FmXm3w',
    '8g7F51',
    'aTMuL8',
    'AjU6ec',
    '02nTWu',
    'uEkI5h',
    '9m76Kc',
    'K9qw9I',
    'S8Ki0J',
    'rjm1NF',
    'GdDd2c',
    'x9e5LJ',
    'ZkYy6n',
    'P5ssdv',
    'WWw3N1'
];
interface GuidePopupProps {
    isOpen: boolean;
    onClose: () => void;
}
export function GuidePopup({ isOpen, onClose }: GuidePopupProps) {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Оптимизированная проверка доступа
    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, [router]);

    // Оптимизированный обработчик отправки формы
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setIsSubmitting(true);

            // Простая валидация
            if (!code.trim()) {
                setError('Пожалуйста, введите код доступа');
                setIsSubmitting(false);
                return;
            }
            // Проверка валидности кода
            if (VALID_CODES.includes(code)) {
                setCookie('guideAccess', 'true', { maxAge: 60 * 60 * 24 * 30 }); // 30 дней
                router.push('/multiaccounting');
            } else {
                setError('Неверный код. Пожалуйста, попробуйте еще раз.');
                setIsSubmitting(false);
            }
        },
        [code, router]
    );

    // Оптимизированный обработчик открытия бота
    const openBot = useCallback(() => {
        window.open('https://t.me/researchedxyz_bot', '_blank');
    }, []);

    // Оптимизированный обработчик изменения кода
    const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    }, []);

    if (!isOpen) return null;

    return createPortal(
        <div>
            <div
                className="fixed inset-0 bg-black bg-opacity-70 opacity-40 flex justify-center items-center z-51 p-4 right-[0px] left-[0px] top-[0px] bottom-[0px]"
                onClick={onClose}
            ></div>
            <div className=" p-6 fixed left-1/2 top-1/2 z-60 -translate-1/2 max-w-[580px] w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between mb-[60px]">
                    <h3 className="text-xl font-semibold text-white"></h3>
                </div>
                <div
                    className={`bg-neutral-900 p-6  shadow-xl max-w-md w-full transition-all duration-200 ease-in-out ${
                        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    }`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Доступ к гайду</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <p className="text-neutral-400 text-sm mb-4 tracking-tight leading-normal">
                        Привет, друг. Мы подготовили для тебя понятный и информативный гайд по заработку на мультиаккаунтинге. Зайди в TG
                        бота и он выдаст тебе код для открытия статьи.
                    </p>

                    <button
                        onClick={openBot}
                        className="w-full bg-blue-500 text-white py-2 px-4 -md hover:bg-blue-600 transition-colors mb-4 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5 mr-2" />
                        Открыть бота
                    </button>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="Введите код доступа"
                            className="w-full bg-neutral-800 text-white py-2 px-4 -md mb-2"
                            disabled={isSubmitting}
                        />

                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 -md hover:bg-orange-600 transition-colors disabled:opacity-70"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Проверка...' : 'Получить доступ'}
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}
