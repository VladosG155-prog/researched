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
import proxyData from '../../../data/resedentialproxy.json';
import proxyScoreData from '../../../data/RS_Score_Proxy.json';
import CategoriesLayout from '../categories/layout';
import { ChevronDown, ChevronUp, Eye, FilterIcon, Gift, SortAsc, SortDesc } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import PromoPopup from '@/components/promo-popup';
import Tooltip from '@/components/tooltip';
import { getProxyCountries } from '@/utils/get-proxy-countries-data';
import { Filter } from '@/components/filter';
import { ClearFilters } from '@/components/clear-filters';
import { usePathname, useRouter } from 'next/navigation';
import Score from '@/components/score';
import { getResidentialProxy } from '@/utils/get-promocodes';
import { TopPlace } from '@/components/top-place';
import { CountryPopup } from '@/components/contry-popup/country-popup';
import { getUniquePayments } from '@/utils/get-payments';
import useIsMobile from '@/hooks/useIsMobile';
import { MobileProxyFilters } from '@/components/mobile-proxy-filter';
const dataStatic = Object?.entries(proxyData.Data.proxy.residentialProxy.tools) || {};
const residentialProxiex = getResidentialProxy();
const PROXY_FILTERS = [
    { name: 'Статические', link: 'proxy-static' },
    { name: 'Резидентские', link: 'proxy-residential' },
    { name: 'Мобильные', link: 'proxy-mobile' },
    { name: 'Для DePIN', link: 'proxy-depin' }
];

function Page() {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [openedPromocode, setOpenedPromocode] = useState({});
    const [countryFilter, setCountryFilter] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isOpenCountriesModal, setIsOpenCoutriesModal] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [payment, setPayment] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const isMobile = useIsMobile();
    const router = useRouter();
    const pathname = usePathname();
    const mappedData = useMemo(() => {
        let data = dataStatic?.map(([name, newData]) => {
            return {
                id: name,
                price: newData.price,
                support: newData.support || '',
                promocodeInfo: residentialProxiex?.find((item) => item[0] === name),
                fraudscore: proxyScoreData.residential.find((item) => item.name === name)?.overall || '-',
                fraudData: proxyScoreData.residential.find((item) => item.name === name) || {},
                payments: newData.payment,
                children: [...newData.payment] || [],
                countries: newData?.countries,
                icon: newData.icon,
                demo: newData?.demo,
                link: newData.link
            };
        });

        if (countryFilter) {
            data = data.filter((item) => item.countries.some((country) => country.name === countryFilter));
        }

        if (payment) {
            data = data.filter((item) => item.payments.some((pay) => pay.name === payment));
        }

        return data;
    }, [countryFilter, payment]);

    const columnHelper = createColumnHelper();

    const toggleModal = () => {
        setIsOpenModal((prev) => !prev);
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'Сервис',
                size: 270,
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div>
                            <div className="flex items-center gap-3">
                                {row.index <= 2 && !sorting?.length && !countryFilter && <TopPlace place={row.index + 1} />}
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
                            {row.original?.promocodeInfo && row.original?.promocodeInfo[1] && (
                                <button className="ml-10 flex items-center  bg-[#DEDEDE] mt-3 cursor-pointer p-[3px]">
                                    <span
                                        className="font-normal text-[12px] text-black "
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleModal();

                                            setOpenedPromocode(row.original.promocodeInfo[1]);
                                        }}
                                    >
                                        {row.original?.promocodeInfo[1] && row.original.promocodeInfo[1].buttonName}
                                    </span>
                                </button>
                            )}
                        </div>
                    );
                }
            }),
            columnHelper.accessor('price', {
                header: 'Цена',
                size: 300,
                cell: (info) => <span className="text-white">{info.getValue()}</span>,
                enableSorting: true,
                sortDescFirst: true
            }),

            columnHelper.accessor('countries', {
                header: 'Кол-во стран',
                size: 200,
                cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-center">{row.original.countries.length}</span>{' '}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCountries(row.original.countries);
                                toggleCountriesModal();
                            }}
                            className="text-[14px] cursor-pointer flex items-center gap-3  bg-[#303030] p-2"
                        >
                            <Eye />
                        </button>
                    </div>
                ),
                enableSorting: false
            }),
            columnHelper.accessor('fraudscore', {
                header: 'Researched score',
                size: 300,
                cell: ({ row }) => (
                    <div className="w-[96px]">
                        <Score totalScore={row.original.fraudscore} data={row.original.fraudData} />
                    </div>
                ),
                enableSorting: true,
                sortDescFirst: true
            }),
            columnHelper.accessor('demo', {
                header: 'Демо',
                size: 200,
                cell: (info) => <span className="text-white">{info.getValue()}</span>,
                enableSorting: false
            }),
            columnHelper.accessor('support', {
                header: 'Тех.поддержка',

                cell: (info) => <span className="text-white">{info.getValue()}</span>
            }),
            columnHelper.display({
                id: 'expand',
                header: '',
                cell: ({ row }) => {
                    const canExpand = !!row.original.children;
                    return (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                row.toggleExpanded();
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
        [sorting, countryFilter]
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

    const handleClickFilter = (link: string) => {
        router.push(link);
    };

    const sortColumns = [
        { name: 'Цена', value: 'price' },
        { name: 'Researched score', value: 'fraudscore' }
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
    const countries = useMemo(() => getProxyCountries(), []);

    const clearFilters = () => {
        setCountryFilter('');
        setPayment('');
        setSorting([]);
        setSortColumn('');
    };
    const toggleCountriesModal = () => {
        setIsOpenCoutriesModal((prev) => !prev);
    };
    const payments = getUniquePayments(proxyData.Data.proxy.residentialProxy.tools);
    return (
        <CategoriesLayout
            title={proxyData.Data.proxy.residentialProxy.info.title || ''}
            description={proxyData.Data.proxy.residentialProxy.info.description || ''}
        >
            <CountryPopup isOpen={isOpenCountriesModal} onClose={toggleCountriesModal} countries={selectedCountries} />
            <PromoPopup isOpen={isOpenModal} onClose={toggleModal} info={openedPromocode} />
            {isMobile && <MobileProxyFilters filters={PROXY_FILTERS} pathname={pathname} handleClickFilter={handleClickFilter} />}
            <div className="flex gap-3 mb-4 items-center flex-wrap w-full">
                {isMobile ? (
                    <>
                        <div className="flex w-full gap-[8px]">
                            {' '}
                            <div className="w-1/2">
                                {' '}
                                <Filter
                                    selectedValue={countryFilter}
                                    onChange={setCountryFilter}
                                    name="Страна"
                                    filters={countries}
                                    showSearch={true}
                                />
                            </div>
                            <div className="w-1/2">
                                <Filter filters={payments} selectedValue={payment} onChange={setPayment} name="Оплата" />
                            </div>
                        </div>
                        <div className="w-full">
                            {' '}
                            <Filter
                                filters={sortColumns}
                                selectedValue={sortColumn}
                                onChange={handleSortColumnChange}
                                name="Сортировка"
                                showSearch={false}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <Filter
                            selectedValue={countryFilter}
                            onChange={setCountryFilter}
                            name="Страна"
                            filters={countries}
                            showSearch={true}
                        />
                        <Filter filters={payments} selectedValue={payment} onChange={setPayment} name="Оплата" />
                    </>
                )}

                {(countryFilter || payment || sortColumn) && <ClearFilters onClear={clearFilters} />}
            </div>
            {!isMobile && (
                <div className="flex justify items-center gap-4 flex-wrap">
                    {PROXY_FILTERS.map((proxy) => (
                        <button
                            onClick={() => handleClickFilter(proxy.link)}
                            className={`h-[50px] relative w-full max-w-[150px] ${
                                '/' + proxy.link === pathname ? 'bg-[#DEDEDE] text-black' : 'bg-[#2C2C2C] text-white'
                            }`}
                            key={proxy.name}
                        >
                            {proxy.name}
                            {proxy.link === 'proxy-depin' && (
                                <Image
                                    className="absolute top-0 h-[85px] w-full"
                                    alt="grass"
                                    width={10}
                                    height={10}
                                    src="/grasstobutton.png"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
            <div className="py-4">
                {/* Desktop View */}
                <div className="hidden md:block">
                    <table className="w-full border-separate border-spacing-y-2 ">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#121212] ">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`p-3 text-left text-[#7E7E7E] first: last:-r-md ${
                                                header.column.getCanSort() ? 'cursor-pointer' : ''
                                            }`}
                                            style={{ width: header.getSize() }}
                                            onClick={header.column.getToggleSortingHandler()}
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
                                    <tr
                                        onClick={() => {
                                            window.open(row.original.link);
                                        }}
                                        className="hover:bg-[#333333] bg-[#282828] -md"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="p-3 cursor-pointer first: last:-r-md">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    {row.getIsExpanded() && row.original.children && (
                                        <tr className="bg-[#303030] relative -top-[11px] ">
                                            <td colSpan={columns.length} className="p-3  -b-md">
                                                <h4 className="font-medium mb-2 text-white text-sm">Оплата</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {row.original.children.map((child) => (
                                                        <Tooltip key={child.name} position="top" content={child.name}>
                                                            <div className="flex items-center justify-center w-6 h-6">
                                                                <Image
                                                                    width={16}
                                                                    height={16}
                                                                    alt={child.name}
                                                                    src={child.icon}
                                                                    className="object-contain max-w-full max-h-full"
                                                                />
                                                            </div>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </td>
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
                        <div
                            key={row.id}
                            className="bg-[#282828] p-2 cursor-pointer hover:bg-[#333333] transition-colors"
                            onClick={() => window.open(row.original.link)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div className="relative flex items-center gap-3 justify-between">
                                        <div className="flex gap-2">
                                            {' '}
                                            {!sorting?.length && !countryFilter && !payment && row.index <= 2 && (
                                                <TopPlace place={row.index + 1} />
                                            )}
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
                                    <div className="grid grid-cols-[30%_20%_24%_24%] justify-between w-full">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[#7E7E7E] text-[12px]">RS score:</span>
                                            <Score totalScore={row.original.fraudscore} data={row.original.fraudData} />
                                        </div>

                                        <p className="text-[14px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Цена:</span> <br />
                                            <span className="text-[12px]">{row.original.price}</span>
                                        </p>

                                        <p className="text-[14px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Демо:</span> <br />
                                            <span className="text-[12px]">{row.original.demo || '—'}</span>
                                        </p>

                                        <div className="flex justify-end">
                                            {row.original?.promocodeInfo && row.original?.promocodeInfo[1] && (
                                                <button
                                                    className="bg-[#DEDEDE] cursor-pointer p-2 h-[50px] max-w-[50px]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleModal();
                                                        setOpenedPromocode(row.original.promocodeInfo[1]);
                                                    }}
                                                    aria-label="Открыть промокод"
                                                >
                                                    <Gift className="text-black" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {row.getIsExpanded() && row.original.children && (
                                <div
                                    className="mt-4 space-y-4 animate-slideDown grid grid-cols-[15%_30%_20%] justify-between w-full"
                                    style={{
                                        animation: row.getIsExpanded() ? 'slideDown 0.3s ease-in-out' : 'slideUp 0.3s ease-in-out'
                                    }}
                                >
                                    <div className="text-white text-sm space-y-3">
                                        <div className="flex flex-col gap-3">
                                            <span className="text-[#7E7E7E] text-[12px]">Кол-во стран:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[12px]">{row.original.countries.length}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCountries(row.original.countries);
                                                        toggleCountriesModal();
                                                    }}
                                                    className="text-[12px] cursor-pointer flex items-center gap-2 bg-[#303030] p-2 rounded-md"
                                                    aria-label="Посмотреть страны"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#7E7E7E]  text-[12px]">Тех.поддержка:</span>
                                        <span className="text-[12px]"> {row.original.support || '—'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[12px] mb-1 text-[#7E7E7E]">Оплата</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {row.original.children.map((child) => (
                                                <Tooltip key={child.name} position="top" content={child.name}>
                                                    <div className="flex items-center justify-center w-5 h-5">
                                                        <Image
                                                            width={16}
                                                            height={16}
                                                            alt={child.name}
                                                            src={child.icon}
                                                            className="object-contain max-w-full max-h-full"
                                                        />
                                                    </div>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
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
