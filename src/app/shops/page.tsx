'use client';
import { createColumnHelper, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import shopsData from '../../../data/accshop.json';
import CategoriesLayout from '../categories/layout';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import PromoPopup from '@/components/promo-popup';
import Tooltip from '@/components/tooltip';
import { useRouter } from 'next/navigation';
import { TopPlace } from '@/components/top-place';
import { getAccShopsPromocodes } from '@/utils/get-promocodes';
import { getCategoriesFilter, getCategoriesItemsFilter } from '@/utils/get-accShops-filters';
import { Filter } from '@/components/filter';
import { ClearFilters } from '@/components/clear-filters';
import { getUniquePayments } from '@/utils/get-payments';
import { ProductsModal } from '@/components/products-modal';
import useIsMobile from '@/hooks/useIsMobile';

const dataNew = Object.entries(shopsData.Data.accountStores.tools);

const accShops = getAccShopsPromocodes();

function Page() {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [openedPromocode, setOpenedPromocode] = useState({});
    const [activeCategory, setActiveCategory] = useState('');
    const [activeCategoryItem, setActiveCategoryItem] = useState('');
    const [payment, setPayment] = useState('');

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isOpenProductModal, setIsOpenProductModal] = useState(false);

    const isMobile = useIsMobile();

    const router = useRouter();

    const mappedData = useMemo(() => {
        let data = dataNew.map((elem) => {
            const [key, data] = elem;
            return {
                id: key,
                bestPrice: data.bestPrice,
                support: data.support,
                icon: data.icon,
                link: data.link,
                categories: Object.keys(data.productsByCategory),
                payments: data.payment,
                products: Object.values(data.productsByCategory).flatMap((item) => item.trim().split(',')),
                promocodeInfo: accShops?.find((item) => item[0] === key),
                children: [...data.payment],
                sell: data.sell
            };
        });

        if (activeCategory) {
            data = data.filter((elem) => elem.categories.includes(activeCategory));
        }

        if (activeCategoryItem) {
            data = data.filter((elem) => elem.products.includes(activeCategoryItem));
        }

        if (payment) {
            data = data.filter((item) => item.payments.some((pay) => pay.name === payment));
        }

        return data;
    }, [dataNew, activeCategory, activeCategoryItem, payment]);

    const columnHelper = createColumnHelper<any>();

    const toggleModal = () => {
        setIsOpenModal((prev) => !prev);
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'Сервис',
                size: 250,
                cell: ({ row }) => {
                    return (
                        <div>
                            {row.original.id === 'Dark Store' && (
                                <p className="text-[10px] mb-4 bg-[#D06E31] text-center  px-2 absolute left-0 top-0">
                                    Лучший магазин для всех целей
                                </p>
                            )}
                            {row.original.id === 'Discord-accounts' && (
                                <p className="text-[10px] mb-4 bg-[#D06E31] text-center px-2 absolute left-0 top-0">
                                    Лучший магазин для Discord&apos;ов
                                </p>
                            )}
                            <div className={`flex items-center gap-3 ${row.original.id === 'Discord-accounts' ? 'pt-5' : ''}`}>
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
            columnHelper.accessor('sell', {
                header: 'Товары',
                size: 250,
                cell: (info) => (
                    <div className="flex flex-col">
                        {info.getValue()}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProducts(info.row.original.products);
                                setIsOpenProductModal(true);
                            }}
                            className="bg-[#121212] p-2 mt-3 cursor-pointer text-[14px] inline-block max-w-max"
                        >
                            Все товары
                        </button>
                    </div>
                )
            }),
            columnHelper.accessor('support', {
                header: 'Тех.поддержка',
                size: 100,
                cell: (info) => <span className="text-white">{info.getValue()}</span>
            }),
            columnHelper.accessor('payments', {
                header: 'Оплата',
                size: 200,
                cell: (info) => (
                    <div className="flex items-center flex-wrap">
                        {info.row.original.payments.map((child) => (
                            <Tooltip key={child.name} position="top" content={child.name}>
                                <div className="flex items-center justify-center w-8 h-8">
                                    <Image
                                        width={20}
                                        height={20}
                                        alt={child.name}
                                        src={child.icon}
                                        className="object-contain max-w-full max-h-full"
                                    />
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                )
            })
        ],
        []
    );

    const table = useReactTable({
        data: mappedData,
        columns,
        state: {
            expanded
        },
        onExpandedChange: (newExpanded) => {
            setExpanded(newExpanded);
        },
        getRowCanExpand: (row) => !!row.original.children,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel()
    });

    const categories = getCategoriesFilter();
    const categoriesItems = getCategoriesItemsFilter(activeCategory);

    const clearAll = () => {
        setActiveCategory('');
        setActiveCategoryItem('');
        setPayment('');
    };

    const payments = getUniquePayments(shopsData.Data.accountStores.tools);

    return (
        <CategoriesLayout title={shopsData.Data.accountStores.info.title} description={shopsData.Data.accountStores.info.description}>
            <ProductsModal
                isOpen={isOpenProductModal}
                onClose={() => setIsOpenProductModal(false)}
                products={selectedProducts}
                title="Товары"
            />
            {isMobile ? (
                <div className="flex flex-wrap gap-2 justify-between">
                    <div className="w-[48%]">
                        <Filter
                            name="Категория"
                            filters={categories}
                            selectedValue={activeCategory}
                            onChange={(val) => {
                                setActiveCategoryItem('');
                                setActiveCategory(val);
                            }}
                        />
                    </div>
                    <div className="w-[48%]">
                        <Filter filters={payments} selectedValue={payment} onChange={setPayment} name="Оплата" />
                    </div>
                    {activeCategory && (
                        <Filter
                            name="Товар"
                            filters={categoriesItems}
                            selectedValue={activeCategoryItem}
                            onChange={setActiveCategoryItem}
                        />
                    )}
                </div>
            ) : null}
            {!isMobile && (
                <div className="flex gap-2 flex-wrap">
                    <Filter
                        name="Категория"
                        filters={categories}
                        selectedValue={activeCategory}
                        onChange={(val) => {
                            setActiveCategoryItem('');
                            setActiveCategory(val);
                        }}
                    />
                    {activeCategory && (
                        <Filter
                            name="Товар"
                            filters={categoriesItems}
                            selectedValue={activeCategoryItem}
                            onChange={setActiveCategoryItem}
                        />
                    )}
                    <Filter filters={payments} selectedValue={payment} onChange={setPayment} name="Оплата" />
                </div>
            )}
            <div className="mt-2">{(activeCategory || payment) && <ClearFilters onClear={clearAll} />}</div>
            <PromoPopup isOpen={isOpenModal} onClose={toggleModal} info={openedPromocode} />
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
                                            className="p-3 text-left text-[#7E7E7E] first: last:-r-md"
                                            style={{ width: header.getSize() }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <tr className="hover:bg-[#333333] bg-[#282828] -md relative">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                onClick={() => {
                                                    router.push(row.original.link);
                                                }}
                                                className="p-3 cursor-pointer first: last:-r-md"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
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
                            className="bg-[#282828] p-4 cursor-pointer hover:bg-[#333333] transition-colors"
                            onClick={() => router.push(row.original.link)}
                        >
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
                                    <div className="grid grid-cols-[50%_50%] justify-between w-full mt-3 items-start">
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Товары:</span>
                                            <div className="text-[12px] mt-2 flex-col flex">
                                                {row.original.products.slice(0, 5).map((category, index) => (
                                                    <span key={category} className="text-white">
                                                        {category}
                                                        {row.original.products.slice(0, 5).length - 1 !== index ? ',' : ''}
                                                    </span>
                                                ))}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedProducts(row.original.products);
                                                        setIsOpenProductModal(true);
                                                    }}
                                                    className="bg-[#121212] p-2 mt-2 cursor-pointer text-[12px] inline-block max-w-max"
                                                >
                                                    Подробнее
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px]">Тех.поддержка:</span>
                                            <span className="text-[12px] mt-2">{row.original.support}</span>
                                        </div>
                                    </div>
                                    {/* {row.original?.promocodeInfo && row.original?.promocodeInfo[1] && (
                                        <button
                                            className="flex items-center bg-[#DEDEDE] mt-3 cursor-pointer p-[5px]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleModal();
                                                setOpenedPromocode(row.original.promocodeInfo[1]);
                                            }}
                                        >
                                            <span className="font-normal text-[12px] text-black">
                                                {row.original?.promocodeInfo[1].buttonName}
                                            </span>
                                        </button>
                                    )} */}
                                </div>
                            </div>
                            {row.getIsExpanded() && row.original.children && (
                                <div
                                    className="mt-4 space-y-4 animate-slideDown grid grid-cols-[100%] justify-between w-full items-start"
                                    style={{
                                        animation: row.getIsExpanded() ? 'slideDown 0.3s ease-in-out' : 'slideUp 0.3s ease-in-out'
                                    }}
                                >
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-[#7E7E7E] text-[12px] mb-2">Оплата</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {row.original.children.map((child) => (
                                                <Tooltip key={child.name} position="top" content={child.name}>
                                                    <div className="flex items-center justify-center w-8 h-8">
                                                        <Image
                                                            width={20}
                                                            height={20}
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
