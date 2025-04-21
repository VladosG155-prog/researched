'use client';
import {
    createColumnHelper,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import cexData from '../../../data/cex.json';
import CategoriesLayout from '../categories/layout';
import { ChevronDown, ChevronUp, ExternalLink, Eye, FilterIcon, Phone, SortAsc, SortDesc } from 'lucide-react';
import { Fragment, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import PromoPopup from '@/components/promo-popup';
import parse, { domToReact } from 'html-react-parser';
import { Filter } from '@/components/filter';
import { getCexFilters, getChains } from '@/utils/get-cex-filters';
import { ClearFilters } from '@/components/clear-filters';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BreachModal from '@/components/breach-modal';
import { TopPlace } from '@/components/top-place';
import othersTokens from '../../../data/other_coins.json';
import Modal from '@/components/modal';

const dataNew = Object.entries(cexData.Data.cex.tools);
const options = {
    replace: (domNode) => {
        if (domNode.name === 'a' && domNode.attribs?.href) {
            return (
                <a
                    href={domNode.attribs.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#121212] flex items-center gap-1 transition max-w-[150px] h-[30px] p-5 mt-4"
                >
                    <ExternalLink className="w-6 h-6" />
                    <span className="text-[10px] md:text-[14px]">{domToReact(domNode.children)}</span>
                </a>
            );
        }
    }
};
const options2 = {
    replace: (domNode) => {
        console.log(domNode);

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
                    <span className="text-[14px]">{domToReact(domNode.children)}</span>
                </a>
            );
        }
    }
};
interface WithdrawalFeeData {
    tokenAmount: string;
    usdAmount: number;
}

interface WithdrawalFees {
    [exchange: string]: WithdrawalFeeData;
}

function Page() {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [isShowBreachModal, setIsShowBreachModal] = useState(false);
    const [selectedBreachData, setSelectedBreachData] = useState([]);
    const [isOpenOtherTokenModal, setIsOpenOtherTokenModal] = useState(false);
    const [withdrawalFees, setWithdrawalFees] = useState<WithdrawalFees>({});
    const [isOpenEarningModal, setIsOpenEarningModal] = useState(false);
    const [openRestrictions, setOpenRestrictions] = useState('');
    const [isOpenRestrictionsModal, setIsOpenRestrictionsModal] = useState(false);
    const [openedEarning, setOpenedEarnings] = useState('');
    const [chain, setChain] = useState('');
    const [token, setToken] = useState('');
    const router = useRouter();

    const mappedData = useMemo(() => {
        return dataNew.map((elem) => {
            const [key, data] = elem;

            return {
                id: key,
                commision: data.commission,
                subAccounts: data.subaccounts,
                purpose: data.purpose,
                link: data.link,
                earnings: data.earnings,
                restrictions: data.restrictions || '',
                fullRestrictions: data.fullRestrictions,
                children: [
                    { name: 'KYC', content: data.kyc, colSpan: 1 },
                    { name: 'Комиссии', content: data.fees, colSpan: 1 },
                    { name: 'Случаи взломов', content: data.breachHistory, colSpan: 2 },
                    { name: 'Как заработать', content: data.earnings, colSpan: 2 }
                ],
                icon: data.icon
            };
        });
    }, [dataNew]);

    const columnHelper = createColumnHelper();

    const toggleModal = () => {
        setIsOpenModal((prev) => !prev);
    };

    const renderCommissionCell = (info: any) => {
        const exchangeName = info.row.original.id;
        const feeData = withdrawalFees[exchangeName];
        console.log('Rendering commission for:', exchangeName, 'Data:', feeData);

        if (!feeData || !feeData.tokenAmount) {
            return <span className="text-white cursor-pointer">{info.getValue()}</span>;
        }

        return (
            <div className="text-white cursor-pointer">
                <div>
                    {feeData.tokenAmount} {chain}
                </div>
                <div className="text-[#7E7E7E]">${feeData.usdAmount.toFixed(2)}</div>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'Сервис',
                size: 200,
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-3">
                            {!sorting?.length && !chain && !token && row.index <= 2 && <TopPlace place={row.index + 1} />}
                            {row.original.icon && (
                                <Image
                                    width={25}
                                    height={25}
                                    src={row.original.icon}
                                    alt={row.original.id}
                                    className="object-contain rounded-[3px]"
                                    unoptimized={true}
                                />
                            )}
                            <span className="text-white flex-grow">{row.original.id}</span>
                        </div>
                    );
                }
            }),
            columnHelper.accessor('restrictions', {
                header: 'Ограничения',
                size: 200,
                enableSorting: false,
                cell: (info) =>
                    info.row.original.restrictions ? (
                        <div className="cursor-pointer flex-col flex">
                            <span className="text-white">{info.getValue()}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenRestrictions(info.row.original.fullRestrictions);
                                    console.log(info.row.original.fullRestrictions);

                                    setIsOpenRestrictionsModal(true);
                                }}
                                className="bg-[#121212] p-2 mt-3 cursor-pointer text-[14px] max-w-max"
                            >
                                Подробнее
                            </button>
                        </div>
                    ) : (
                        <span></span>
                    )
            }),
            columnHelper.accessor('commision', {
                header: 'Комиссия',
                size: 200,
                enableSorting: false,
                cell: renderCommissionCell
            }),
            columnHelper.accessor('subAccounts', {
                header: 'Субаккаунты',
                size: 250,
                cell: (info) => <span className="text-white cursor-pointer">{info.getValue()}</span>,
                enableSorting: false,
                sortDescFirst: true
            }),
            columnHelper.accessor('purpose', {
                header: 'Назначение',
                enableSorting: false,
                size: 400,
                cell: (info) => <span className="text-white">{info.getValue()}</span>
            }),
            columnHelper.display({
                id: 'expand',
                header: '',
                size: 100,
                cell: ({ row }) => {
                    const canExpand = !!row.original.children;
                    return (
                        <button
                            onClick={(e) => {
                                if (row.index >= 4 && chain && token) {
                                    return null;
                                }
                                row.toggleExpanded();
                                e.stopPropagation();
                            }}
                            disabled={!canExpand}
                            className={`p-1 text-white h-[50px] w-[50px] ${
                                canExpand ? 'cursor-pointer hover:text-gray-300' : 'cursor-default opacity-50'
                            }`}
                        >
                            {row.getIsExpanded() ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    );
                }
            })
        ],
        [withdrawalFees, chain]
    );

    const table = useReactTable({
        data: mappedData,
        columns,
        state: {
            expanded,
            sorting
        },
        onExpandedChange: setExpanded,
        onSortingChange: setSorting,
        getRowCanExpand: (row) => !!row.original.children,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    const chains = getChains().map((chain) => {
        return {
            name: chain,
            icon: ''
        };
    });

    const clearFilters = () => {
        setChain('');
        setToken('');
        setWithdrawalFees({});
        setSorting([]);
        setExpanded({});
    };

    const toggleBreachModal = () => {
        setIsShowBreachModal((prev) => !prev);
    };

    const otherChains = othersTokens.map((item) => {
        return {
            name: item,
            icon: ''
        };
    });

    const visibleRows = chain && token ? table.getRowModel().rows.slice(0, 4) : table.getRowModel().rows;
    const blurredRows = chain && token ? table.getRowModel().rows.slice(4) : [];

    const toggleEarningModal = () => {};

    // Функция для отправки запроса на получение комиссии
    const fetchWithdrawalFee = async (network: string, coin: string) => {
        try {
            console.log('Fetching data for:', { network, coin });
            const response = await fetch(`http://localhost:8000/withdrawal_fee?network=${network}&coin=${coin}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Received data:', data);

            // Преобразуем данные в нужный формат
            const formattedData: WithdrawalFees = {};
            for (const [exchange, exchangeData] of Object.entries(data)) {
                if (exchangeData && typeof exchangeData === 'object' && 'tokenAmount' in exchangeData && 'usdAmount' in exchangeData) {
                    formattedData[exchange] = {
                        tokenAmount: String(exchangeData.tokenAmount),
                        usdAmount: Number(exchangeData.usdAmount)
                    };
                } else if (exchangeData === null) {
                    // Пропускаем null значения
                    continue;
                }
            }

            console.log('Formatted data:', formattedData);
            setWithdrawalFees(formattedData);
        } catch (error) {
            console.error('Error fetching withdrawal fee:', error);
            setWithdrawalFees({});
        }
    };

    // Обработчик изменения токена
    const handleChainChange = (selectedChain: string) => {
        if (othersTokens.includes(selectedChain)) {
            setIsOpenOtherTokenModal(true);
            return;
        }
        setChain(selectedChain);
        setToken('');
        setWithdrawalFees({});

        // Загружаем данные для новой монеты
        const availableNetworks = getCexFilters(selectedChain);
        if (availableNetworks && availableNetworks.length > 0) {
            const firstNetwork = availableNetworks[0];
            setToken(firstNetwork);
            fetchWithdrawalFee(firstNetwork, selectedChain);
        }
    };

    // Обработчик изменения сети
    const handleTokenChange = (selectedToken: string) => {
        setToken(selectedToken);
        setWithdrawalFees({}); // Очищаем старые данные
        if (chain && selectedToken) {
            fetchWithdrawalFee(selectedToken, chain);
        }
    };

    useEffect(() => {
        if (chain && token) {
            fetchWithdrawalFee(token, chain);
        }
    }, [chain, token]);

    // Добавим логирование при изменении состояния
    useEffect(() => {
        console.log('Current withdrawalFees:', withdrawalFees);
    }, [withdrawalFees]);

    return (
        <CategoriesLayout title={cexData.Data.cex.info.title} description={cexData.Data.cex.info.description}>
            <Modal title="Ограничения" isOpen={isOpenRestrictionsModal} onClose={() => setIsOpenRestrictionsModal((prev) => !prev)}>
                <p>{openRestrictions}</p>
            </Modal>
            <Modal title="Способы заработка" isOpen={isOpenEarningModal} onClose={() => setIsOpenEarningModal(false)}>
                {parse(openedEarning, options2)}
            </Modal>
            <Modal isOpen={isOpenOtherTokenModal} onClose={() => setIsOpenOtherTokenModal(false)} title="Ошибка">
                <p>Этот токен доступен только в нашем бесплатном боте</p>
                <button
                    className="bg-[#121212] inline-block max-w-max p-4 cursor-pointer mt-2"
                    onClick={() => {
                        window.open('https://t.me/researchedxyz');
                    }}
                >
                    Перейти
                </button>
            </Modal>
            <PromoPopup isOpen={isOpenModal} onClose={toggleModal} />
            <BreachModal isOpen={isShowBreachModal} onClose={toggleBreachModal} data={selectedBreachData} />
            <div className="py-6">
                <div className="flex gap-3 mb-4 items-end flex-wrap">
                    <div>
                        <p className="text-[12px] mb-2">Сравните комиссию на вывод:</p>
                        <Filter
                            selectedValue={chain}
                            onChange={handleChainChange}
                            name="Токен"
                            showSearch={true}
                            filters={[...chains, ...otherChains]}
                            showText={true}
                        />
                    </div>
                    {chain && (
                        <Filter
                            selectedValue={token}
                            onChange={handleTokenChange}
                            name="Сеть"
                            filters={getCexFilters(chain).map((token) => {
                                return {
                                    name: token,
                                    icon: ''
                                };
                            })}
                        />
                    )}
                    {chain && <ClearFilters onClear={clearFilters} />}
                </div>
                <div className="hidden md:block relative">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#121212]">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`p-3 text-left text-[#7E7E7E] first: last:-r-md ${
                                                header.column.getCanSort() ? 'cursor-pointer' : ''
                                            }`}
                                            style={{ width: header.getSize() }}
                                            onClick={!chain && !token ? header.column.getToggleSortingHandler() : () => null}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && !chain && !token && (
                                                    <span>
                                                        {
                                                            {
                                                                asc: <SortAsc className="w-4 h-4" />,
                                                                desc: <SortDesc className="w-4 h-4" />,
                                                                false: <FilterIcon className="w-4 h-4" />
                                                            }[header.column.getIsSorted() || false]
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {visibleRows.map((row) => (
                                <Fragment key={row.id}>
                                    <tr className="hover:bg-[#333333] bg-[#282828] -md align-middle">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                onClick={() => window.open(row.original.link)}
                                                className="p-3 cursor-pointer first: last:-r-md"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    {row.getIsExpanded() && row.original.children && (
                                        <tr className="bg-[#303030] align-start relative -top-[11px]">
                                            {row.original.children.map((child, index) => {
                                                if (!child.name) return null;
                                                const content = child.content || '';
                                                const data = content.includes('Подробнее') ? parse(child.content, options) : child.content;
                                                const finalData = Array.isArray(content)
                                                    ? data.map((item) => (
                                                          <div key={item.title} className="p-1 mb-1">
                                                              <p className="text-[#7E7E7E]">{item.date}:</p>
                                                              <p>{item.title}</p>
                                                          </div>
                                                      ))
                                                    : data;
                                                return (
                                                    <td key={child.name} colSpan={child.colSpan} className="p-3 align-text-top">
                                                        <div key={index} className="flex flex-col justify-between">
                                                            <h4 className="font-medium mb-2 text-[#7E7E7E]">{child.name}</h4>
                                                            <div className="gap-3 text-white">
                                                                {child.name === 'Как заработать' ? (
                                                                    <button
                                                                        className="bg-[#121212] flex items-center gap-1 transition max-w-max h-[30px] p-2 mt-4 cursor-pointer text-[14px]"
                                                                        onClick={() => {
                                                                            setIsOpenEarningModal(true);
                                                                            setOpenedEarnings(row.original.earnings);
                                                                        }}
                                                                    >
                                                                        Cпособы заработка
                                                                    </button>
                                                                ) : Array.isArray(child.content) ? (
                                                                    finalData
                                                                ) : (
                                                                    data
                                                                )}
                                                            </div>
                                                            {child.name.includes('Случаи') && (
                                                                <button
                                                                    className="bg-[#121212] flex items-center gap-1 transition max-w-max h-[30px] p-2 mt-4 cursor-pointer text-[14px]"
                                                                    onClick={() => {
                                                                        setSelectedBreachData(child.content);
                                                                        toggleBreachModal();
                                                                    }}
                                                                >
                                                                    Подробнее
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                            {blurredRows.length > 0 && (
                                <>
                                    {blurredRows.map((row) => (
                                        <Fragment key={row.id + 'blured'}>
                                            <tr className="bg-[#282828] -md align-middle blur-sm">
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="p-3 first: last:-r-md">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                            {row.getIsExpanded() && row.original.children && (
                                                <tr className="bg-[#303030] align-start relative -top-[11px] blur-sm">
                                                    {row.original.children.map((child, index) => (
                                                        <td key={child.name} colSpan={child.colSpan} className="p-3 align-text-top">
                                                            <div className="flex flex-col justify-between">
                                                                <h4 className="font-medium mb-2 text-white">{child.name}</h4>
                                                                <div className="gap-3 text-white">{child.content}</div>
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">
                                            <Link
                                                href="https://t.me/your_telegram_bot"
                                                target="_blank"
                                                className="text-white bg-[#0088cc] px-4 py-2 -md hover:bg-[#0077b3] absolute left-[50%] top-[65%] -translate-x-1/2"
                                            >
                                                Увидеть больше? Переходите в нашего ТГ бота
                                            </Link>
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {visibleRows.map((row) => (
                        <div key={row.id} className="bg-[#282828] p-4 cursor-pointer hover:bg-[#333333] transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div className="relative flex items-center gap-3 justify-between">
                                        <div className="flex gap-2 items-center">
                                            {row.original.icon && (
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    src={row.original.icon}
                                                    alt={row.original.id}
                                                    className="object-contain rounded-[3px]"
                                                />
                                            )}
                                            <span className="text-white text-base">{row.original.id}</span>
                                        </div>
                                        {row.original.children && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    row.toggleExpanded();
                                                }}
                                                className="p-2 text-white hover:text-gray-300 transition-colors"
                                                aria-label={row.getIsExpanded() ? 'Свернуть' : 'Развернуть'}
                                                aria-expanded={row.getIsExpanded()}
                                            >
                                                {row.getIsExpanded() ? (
                                                    <ChevronUp className="w-6 h-6" />
                                                ) : (
                                                    <ChevronDown className="w-6 h-6" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-[30%_30%_30%] justify-between w-full mt-3 items-start">
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Комиссия:</span>
                                            <div className="text-[12px] mt-2">
                                                {(() => {
                                                    const exchangeName = row.original.id;
                                                    const feeData = withdrawalFees[exchangeName];

                                                    if (!feeData) {
                                                        return row.original.commision;
                                                    }

                                                    return (
                                                        <>
                                                            <div>
                                                                {feeData.tokenAmount} {chain}
                                                            </div>
                                                            <div className="text-[#7E7E7E]">${feeData.usdAmount.toFixed(2)}</div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Субаккаунты:</span>
                                            <span className="text-[12px] mt-2">{row.original.subAccounts}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Назначение:</span>
                                            <span className="text-[12px] mt-2">{row.original.purpose}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {row.getIsExpanded() && row.original.children && (
                                <div
                                    className="mt-4 space-y-4 animate-slideDown grid grid-cols-[30%_30%_30%] justify-between w-full items-start"
                                    style={{
                                        animation: row.getIsExpanded() ? 'slideDown 0.3s ease-in-out' : 'slideUp 0.3s ease-in-out'
                                    }}
                                >
                                    <div className="">
                                        <span className="text-[#7E7E7E] text-[12px]">Ограничения:</span>
                                        <div className="text-[12px] mt-2">
                                            {row.original.restrictions ? (
                                                <div className="flex flex-col justify-start">
                                                    <span>{row.original.restrictions}</span>
                                                    <button className="bg-[#121212] p-2 mt-3 cursor-pointer inline-block w-max text-white text-[12px]">
                                                        Подробнее
                                                    </button>
                                                </div>
                                            ) : (
                                                <span>—</span>
                                            )}
                                        </div>
                                    </div>
                                    {row.original.children.map((child, index) => {
                                        if (!child.name) return null;
                                        const content = child.content || '';
                                        const data = content.includes('Подробнее') ? parse(child.content, options) : child.content;
                                        const finalData = Array.isArray(content)
                                            ? data.map((item) => (
                                                  <div key={item.title}>
                                                      <p className="text-[#7E7E7E]">{item.date}:</p>
                                                      <p>{item.title}</p>
                                                  </div>
                                              ))
                                            : data;
                                        return (
                                            <div key={index} className="flex flex-col justify-between">
                                                <h4 className="text-[#7E7E7E] text-[12px] mb-2">{child.name}</h4>
                                                <div className="gap-3 text-white text-[12px]">
                                                    {child.name === 'Как заработать' ? (
                                                        <button
                                                            className="bg-[#121212] flex items-center gap-1 transition max-w-max h-[30px] p-2 cursor-pointer text-[12px]"
                                                            onClick={() => {
                                                                setIsOpenEarningModal(true);
                                                                setOpenedEarnings(row.original.earnings);
                                                            }}
                                                        >
                                                            Способы заработка
                                                        </button>
                                                    ) : Array.isArray(child.content) ? (
                                                        finalData
                                                    ) : (
                                                        data
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                    {blurredRows.length > 0 && (
                        <>
                            {blurredRows.map((row) => (
                                <div key={row.id} className="bg-[#282828] p-4 blur-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="w-full">
                                            <div className="relative flex items-center gap-3 justify-between">
                                                <div className="flex gap-2 items-center">
                                                    {row.original.icon && (
                                                        <Image
                                                            width={20}
                                                            height={20}
                                                            src={row.original.icon}
                                                            alt={row.original.id}
                                                            className="object-contain rounded-[3px]"
                                                        />
                                                    )}
                                                    <span className="text-white text-base">{row.original.id}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[30%_30%_30%] justify-between w-full mt-3 items-start">
                                                <div className="flex flex-col gap-1 min-h-[60px]">
                                                    <span className="text-[#7E7E7E] text-[12px]">Комиссия:</span>
                                                    <div className="text-[12px] mt-2">
                                                        {(() => {
                                                            const exchangeName = row.original.id;
                                                            const feeData = withdrawalFees[exchangeName];

                                                            if (!feeData) {
                                                                return row.original.commision;
                                                            }

                                                            return (
                                                                <>
                                                                    <div>
                                                                        {feeData.tokenAmount} {chain}
                                                                    </div>
                                                                    <div className="text-[#7E7E7E]">${feeData.usdAmount.toFixed(2)}</div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 min-h-[60px]">
                                                    <span className="text-[#7E7E7E] text-[12px]">Субаккаунты:</span>
                                                    <span className="text-[12px] mt-2">{row.original.subAccounts}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 min-h-[60px]">
                                                    <span className="text-[#7E7E7E] text-[12px]">Назначение:</span>
                                                    <span className="text-[12px] mt-2">{row.original.purpose}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <span className="text-[#7E7E7E] text-[12px]">Ограничения:</span>
                                                <div className="text-[12px] mt-2">
                                                    {row.original.restrictions ? row.original.restrictions : '—'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="text-center py-4">
                                <Link
                                    href="https://t.me/your_telegram_bot"
                                    target="_blank"
                                    className="text-white bg-[#0088cc] px-4 py-2 rounded-md hover:bg-[#0077b3]"
                                >
                                    Увидеть больше? Переходите в нашего ТГ бота
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </CategoriesLayout>
    );
}

export default Page;
