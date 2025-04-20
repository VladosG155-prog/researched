'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Page() {
    const router = useRouter();

    const listItemStyle = 'text-gray-200 marker:text-gray-400';

    const handleBackClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 relative"
        >
            <div className="max-w-4xl mx-auto bg-neutral-900 rounded-lg shadow-lg p-6 sm:p-8 md:p-10 relative z-10 backdrop-blur-sm">
                <div className="bg-neutral-900 rounded-lg p-4 sm:p-6 md:p-8 shadow-inner">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <Link
                            href="/"
                            onClick={handleBackClick}
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
                        className="prose prose-invert prose-headings:text-white prose-p:text-gray-100 prose-strong:text-white prose-a:text-blue-300 hover:prose-a:text-blue-200"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Что такое researched score?</h1>

                        <p>
                            Привет, друг! Ты каким-то образом попал на наш сайт researched.xyz, и, возможно, уже знаешь, зачем мы нужны
                            тебе. Если же нет — присаживайся поудобнее, потому что мы сейчас расскажем про такую интересную штуку, как
                            мультиаккаунтинг в крипте, и как он приносит огромные деньги самым обычным людям.
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">Основные способы заработка в криптовалюте</h2>
                        <p>
                            В мире криптовалют есть множество вариантов заработка. Мы выделили 11 основных направлений (или «ниш»), где
                            можно применять метод мультиаккаунтинга для увеличения дохода:
                        </p>

                        <ol className={`list-decimal list-inside space-y-2 ${listItemStyle}`}>
                            <li>Инвестиции</li>
                            <li>Трейдинг</li>
                            <li>Паблик сейлы</li>
                            <li>Аирдропы</li>
                            <li>Майнинг и ноды</li>
                            <li>NFT</li>
                            <li>Мемкоины</li>
                            <li>Play-to-Earn</li>
                            <li>Арбитраж</li>
                            <li>DeFi</li>
                            <li>Амбассадорство</li>
                        </ol>
                        <p>
                            Во всех этих способах можно использовать мультиаккаунты: вместо 1 аккаунта делаем 10, 100 или даже 1000 и более.
                        </p>

                        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg my-6">
                            <h3 className="text-xl font-semibold mb-2">Пример:</h3>
                            <p>
                                Можно было завести один аккаунт в «тапалке» Notcoin и получить примерно 100 долларов без всяких вложений. На
                                10 аккаунтах это уже 1000 долларов, а на 100 аккаунтах — 10000 долларов.
                            </p>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">Примеры профита из разных ниш</h2>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">1. Паблик сейлы</h3>
                        <h4 className="text-lg font-semibold mt-4 mb-2">ImmutableX (Layer-2 Blockchain)</h4>
                        <p>
                            Участвуете в сейле токена IMX на Coinlist, вкладываете 500 долларов и на листинге ловите 50 иксов. Это{' '}
                            <span className="font-semibold underline text-green-500">около 20000 долларов</span> с 1 аккаунта. Но чтобы
                            инвестировать, надо выиграть право в розыгрыше, в среднем — 1 аккаунт из 100. Мультиаккаунты решают эту
                            проблему.
                        </p>

                        <h4 className="text-lg font-semibold mt-4 mb-2">Impossible Finance (IDO Launchpad)</h4>
                        <p>
                            Токен IDIA на старте дал около 7 иксов, в районе{' '}
                            <span className="font-semibold underline text-green-500">600 долларов</span> прибыли на аккаунт. Но возможность
                            вложиться тоже нужно было выигрывать. И тут снова помогают мультиаккаунты.
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">2. Аирдропы</h3>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Arbitrum (Layer-2 Blockchain)</h4>
                        <p>
                            За 5 транзакций и 2 доллара на комиссии участники получили{' '}
                            <span className="font-semibold underline text-green-500">около 1000 долларов</span> наград.
                        </p>

                        <h4 className="text-lg font-semibold mt-4 mb-2">Uniswap (DEX на Ethereum)</h4>
                        <p>
                            За одну любую транзакцию всем пользователям начислили 400 UNI, которые в момент старта торгов стоили{' '}
                            <span className="font-semibold underline text-green-500">примерно 2000 долларов</span>.
                        </p>

                        <h4 className="text-lg font-semibold mt-4 mb-2">Aptos (Layer-1 Blockchain)</h4>
                        <p>
                            За создание бесплатного NFT раздавали по 150 APT (
                            <span className="font-semibold underline text-green-500">около 1000 долларов</span>).
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">3. Майнинг и ноды</h3>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Solana (Layer-1 Blockchain)</h4>
                        <p>
                            Награда за одну ноду в тестнете составляла{' '}
                            <span className="font-semibold underline text-green-500">примерно 100000 долларов</span>.
                        </p>

                        <h4 className="text-lg font-semibold mt-4 mb-2">Mina (Layer-1 Blockchain)</h4>
                        <p>
                            За аналогичное действие давали{' '}
                            <span className="font-semibold underline text-green-500">примерно 150000 долларов</span>.
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">4. NFT</h3>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Murakami Flowers (NFT на Ethereum)</h4>
                        <p>
                            Можно было выиграть право заминтить NFT за 300 долларов и сразу продать{' '}
                            <span className="font-semibold underline text-green-500">примерно за 15000 долларов</span>.
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">5. Амбассадорство</h3>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Goldfinch (Протокол кредитования)</h4>
                        <p>
                            За месяц активности в их амбассадорской программе Flight Academy выплатили{' '}
                            <span className="font-semibold underline text-green-500">по 3000 долларов</span>.
                        </p>

                        <p className="mt-6">
                            Во всех этих случаях мультиаккаунты позволяли увеличить заработок во много раз. Но нельзя просто так взять и
                            наделать 10 аккаунтов: проекты не любят, когда с одного IP-адреса и одного устройства появляется куча
                            пользователей. Поэтому каждому мультиаккеру нужна ферма.
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">Чек-лист по ферме мультиаккаунтов</h2>
                        <ul className={`list-disc list-inside space-y-2 ${listItemStyle}`}>
                            <li>
                                <strong>Антидетект браузер:</strong> Это программа, которая позволяет создавать бесконечное количество
                                «уникальных устройств» на одном компьютере за счёт подмены отпечатков. Мы рекомендуем{' '}
                                <Image
                                    src="https://www.adspower.net/favicon.ico"
                                    alt="AdsPower Logo"
                                    width={16}
                                    height={16}
                                    className="inline-block mr-1 rounded-sm"
                                />{' '}
                                <a
                                    href="https://share.adspower.net/researched"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    AdsPower
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Прокси:</strong> Проекты «бреют» мультиаккаунты, когда видят, что с одного IP заходит множество
                                аккаунтов. Прокси дают каждому профилю в антидетект браузере уникальный IP, и вы выглядите как реальный
                                пользователь. Для начала рекомендуем{' '}
                                <Image
                                    src="https://proxys.io/favicon.ico"
                                    alt="Proxys.io Logo"
                                    width={16}
                                    height={16}
                                    className="inline-block mr-1 rounded-sm"
                                />{' '}
                                <a href="https://proxys.io/?refid=244362" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Proxys.io
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Почты:</strong> Часто нужна почта для регистрации. Купить можно в{' '}
                                <Image
                                    src="https://dark.shopping/favicon.ico"
                                    alt="Darkstore Logo"
                                    width={16}
                                    height={16}
                                    className="inline-block mr-1 rounded-sm"
                                />{' '}
                                <a href="https://dark.shopping/?p=196077" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Darkstore
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Аккаунты соцсетей (Discord, Twitter, Telegram):</strong> Могут понадобиться для заданий: подписки,
                                активности в чатах, ретвиты и т.д. Тоже покупаются на{' '}
                                <Image
                                    src="https://dark.shopping/favicon.ico"
                                    alt="Darkstore Logo"
                                    width={16}
                                    height={16}
                                    className="inline-block mr-1 rounded-sm"
                                />{' '}
                                <a href="https://dark.shopping/?p=196077" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Darkstore
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Криптокошельки:</strong> Практически все проекты требуют транзакции. Мы сравнили популярные кошельки{' '}
                                <a href="https://researched.xyz" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                                    во вкладке «Кошельки» на нашем сайте researched.xyz
                                </a>
                                .
                            </li>
                            <li>
                                <strong>CEX-биржи:</strong> Важны для соблюдения «ончейн-гигиены». Если вы перекидываете одни и те же монеты
                                между разными кошельками напрямую, проект может вычислить связь между кошельками. Криптобиржи решают эту
                                проблему.
                            </li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">Как правильно «очищать» монеты через CEX</h3>
                        <ol className={`list-decimal list-inside space-y-2 ${listItemStyle}`}>
                            <li>Заходим на CEX.</li>
                            <li>Берём адрес депозита.</li>
                            <li>Отправляем туда монеты с кошелька №1.</li>
                            <li>Дождались поступления.</li>
                            <li>Выводим монеты на кошелёк №2.</li>
                        </ol>
                        <p className="mt-4">
                            Все транзакции с биржи идут с общего горячего кошелька, где монеты смешиваются тысячами операций в минуту. Связь
                            между кошельками №1 и №2 фактически теряется.
                        </p>

                        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg my-6">
                            <h3 className="text-xl font-semibold mb-2">Важно</h3>
                            <p>
                                Если вы используете один и тот же адрес для депозита с кошелька №1 и кошелька №2, они снова будут связаны
                                ончейн. Поэтому нужны CEX, у которых много уникальных адресов для депозита. Мы рекомендуем{' '}
                                <a
                                    href="https://www.okx.com/join/RESEARCHED"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    OKX
                                </a>{' '}
                                (220 адресов) и{' '}
                                <a
                                    href="https://partner.bitget.com/bg/researched"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Bitget
                                </a>{' '}
                                (500 адресов). Другие варианты смотрите во вкладке «CEX» на researched.xyz.
                            </p>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">Итоги: как начать «выносить» проекты</h2>
                        <p>
                            Собрав ферму для мультиаккаунтинга (антидетект браузер, прокси, соцсети, кошельки, биржи), вы можете существенно
                            повысить доход в любой из вышеперечисленных ниш. Мы рекомендуем AdsPower, Proxys, Darkstore, OKX, Bitget, но
                            если вам нужны другие решения под специфичные задачи — заходите на researched.xyz, там мы сравниваем множество
                            сервисов по разным критериям.
                        </p>

                        <p className="mt-6 font-semibold">Удачного мультиаккаунтинга и больших профитов!</p>
                    </motion.article>
                </div>
            </div>
        </motion.div>
    );
}
