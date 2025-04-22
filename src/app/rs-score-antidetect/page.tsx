'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter();

    const listItemStyle = 'text-gray-200 marker:text-gray-400';

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen text-white p-4 sm:p-6 md:p-8 relative pb-[200px]"
        >
            <div className="max-w-4xl pb-[100px] mx-auto bg-neutral-900 rounded-lg shadow-lg p-6 sm:p-8 md:p-10 relative z-10 backdrop-blur-sm">
                <div className="bg-neutral-900 rounded-lg p-4 sm:p-6 md:p-8 shadow-inner pb-[150px]">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center text-xl sm:text-2xl font-medium tracking-tight hover:text-neutral-400 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="mr-2" size={24} />
                            researched.xyz
                        </Link>
                    </motion.div>

                    <motion.article
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="prose prose-invert pb-[150px] prose-headings:text-white prose-p:text-gray-100 prose-strong:text-white prose-a:text-blue-300 hover:prose-a:text-blue-200"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Researched Antidetect Score</h1>

                        <p>
                            Привет, друг. Мы давно работаем с мультиаккаунтингом и знаем, насколько критично выбрать действительно надёжный
                            антидетект-браузер. Поэтому мы разработали собственную систему оценки — Researched Antidetect Score.
                        </p>

                        <p>
                            Эту систему мы разработали в коллаборации с 30+ экспертами по анонимности — среди них фаундеры и технические
                            специалисты ведущих антидетект-браузеров. После десятков итераций и улучшений Researched Antidetect Score стал
                            точным и прикладным инструментом. Он состоит из 9 независимых проверок, каждая оценивается по шкале до 10
                            баллов. Максимальный результат — 90 баллов.
                        </p>

                        <p>Мы получили доступ ко всем топовым антидетект-браузерам и проверили их в реальных кейсах:</p>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">Критерии оценки</h2>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">1. Анонимность</h3>
                        <p>
                            Проверяем через агрегатор уязвимостей{' '}
                            <a href="https://whoer.net" className="text-blue-400 hover:text-blue-300 transition-colors">
                                whoer.net
                            </a>
                            . Он показывает, насколько ты выбиваешься из “естественного” поведения обычного пользователя. Оценка
                            производится в процентах. А вот как мы ставим баллы на основе полученных данных:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>Если ≥80% — 10 баллов</li>
                            <li>Если ≥50% — 5 баллов</li>
                            <li>Ниже — 0 баллов</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">2. Популярность отпечатка</h3>
                        <p>
                            Отпечаток браузера (или фингерпринт) — это уникальный «профиль» твоего браузера, который сайты могут собрать при
                            заходе на страницу, даже без cookies и логинов. Он строится из десятков технических параметров, например:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>модель и разрешение экрана,</li>
                            <li>версия ОС и браузера,</li>
                            <li>язык системы и таймзона,</li>
                            <li>список установленных шрифтов,</li>
                            <li>поведение JavaScript-объектов (navigator, window, screen),</li>
                            <li>WebRTC/IP/DNS информация,</li>
                            <li>способ отрисовки графики (Canvas и WebGL).</li>
                        </ul>
                        <p>
                            Так вот, внутри этого теста мы проверяем уникальность Canvas. Это один из главных параметров браузерного
                            отпечатка. И его нельзя просто подменить без побочек: он генерируется системой, видеокартой и графической
                            библиотекой.
                        </p>
                        <p>
                            Оцениваем уникальность и реалистичность Canvas на{' '}
                            <a href="https://amiunique.org" className="text-blue-400 hover:text-blue-300 transition-colors">
                                amiunique.org
                            </a>{' '}
                            и{' '}
                            <a href="https://browserleaks.com/canvas" className="text-blue-400 hover:text-blue-300 transition-colors">
                                browserleaks.com/canvas
                            </a>
                            .
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>От 0.01% до 2% — 10 баллов (естественный фингерпринт)</li>
                            <li>Всё остальное — 0 баллов</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">3. Качество подмены таймзоны</h3>
                        <p>Когда ты заходишь на сайт, он получает сразу два источника информации о твоём местоположении:</p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>IP-адрес — говорит, откуда ты в сети (например, Франция, Германия, Индонезия).</li>
                            <li>Таймзона браузера — говорит, сколько сейчас у тебя времени (например, GMT+1 или GMT+8).</li>
                        </ul>
                        <p>
                            Если эти данные не совпадают — это мгновенный красный флаг для антифрода. А проверяем мы это на сайте{' '}
                            <a href="https://whatismytimezone.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                whatismytimezone.com
                            </a>
                            .
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>"Good" (подмена корректная) — 10 баллов</li>
                            <li>Иначе — 0 баллов</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">4. Качество маскировки ОС</h3>
                        <p>
                            Если ты пытаешься выдать себя за другого пользователя, важно, чтобы твой антидетект-браузер не только подменил
                            User-Agent, но и убедительно замаскировал операционную систему (ОС). Потому что сайты умеют считывать признаки
                            твоей настоящей ОС на уровне JavaScript — и быстро замечают подмену, если она сделана некачественно.
                        </p>
                        <p>
                            Поэтому мы проверили, как антидетект браузер, установленный на Windows, эмулирует MacOS на архитектуре ARM.
                            Сделали мы это через Facebook 2FA.
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>"Correct" — 10 баллов</li>
                            <li>"No" (частично видно реальную ОС) — 5 баллов</li>
                            <li>Иное — 0 баллов</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">5. Проверка через скрипт</h3>
                        <p>
                            Мы написали собственный скрипт, который позволяет быстро определить, палится ли браузер как эмулятор. Он делает
                            10 проверок:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>navigator.webdriver — запущен ли браузер в автоматизированном режиме</li>
                            <li>window.outerWidth — насколько размеры внешнего окна браузера соответствуют внутренним</li>
                            <li>Не подменены ли системные шрифты</li>
                            <li>
                                navigator.languages — проверка массива языков, доступных в браузере. У реального пользователя, как правило,
                                указано 2 и более языков.
                            </li>
                            <li>
                                navigator.plugins — анализ списка установленных плагинов. Полное отсутствие плагинов встречается редко и
                                может быть признаком ручной очистки среды или нестандартной сборки.
                            </li>
                            <li>
                                Работа iframe — некорректная работа может говорить о кастомной конфигурации движка или ограничениях среды.
                            </li>
                            <li>
                                navigator.permissions — проверка реакции на запрос разрешений. Ошибки в ответах или отсутствие ожидаемой
                                структуры объекта указывают на нестандартную реализацию.
                            </li>
                            <li>
                                window.chrome — должен существовать в настоящем Chrome. Если его нет, это может сигнализировать о кастомной
                                сборке или обходной конфигурации.
                            </li>
                            <li>
                                navigator.connection.rtt — RTT (время отклика соединения). Нереалистично низкие значения (например, 0–1 мс)
                                часто связаны с прокси или симулированной сетью.
                            </li>
                            <li>
                                pointerEvents — проверка поведения интерактивных элементов и событий мыши. Нарушение стандартной логики
                                событий может указывать на ошибки в интерфейсном движке.
                            </li>
                        </ul>
                        <p>
                            Это важно потому, что большинство антифрод-систем и систем защиты от ботов проверяют именно поведение браузера
                            на уровне JavaScript, а не только заголовки или фингерпринт.
                        </p>
                        <p>
                            <strong>Количество пройденных проверок:</strong>
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>≥9 — 10 баллов</li>
                            <li>≥8 — 3 балла</li>
                            <li>≥5 — 2 балла</li>
                            <li>Меньше — 0 баллов</li>
                            <li>
                                Undefined — Если выключен iframe, то скрипт даже не запускается и проверку провести не удается. Любая
                                антифрод система такое сразу посчитает ред флагом — 0 баллов
                            </li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">6. Различие 2 профилей</h3>
                        <p>
                            Если два аккаунта используют один и тот же отпечаток, то с точки зрения сайта это просто один и тот же
                            пользователь, который пытается обмануть систему. Поэтому мы создаём два независимых профиля в одном
                            антидетект-браузере с базовыми настройками (никак не меняем) и сравниваем их фингерпринты — Canvas, WebGL,
                            аудио, системные параметры и поведение.
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>Если различаются (ответ "Yes") — 10 баллов</li>
                            <li>Если одинаковые — 0 баллов</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">7. Cloudflare challenge</h3>
                        <p>
                            Cloudflare — это крупнейший сервис по защите сайтов от ботов и атак. Поэтому мы проходим проверку через сайт,
                            где используется эта защита, а именно{' '}
                            <a
                                href="https://www.indeed.com/cmp/Burger-King/reviews"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                https://www.indeed.com/cmp/Burger-King/reviews
                            </a>
                            .
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>"Pass" — браузер прошёл Cloudflare без каких-либо проверок — 10 баллов</li>
                            <li>
                                "Challenge" — вышла капча, "Checking your browser..." или короткая пауза с крутящейся иконкой — 5 баллов
                            </li>
                            <li>
                                "Bad" — страница не открылась, "403 Access Denied", "Your request was blocked" или белый экран — 0 баллов
                            </li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">8. PixelScan.net Score</h3>
                        <p>
                            <a href="https://pixelscan.net" className="text-blue-400 hover:text-blue-300 transition-colors">
                                PixelScan.net
                            </a>{' '}
                            — это один из самых мощных и «параноидальных» фингерпринт-детекторов в интернете. И в результате проверки он
                            выдаёт редфлаги.
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>0 флагов — 10 баллов</li>
                            <li>1 флаг — 6 баллов</li>
                            <li>2 флага — 3 балла</li>
                            <li>3 флага — 1 балл</li>
                            <li>Больше 3 — 0 баллов</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">9. fv.pro Score</h3>
                        <p>
                            <a href="https://fv.pro" className="text-blue-400 hover:text-blue-300 transition-colors">
                                fv.pro
                            </a>{' '}
                            — менее известный, но не менее чувствительный чекер. Он тоже выдаёт редфлаги:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>0 красных флагов — 10 баллов</li>
                            <li>1 флаг — 6 баллов</li>
                            <li>2 флага — 3 балла</li>
                            <li>3 флага — 1 балл</li>
                            <li>&gt;3 флагов — 0 баллов</li>
                        </ul>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">Рекомендация</h2>
                        <p>
                            После всех этих проверок лучшим браузером стал{' '}
                            <a href="https://kameleo.io/?ref=29912" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Kameleo
                            </a>
                            . Он единственный набрал 90 баллов. Кроме того, Kameleo существует уже более 11 лет — за всё это время не было
                            ни одной публичной утечки или серьёзной технической проблемы. Это особенно важно, учитывая чувствительность
                            данных в криптомультиаккаунтинге.
                        </p>
                        <p>
                            Их базовый тариф стоит $59 в месяц и включает 20 облачных и неограниченное количество локальных профилей. А
                            промокод <strong>researchedxyz</strong> позволяет получить скидку -40% на годовой тариф.
                        </p>

                        <p>
                            Сравнение расходников для крипты и мультиаккаунтинга —{' '}
                            <a href="https://researched.xyz" className="text-blue-400 hover:text-blue-300 transition-colors">
                                researched.xyz
                            </a>
                            .
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/"
                                className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 hover:bg-blue-500 transition-colors"
                            >
                                Сравнить другие антидетект браузеры
                            </Link>
                        </div>
                    </motion.article>
                </div>
            </div>
        </motion.div>
    );
}
