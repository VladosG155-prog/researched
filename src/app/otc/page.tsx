'use client';
import { createColumnHelper, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import otcData from '../../../data/otc.json';
import CategoriesLayout from '../categories/layout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import parse, { domToReact } from 'html-react-parser';
import Tooltip from '@/components/tooltip';

const dataNew = Object.entries(otcData.Data.otc.tools);
const options = {
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
function Page() {
    const columnHelper = createColumnHelper<any>();
    const router = useRouter();
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const mappedData = useMemo(() => {
        return dataNew.map((elem, index) => {
            const [key, data] = elem;
            return {
                id: key,
                faunder: data.founder,
                fee: data.commission,
                answerTime: data.responseTime,
                icon: data.icon,
                link: data.link,
                children: [
                    { name: 'Сообщений в день', content: data.messagesPerDay, colSpan: 1 },
                    { name: 'Продают', content: data.mainOffers, colSpan: 4 }
                ] // Добавляем комиссию как дочерний элемент
            };
        });
    }, []);

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'Сервис',
                size: 250,
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-3">
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
            columnHelper.accessor('faunder', {
                header: 'Основатель',
                size: 300,
                cell: (info) => <span className="text-white">{parse(info.getValue(), options)}</span>
            }),
            columnHelper.accessor('fee', {
                header: 'Комиссия',
                size: 300,
                cell: (info) => <span className="text-white">{parse(info.getValue(), options)}</span>
            }),
            columnHelper.accessor('answerTime', {
                header: 'Время ответа',
                cell: (info) => <span className="text-white">{parse(info.getValue(), options)}</span>
            }),
            columnHelper.display({
                id: 'expand',
                header: '',
                size: 50,
                cell: ({ row }) => {
                    const canExpand = !!row.original.children;
                    return (
                        <button
                            onClick={(e) => {
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
        []
    );

    const table = useReactTable({
        data: mappedData,
        columns,
        state: { expanded },
        onExpandedChange: setExpanded,
        getRowCanExpand: (row) => !!row.original.children,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel()
    });

    function handleRowClick(link: string): void {
        window.open(link);
    }

    return (
        <CategoriesLayout title={otcData.Data.otc.info.title} description={otcData.Data.otc.info.description}>
            <div className="py-6">
                {/* Desktop View */}
                <div className="hidden md:block">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#121212] ">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="p-3 text-left text-[#7E7E7E] text-[18px] font-normal"
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
                                <>
                                    <tr
                                        key={row.id}
                                        className="hover:bg-[#333333] bg-[#282828] cursor-pointer"
                                        onClick={() => handleRowClick(row.original.link)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="p-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    {row.getIsExpanded() && row.original.children && (
                                        <tr className="bg-[#303030] align-start relative -top-[11px]">
                                            {row.original.children.map((child, index) => {
                                                if (!child.name) return null;
                                                const content = child.content || '';
                                                const data = child.content;
                                                const finalData = Array.isArray(content)
                                                    ? data.map((item) => (
                                                          <Tooltip key={item.name} content={item.name}>
                                                              <Image
                                                                  className="w-[20px] h-[20px]"
                                                                  alt={item.name}
                                                                  width={20}
                                                                  height={20}
                                                                  src={item.icon}
                                                              />
                                                          </Tooltip>
                                                      ))
                                                    : data;
                                                return (
                                                    <td key={child.name} colSpan={child.colSpan} className="p-3 align-text-top">
                                                        <div key={index} className="flex flex-col justify-between">
                                                            <h4 className="font-medium mb-2 text-[#7E7E7E]">{child.name}</h4>
                                                            {Array.isArray(child.content) ? (
                                                                <div className="flex gap-3 flex-wrap">{finalData}</div>
                                                            ) : (
                                                                <div className="gap-3 text-white">{data}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )}
                                </>
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
                            onClick={() => handleRowClick(row.original.link)}
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
                                    <div className="grid grid-cols-[100%] justify-between w-full mt-3 items-start">
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px] font-medium">Основатель:</span>
                                            <div className="text-[12px] mt-2 text-white">{parse(row.original.faunder, options)}</div>
                                        </div>
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px] font-medium">Комиссия:</span>
                                            <div className="text-[12px] mt-2 text-white">{parse(row.original.fee, options)}</div>
                                        </div>
                                        <div className="flex flex-col gap-1 min-h-[60px]">
                                            <span className="text-[#7E7E7E] text-[12px] font-medium">Время ответа:</span>
                                            <div className="text-[12px] mt-2 text-white">{parse(row.original.answerTime, options)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {row.getIsExpanded() && row.original.children && (
                                <div
                                    className="mt-4 space-y-4 animate-slideDown grid grid-cols-[100%] justify-between w-full items-start"
                                    style={{
                                        animation: row.getIsExpanded() ? 'slideDown 0.3s ease-in-out' : 'slideUp 0.3s ease-in-out'
                                    }}
                                >
                                    {row.original.children.map((child, index) => (
                                        <div key={index} className="flex flex-col justify-between">
                                            <h4 className="text-[#7E7E7E] text-[12px] mb-2">{child.name}</h4>
                                            {Array.isArray(child.content) ? (
                                                <div className="flex gap-3 flex-wrap">
                                                    {child.content.map((item) => (
                                                        <Tooltip key={item.name} content={item.name}>
                                                            <Image
                                                                className="w-5 h-5 object-contain"
                                                                alt={item.name}
                                                                width={20}
                                                                height={20}
                                                                src={item.icon}
                                                            />
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-white text-[12px]">{parse(child.content, options)}</div>
                                            )}
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
