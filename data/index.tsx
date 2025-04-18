'use client';

import antikiData from './antiki.json';
import accountShopsData from './accshop.json';
import cexData from './cex.json';
import walletsData from './wallet.json';
import tradingBotsData from './tradebots.json';
import otcData from './otc.json';
import staticProxyData from './statikproxy.json';
import residentialProxyData from './resedentialproxy.json';
import mobileProxyData from './mobileproxy.json';
import { RenderIcon } from '../components/ui/render-utils';
import { useMemo } from 'react';

// Оптимизированные функции преобразования данных с мемоизацией
// Используем Map для кэширования результатов
const paymentMethodsCache = new Map<string, any[]>();
const countriesCache = new Map<string, any[]>();
const fraudScoreCache = new Map<string, number | string>();

// Оптимизированная функция для нормализации способов оплаты
const normalizePaymentMethods = (payment: any): any[] => {
    if (!payment) return [];

    // Создаем уникальный ключ для кэша
    const cacheKey = typeof payment === 'string' ? payment : Array.isArray(payment) ? JSON.stringify(payment) : String(payment);

    // Проверяем кэш
    if (paymentMethodsCache.has(cacheKey)) {
        return paymentMethodsCache.get(cacheKey)!;
    }

    let result: any[];

    if (Array.isArray(payment)) {
        result = payment.map((item) => (typeof item === 'string' ? { name: item } : item));
    } else if (typeof payment === 'string') {
        // Оптимизация: разделяем строку один раз и сразу преобразуем
        result = payment.split(/,\s*/).map((item) => ({ name: item.trim() }));
    } else {
        result = [{ name: String(payment) }];
    }

    // Сохраняем в кэш
    paymentMethodsCache.set(cacheKey, result);
    return result;
};

// Оптимизированная функция для нормализации стран
const normalizeCountries = (countries: any): any[] => {
    if (!countries) return [];

    // Для массивов создаем уникальный ключ
    if (Array.isArray(countries)) {
        const cacheKey = JSON.stringify(countries);

        // Проверяем кэш
        if (countriesCache.has(cacheKey)) {
            return countriesCache.get(cacheKey)!;
        }

        const result = countries.map((country) => (typeof country === 'string' ? { name: country } : country));

        // Сохраняем в кэш
        countriesCache.set(cacheKey, result);
        return result;
    }

    return [];
};

// Оптимизированная функция для нормализации fraud score
const normalizeFraudScore = (score: any): number | string => {
    if (score === undefined || score === null) return '-';

    const cacheKey = String(score);

    // Проверяем кэш
    if (fraudScoreCache.has(cacheKey)) {
        return fraudScoreCache.get(cacheKey)!;
    }

    let result: number | string;

    if (typeof score === 'number') {
        result = score;
    } else {
        const parsed = Number.parseInt(score, 10);
        result = isNaN(parsed) ? '-' : parsed;
    }

    // Сохраняем в кэш
    fraudScoreCache.set(cacheKey, result);
    return result;
};

// Оптимизированная функция для безопасного доступа к вложенным свойствам
const safelyGetNestedProperty = (obj: any, path: string[], defaultValue: any = undefined) => {
    if (!obj || !path || path.length === 0) return defaultValue;

    return path.reduce((prev, curr) => {
        return prev && prev[curr] !== undefined ? prev[curr] : defaultValue;
    }, obj);
};

// Кэш для форматированных данных категорий
const formattedCategoryDataCache = new Map<string, any[]>();

// Оптимизированная функция форматирования данных категории
export const formatCategoryData = (category: string | null, data: Record<string, any>) => {
    if (!category || !data || Object.keys(data).length === 0) {
        console.warn('No data to format for category:', category);
        return [];
    }

    // Создаем ключ для кэша
    const cacheKey = `${category}-${Object.keys(data).length}`;

    // Проверяем кэш
    if (formattedCategoryDataCache.has(cacheKey)) {
        return formattedCategoryDataCache.get(cacheKey)!;
    }

    try {
        // Оптимизация: используем Object.entries один раз и сразу преобразуем
        const result = Object.entries(data).map(([name, details]) => {
            // Создаем новый объект только с необходимыми свойствами
            const formattedDetails: Record<string, any> = { name };

            // Копируем только нужные свойства
            for (const key in details) {
                if (key === 'payment') {
                    formattedDetails.payment = normalizePaymentMethods(details.payment);
                } else if (key === 'countries') {
                    formattedDetails.countries = normalizeCountries(details.countries);
                } else if (key === 'fraudScore' || key === 'score') {
                    formattedDetails.fraudScore = normalizeFraudScore(details.fraudScore || details.score);
                } else {
                    formattedDetails[key] = details[key];
                }
            }

            return formattedDetails;
        });

        // Сохраняем в кэш
        formattedCategoryDataCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Error formatting data for category:', category, error);
        return [];
    }
};

// Улучшенный кэш для данных категорий
const categoryDataCache = new Map<string, any>();

// Оптимизированная функция получения данных категории
export const getCategoryData = (category: string | null) => {
    if (!category) {
        console.warn('No category selected');
        return { data: {}, info: { title: '', description: '' } };
    }

    // Проверяем кэш
    if (categoryDataCache.has(category)) {
        return categoryDataCache.get(category);
    }

    try {
        let result;

        // Используе объект для маппинга категорий вместо switch
        const categoryMap: Record<string, () => any> = {
            Антики: () => ({
                data: safelyGetNestedProperty(antikiData, ['Data', 'antiki', 'tools'], {}),
                info: safelyGetNestedProperty(antikiData, ['Data', 'antiki', 'info'], { title: 'Антики', description: '' })
            }),
            'Аккаунт шопы': () => ({
                data: safelyGetNestedProperty(accountShopsData, ['Data', 'accountStores', 'tools'], {}),
                info: safelyGetNestedProperty(accountShopsData, ['Data', 'accountStores', 'info'], {
                    title: 'Аккаунт шопы',
                    description: ''
                })
            }),
            CEX: () => ({
                data: safelyGetNestedProperty(cexData, ['Data', 'cex', 'tools'], {}),
                info: safelyGetNestedProperty(cexData, ['Data', 'cex', 'info'], { title: 'CEX', description: '' })
            }),
            Кошельки: () => ({
                data: safelyGetNestedProperty(walletsData, ['Data', 'wallets', 'tools'], {}),
                info: safelyGetNestedProperty(walletsData, ['Data', 'wallets', 'info'], {
                    title: 'Кошельки',
                    description: ''
                })
            }),
            'Трейдинг боты': () => ({
                data: safelyGetNestedProperty(tradingBotsData, ['Data', 'tradingBots', 'tools'], {}),
                info: safelyGetNestedProperty(tradingBotsData, ['Data', 'tradingBots', 'info'], {
                    title: 'Трейдинг боты',
                    description: ''
                })
            }),
            OTC: () => ({
                data: safelyGetNestedProperty(otcData, ['Data', 'otc', 'tools'], {}),
                info: safelyGetNestedProperty(otcData, ['Data', 'otc', 'info'], { title: 'OTC', description: '' })
            }),
            'Прокси Статические': () => ({
                data: safelyGetNestedProperty(staticProxyData, ['Data', 'proxy', 'staticProxy', 'tools'], {}),
                info: safelyGetNestedProperty(staticProxyData, ['Data', 'proxy', 'staticProxy', 'info'], {
                    title: 'Статические прокси',
                    description: 'Выделенные IP-адреса для постоянного использования.'
                })
            }),
            'Прокси Резидентские': () => ({
                data: safelyGetNestedProperty(residentialProxyData, ['Data', 'proxy', 'residentialProxy', 'tools'], {}),
                info: safelyGetNestedProperty(residentialProxyData, ['Data', 'proxy', 'residentialProxy', 'info'], {
                    title: 'Резидентские прокси',
                    description: 'Прокси с IP-адресами реальных устройств.'
                })
            }),
            'Прокси Мобильные': () => ({
                data: safelyGetNestedProperty(mobileProxyData, ['Data', 'proxy', 'mobileProxy', 'tools'], {}),
                info: safelyGetNestedProperty(mobileProxyData, ['Data', 'proxy', 'mobileProxy', 'info'], {
                    title: 'Мобильные прокси',
                    description: 'Прокси с IP-адресами мобильных операторов.'
                })
            })
        };

        // Получаем данные из маппинга или возвращаем пустой объект
        result = categoryMap[category]
            ? categoryMap[category]()
            : {
                  data: {},
                  info: {
                      title: category || 'Категория',
                      description: 'Произошла ошибка при загрузке данных.'
                  }
              };

        // Сохраняем в кэш
        categoryDataCache.set(category, result);

        return result;
    } catch (error) {
        console.error('Error getting data for category:', category, error);
        return {
            data: {},
            info: {
                title: category || 'Категория',
                description: 'Произошла ошибка при загрузке данных.'
            }
        };
    }
};

// Кэш для колонок категорий
const categoryColumnsCache = new Map<string, any[]>();

// Оптимизированная функция получения колонок категории
export const getCategoryColumns = (category: string | null): any[] => {
    if (!category) return [];

    // Проверяем кэш
    if (categoryColumnsCache.has(category)) {
        return categoryColumnsCache.get(category)!;
    }

    try {
        // Объект для маппинга колонок категорий
        const columnsMap: Record<string, any[]> = {
            Антики: [
                {
                    key: 'name',
                    header: 'Сервис',
                    width: '15%',
                    renderCell: (_, row) => (
                        <div className="flex items-center gap-2">
                            {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                            <span>{row.name}</span>
                        </div>
                    )
                },
                { key: 'price', header: 'Цена', width: '15%' },
                {
                    key: 'pricePerProfile',
                    header: 'Цена за профиль',
                    width: '15%'
                },
                { key: 'automation', header: 'Автоматизация', width: '15%' },
                { key: 'payment', header: 'Оплата', width: '25%' },
                { key: 'support', header: 'Техподдержка', width: '15%' }
            ],
            'Аккаунт шопы': [
                {
                    key: 'name',
                    header: 'Сервис',
                    width: '15%',
                    renderCell: (_, row) => (
                        <div className="flex items-center gap-2">
                            {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                            <span>{row.name}</span>
                        </div>
                    )
                },
                { key: 'products', header: 'Что продают?', width: '30%' },
                {
                    key: 'bestPrice',
                    header: 'Дешевле всего',
                    width: '20%',
                    tooltip: 'Категории с лучшими ценами'
                },
                { key: 'payment', header: 'Оплата', width: '20%' },
                { key: 'support', header: 'Техподдержка', width: '15%' }
            ],
            CEX: [
                {
                    key: 'name',
                    header: 'Сервис',
                    width: '15%',
                    renderCell: (_, row) => (
                        <div className="flex items-center gap-2">
                            {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                            <span>{row.name}</span>
                        </div>
                    )
                },
                { key: 'commission', header: 'Комиссия', width: '15%' },
                { key: 'subaccounts', header: 'Субаккаунты', width: '15%' },
                {
                    key: 'purpose',
                    header: 'Назначение',
                    width: '20%',
                    renderCell: (value) => (
                        <div className="max-h-[120px] overflow-y-auto pr-2 text-sm">
                            {typeof value === 'string' && (
                                <div className="flex flex-col gap-1.5">
                                    {value.split(',').map((item, index) => (
                                        <div key={index} className="flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 -full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
                                            <span className="text-neutral-300">{item.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                },
                { key: 'kyc', header: 'KYC', width: '15%' },
                { key: 'fees', header: 'Комиссии', width: '10%' },
                {
                    key: 'breachHistory',
                    header: 'Случаи взломов',
                    width: '250px',
                    tooltip: 'История инцидентов безопасности на бирже'
                }
            ],
            Кошельки: [
                {
                    key: 'name',
                    header: 'Сервис',
                    width: '15%',
                    renderCell: (_, row) => (
                        <div className="flex items-center gap-2">
                            {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                            <span>{row.name}</span>
                        </div>
                    )
                },
                { key: 'description', header: 'Описание', width: '30%' },
                {
                    key: 'networks',
                    header: 'Сети',
                    width: '25%'
                },
                {
                    key: 'platforms',
                    header: 'Платформы',
                    width: '20%',
                    renderCell: (value) => (
                        <div className="flex flex-wrap gap-1">
                            {Array.isArray(value) &&
                                value.map((platform: string, i: number) => (
                                    <span key={i} className="bg-neutral-800 px-2 py-1  text-xs">
                                        {platform}
                                    </span>
                                ))}
                        </div>
                    )
                }
            ],
            'Трейдинг боты': [
                {
                    key: 'name',
                    header: 'Сервис',
                    width: '15%',
                    renderCell: (_, row) => (
                        <div className="flex items-center gap-2">
                            {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                            <span>{row.name}</span>
                        </div>
                    )
                },
                { key: 'commission', header: 'Комиссия', width: '15%' },
                { key: 'speed', header: 'Скорость', width: '15%' },
                {
                    key: 'networks',
                    header: 'Сети',
                    width: '15%'
                },
                { key: 'interface', header: 'Интерфейс', width: '15%' },
                { key: 'referral', header: 'Реф. Программа', width: '15%' }
            ],
            OTC: [
                {
                    key: 'name',
                    header: 'Сервис',
                    width: '15%',
                    renderCell: (_, row) => (
                        <div className="flex items-center gap-2">
                            {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                            <span>{row.name}</span>
                        </div>
                    )
                },
                { key: 'founder', header: 'Основатель', width: '20%' },
                { key: 'commission', header: 'Комиссия', width: '30%' },
                { key: 'responseTime', header: 'Время ответа', width: '15%' }
            ]
        };

        // Для всех типов прокси используем одинаковые колонки
        const proxyColumns = [
            {
                key: 'name',
                header: 'Сервис',
                width: '15%',
                renderCell: (_, row) => (
                    <div className="flex items-center gap-2">
                        {row.icon && <RenderIcon src={row.icon} alt={row.name} />}
                        <span>{row.name}</span>
                    </div>
                )
            },
            {
                key: 'price',
                header: 'Цена',
                width: '20%',
                tooltip: 'Стоимость за 1 IP в месяц'
            },
            {
                key: 'countries',
                header: 'Кол-во стран',
                width: '25%'
            },
            { key: 'support', header: 'Техподдержка', width: '15%' },
            { key: 'payment', header: 'Оплата', width: '25%' }
        ];

        // Добавляем прокси в маппинг
        columnsMap['Прокси Статические'] = proxyColumns;
        columnsMap['Прокси Резидентские'] = proxyColumns;
        columnsMap['Прокси Мобильные'] = proxyColumns;

        // Получаем колонки из маппинга или возвращаем пустой массив
        const result = columnsMap[category] || [];

        // Сохраняем в кэш
        categoryColumnsCache.set(category, result);

        return result;
    } catch (error) {
        console.error('Error getting columns for category:', category, error);
        return [];
    }
};

// Хук для фильтрации данных с мемоизацией
export function useFilteredData(data: any[], filters: Record<string, any>) {
    return useMemo(() => {
        if (!data || data.length === 0) return [];

        return data.filter((item) => {
            // Проверяем каждый фильтр
            for (const [key, value] of Object.entries(filters)) {
                // Пропускаем пустые фильтры
                if (value === null || value === undefined || value === '') continue;

                // Фильтрация по стране
                if (key === 'country' && item.countries) {
                    const countries = Array.isArray(item.countries) ? item.countries : [item.countries];

                    const hasCountry = countries.some(
                        (country: any) => (typeof country === 'string' && country === value) || (country && country.name === value)
                    );

                    if (!hasCountry) return false;
                }

                // Фильтрация по способу оплаты
                if (key === 'paymentMethod' && item.payment) {
                    const payments = Array.isArray(item.payment) ? item.payment : [item.payment];

                    // Проверяем наличие метода оплаты
                    const hasPaymentMethod = payments.some((payment: any) => {
                        const paymentName = typeof payment === 'string' ? payment : payment?.name;

                        // Для криптовалюты
                        if (value === 'crypto') {
                            return /крипт|crypto|btc|eth|usdt|bitcoin|ethereum/i.test(paymentName);
                        }

                        // Для российских карт
                        if (value === 'ru-card') {
                            return /карт|card|visa|mastercard|mir|сбер|тинькофф|альфа/i.test(paymentName);
                        }

                        return false;
                    });

                    if (!hasPaymentMethod) return false;
                }

                // Фильтрация по сети (для кошельков и ботов)
                if (key === 'network' && item.networks) {
                    const networks = Array.isArray(item.networks)
                        ? item.networks
                        : typeof item.networks === 'string'
                        ? item.networks.split(/,\s*/)
                        : [];

                    const hasNetwork = networks.some(
                        (network: any) => (typeof network === 'string' && network === value) || (network && network.name === value)
                    );

                    if (!hasNetwork) return false;
                }

                // Фильтрация по интерфейсу (для ботов)
                if (key === 'interface' && item.interface) {
                    const interfaceValue = item.interface.toLowerCase();

                    if (value === 'tg-bot' && !interfaceValue.includes('tg') && !interfaceValue.includes('telegram')) {
                        return false;
                    }

                    if (
                        value === 'website' &&
                        !interfaceValue.includes('сайт') &&
                        !interfaceValue.includes('site') &&
                        !interfaceValue.includes('web')
                    ) {
                        return false;
                    }

                    if (value === 'tg-miniapp' && !interfaceValue.includes('mini')) {
                        return false;
                    }
                }
            }

            // Если прошли все фильтры, включаем элемент
            return true;
        });
    }, [data, ...Object.values(filters)]);
}
