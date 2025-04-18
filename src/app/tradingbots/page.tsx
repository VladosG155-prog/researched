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
import botsData from '../../../data/tradebots.json';
import CategoriesLayout from '../categories/layout';
import { ChevronDown, ChevronUp, FilterIcon, SortAsc, SortDesc } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import PromoPopup from '@/components/promo-popup';
import { useRouter } from 'next/navigation';
import { Filter } from '@/components/filter';
import { getTradingBotsNetwork } from '@/utils/get-networks-data';
import { getTradingBotsInterface } from '@/utils/get-bot-data';
import { ClearFilters } from '@/components/clear-filters';
import { TopPlace } from '@/components/top-place';
import Modal from '@/components/modal';
import useIsMobile from '@/hooks/useIsMobile';

const dataNew = Object.entries(botsData.Data.tradingBots.tools);
const bullXLink = {
    manager: 'https://t.me/BullXHelpBot?start=access_NRSQ7LRW3D9',
    client: 'https://t.me/BullxBetaBot?start=access_NRSQ7LRW3D9'
};
function Page() {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedInterface, setSelectedInterface] = useState('');
    const [sorting, setSorting] = useState([]);
    const [isShowSpeedModal, setIsShowSpeedModal] = useState(false);
    const [sortColumn, setSortColumn] = useState('');
    const isMobile = useIsMobile();
    const [isOpenBullX, setIsOpenBullX] = useState(false);

    const router = useRouter();

    const mappedData = useMemo(() => {
        let data = dataNew.map((elem) => {
            const [key, data] = elem;
            return {
                id: key,
                fees: data.commission,
                speed: data!.speedInfo || 'Нет информации',
                chains: data.networks,
                children: [
                    { name: 'Реферальная программа', content: data.referral, colSpan: 2 },
                    { name: 'Интерфейс', content: data.interface, colSpan: 1 },
                    { name: 'Шанс дропа', content: data.airdropChance || 'Нет информации', colSpan: 1 },
                    { name: 'Функционал', content: data.features, colSpan: 2 }
                ],
                icon: data.icon,
                link: data.link,
                speedCopy: data.copytradingSpeed,
                interface: data.interface,
                features: data!.features || 'Нет информации'
            };
        });

        if (selectedFilter) {
            data = data.filter((elem) => elem.chains.some((chain) => chain.name === selectedFilter));
        }

        if (selectedInterface) {
            data = data.filter((elem) => elem.interface.includes(selectedInterface));
        }

        return data;
    }, [selectedFilter, selectedInterface]);

    const columnHelper = createColumnHelper();

    const toggleModal = (e) => {
        setIsOpenModal((prev) => !prev);
        e.stopPropagation();
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'Сервис',
                size: 250,
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            {row.index <= 2 && !sorting.length && !selectedFilter && !selectedInterface && (
                                <TopPlace place={row.index + 1} />
                            )}
                            {row.original.icon && (
                                <Image
                                    width={25}
                                    height={25}
                                    src={row.original.icon}
                                    alt={row.original.id}
                                    className="object-contain rounded-[3px]"
                                />
                            )}
                            <span className="text-white">{row.original.id}</span>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('fees', {
                header: 'Комиссия',
                size: 150,
                maxSize: 150,
                cell: (info) => <span className="text-white">{info.getValue()}</span>,
                enableSorting: true,
                sortDescFirst: true
            }),
            columnHelper.accessor('speed', {
                header: 'Скорость',
                size: 150,
                cell: ({ row }) => {
                    return (
                        <span className="text-white">
                            <div>
                                {row.original.speed.map((item, index) => {
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <p>{item.value}</p>
                                            <Image width={15} height={15} src={item?.network?.icon} alt={item?.network?.name} />
                                        </div>
                                    );
                                })}
                            </div>
                        </span>
                    );
                },
                enableSorting: true,
                sortDescFirst: true
            }),
            columnHelper.accessor('speedCopy', {
                header: 'Скорость копитрейдинга',
                size: 150,
                minSize: 150,
                maxSize: 150,
                cell: ({ row }) => (
                    <span className="text-white">
                        {row.original.speedCopy.length > 0 ? (
                            <div>
                                {row.original.speedCopy.map((item, index) => {
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <p>{item.blocks}</p>
                                            <Image width={15} height={15} src={item?.network?.icon} alt={item?.network?.name} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            'Нет копитрейдинга'
                        )}
                    </span>
                ),
                enableSorting: true,
                sortDescFirst: true
            }),
            columnHelper.accessor('chains', {
                header: 'Сети',
                size: 100,
                enableSorting: false,
                cell: (info) => (
                    <div className="flex gap-2 flex-wrap">
                        {info.getValue().map((item, index) => (
                            <Image
                                key={`${item.name} ${index}`}
                                width={20}
                                height={20}
                                alt={item.name}
                                src={item.icon}
                                className="object-contain"
                            />
                        ))}
                    </div>
                )
            }),
            columnHelper.display({
                id: 'expand',
                header: '',
                size: 50,
                cell: ({ row }) => {
                    const canExpand = !!row.original.children;
                    return (
                        <button
                            onClick={() => row.toggleExpanded()}
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
        [sorting, selectedFilter, selectedInterface]
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

    const networks = getTradingBotsNetwork();
    const interfaces = getTradingBotsInterface();

    const sortColumns = [
        { name: 'Комиссия', value: 'fees' },
        { name: 'Скорость', value: 'speed' },
        { name: 'Скорость копитрейдинга', value: 'speedCopy' }
    ];

    const handleSortColumnChange = (value) => {
        setSortColumn(value);

        const val = sortColumns.find((sort) => sort.name === value).value;
        if (val) {
            setSorting([{ id: val, desc: true }]);
        } else {
            setSorting([]);
        }
    };

    const clearFilters = () => {
        setSelectedFilter('');
        setSelectedInterface('');
        setSortColumn('');
    };

    return (
        <CategoriesLayout title={botsData.Data.tradingBots.info.title} description={botsData.Data.tradingBots.info.description}>
            <PromoPopup isOpen={isOpenModal} onClose={toggleModal} />
            <Modal title="Ошибка" isOpen={isShowSpeedModal} onClose={() => setIsShowSpeedModal(false)}>
                <p>Чтобы воспользоваться фильтрами, выберите блокчейн</p>
            </Modal>
            {isOpenBullX && (
                <Modal title="BullX" isOpen={isOpenBullX} onClose={() => setIsOpenBullX((prev) => !prev)}>
                    <div className="flex justify-center items-center gap-3">
                        <button
                            className="mt-4 text-start bg-[#121212] inline-block max-w-max p-4 cursor-pointer"
                            onClick={() => window.open(bullXLink.client)}
                        >
                            Перейти
                        </button>
                        <button
                            className="mt-4 text-start bg-[#121212] inline-block max-w-max p-4 cursor-pointer"
                            onClick={() => window.open(bullXLink.manager)}
                        >
                            Менеджер
                        </button>
                    </div>
                </Modal>
            )}
            <div className="flex gap-3 flex-wrap">
                <Filter onChange={setSelectedFilter} selectedValue={selectedFilter} filters={networks} name="Блокчейн" />
                <Filter onChange={setSelectedInterface} selectedValue={selectedInterface} filters={interfaces} name="Интерфейс" />
                {isMobile && (
                    <div className="mb-5 w-full">
                        <Filter
                            filters={sortColumns}
                            selectedValue={sortColumn}
                            onChange={handleSortColumnChange}
                            name="Сортировка"
                            showSearch={false}
                        />
                    </div>
                )}
                {(selectedFilter || selectedInterface || sortColumn) && <ClearFilters onClear={clearFilters} />}
            </div>
            <div className="py-6">
                {/* Desktop View */}
                <div className="hidden md:block">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#121212]">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            style={{ width: header.column.columnDef.size }}
                                            className={`p-3 text-left text-[#7E7E7E] first: last:-r-md ${
                                                header.column.getCanSort() ? 'cursor-pointer' : ''
                                            }`}
                                            onClick={(e) => {
                                                if ((header.id === 'speed' || header.id === 'speedCopy') && !selectedFilter) {
                                                    setIsShowSpeedModal(true);
                                                    return;
                                                }
                                                header.column.getToggleSortingHandler()(e);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
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
                            {table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <tr className="hover:bg-[#333333] bg-[#282828] -md ">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                onClick={!cell.id.includes('expand') ? () => window.open(row.original.link) : null}
                                                key={cell.id}
                                                className="p-3 first: last:-r-md cursor-pointer"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    {row.getIsExpanded() && row.original.children && (
                                        <tr key="expanded-row" className="bg-[#282828] align-start -top-[11px] relative ">
                                            {row.original.children.map((child, index) => (
                                                <td key={child.name} colSpan={child.colSpan} className="p-3 align-text-top">
                                                    <div className="flex flex-col justify-between">
                                                        <h4 className="font-medium mb-2 text-[#7E7E7E]">
                                                            {child.name}{' '}
                                                            {child.name === 'Реферальная программа' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (row.original.id === 'Bullx') {
                                                                            setIsOpenBullX(true);
                                                                            return;
                                                                        }
                                                                        window.open(row.original.link);
                                                                    }}
                                                                    className="mt-4 text-start bg-[#121212] text-white inline-block max-w-max p-2 text-[14px] cursor-pointer"
                                                                >
                                                                    Вступить
                                                                </button>
                                                            )}
                                                        </h4>
                                                        <div className="gap-3 text-white">{child.content}</div>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {table.getRowModel().rows.map((row) => (
                        <div key={row.id} className="bg-[#282828] p-4 rounded-md">
                            <div className="flex justify-between items-start cursor-pointer" onClick={() => window.open(row.original.link)}>
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center gap-3">
                                        {row.index <= 2 && !sorting.length && !selectedFilter && !selectedInterface && (
                                            <TopPlace place={row.index + 1} />
                                        )}
                                        {row.original.icon && (
                                            <Image
                                                width={25}
                                                height={25}
                                                src={row.original.icon}
                                                alt={row.original.id}
                                                className="object-contain rounded-[3px]"
                                            />
                                        )}
                                        <span className="text-white font-medium">{row.original.id}</span>
                                    </div>
                                    <div className="text-white text-sm space-y-1">
                                        <p>
                                            <span className="font-medium text-[#7E7E7E]">Комиссия:</span> <br />
                                            {row.original.fees}
                                        </p>
                                        <p>
                                            <span className="font-medium text-[#7E7E7E]">Скорость:</span> <br />
                                            {row.original.speed.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span>{item.value}</span>
                                                    <Image
                                                        width={15}
                                                        height={15}
                                                        src={item?.network?.icon}
                                                        alt={item?.network?.name}
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ))}
                                        </p>
                                        <p>
                                            <span className="font-medium text-[#7E7E7E]">Скорость копитрейдинга:</span> <br />
                                            {row.original.speedCopy.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span>{item.blocks}</span>
                                                    <Image
                                                        width={15}
                                                        height={15}
                                                        src={item?.network?.icon}
                                                        alt={item?.network?.name}
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ))}
                                        </p>
                                        <p>
                                            <span className="font-medium text-[#7E7E7E]">Сети:</span>
                                            <div className="flex mt-1 gap-2 items-center flex-wrap">
                                                {row.original.chains.map((item, index) => (
                                                    <Image
                                                        key={`${item.name} ${index}`}
                                                        width={20}
                                                        height={20}
                                                        alt={item.name}
                                                        src={item.icon}
                                                        className="object-contain"
                                                    />
                                                ))}
                                            </div>
                                        </p>
                                    </div>
                                </div>
                                {row.original.children && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            row.toggleExpanded();
                                        }}
                                        className="p-1 text-white"
                                    >
                                        {row.getIsExpanded() ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (row.original.id === 'Bullx') {
                                        setIsOpenBullX(true);
                                        return;
                                    }
                                    window.open(row.original.link);
                                }}
                                className="mt-4 text-start bg-[#121212] inline-block max-w-max p-4 cursor-pointer rounded-md text-white"
                            >
                                Вступить
                            </button>
                            {row.getIsExpanded() && row.original.children && (
                                <div className="mt-3 text-white text-sm space-y-2">
                                    {row.original.children.map((child) => (
                                        <div key={child.name}>
                                            <span className="font-medium text-[#7E7E7E]">{child.name}</span> <br />
                                            <div className="mt-1">{child.content}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </CategoriesLayout>
    );
}

export default Page;
