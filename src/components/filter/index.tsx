'use client';
import { ArrowDownUp, ChevronDown, ChevronUp, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx'; // Убедись, что установлен clsx
import useIsMobile from '@/hooks/useIsMobile';

export function Filter({ name, filters, onChange, selectedValue = '', showSearch = false, isSorting = false }: FilterProps) {
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const filterRef = useRef(null);
    const [searchValue, setSearchValue] = useState('');

    const isMobile = useIsMobile();

    const handleClickFilter = () => {
        setIsOpenFilter((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsOpenFilter(false);
                setSearchValue('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredValue = useMemo(() => {
        if (!searchValue) return filters;
        return filters.filter((filter) => filter.name.toLowerCase().includes(searchValue.toLowerCase()));
    }, [filters, searchValue]);

    return (
        <div ref={filterRef} className={`relative inline-block md:max-w-[250px] w-full ${isSorting && 'max-w-max'}`}>
            <button
                className="bg-[#2C2C2C] w-full cursor-pointer flex gap-3 h-[40px] md:h-[70px] justify-between items-center px-[25px] max-w-full"
                onClick={handleClickFilter}
            >
                {isSorting && isMobile ? <ArrowDownUp /> : selectedValue === '' ? name : selectedValue}{' '}
                {!isSorting ? isOpenFilter ? <ChevronUp /> : <ChevronDown /> : null}
            </button>

            {/* Backdrop for mobile */}
            {isOpenFilter && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => {
                        setIsOpenFilter(false);
                        setSearchValue('');
                    }}
                />
            )}

            {/* Desktop dropdown */}
            {isOpenFilter && (
                <div className="hidden md:block bg-[#2C2C2C] px-[8px] absolute z-50 w-full">
                    {showSearch && (
                        <input
                            className="bg-[#1A1A1A] w-full outline-0 p-[5px] mb-3"
                            placeholder="Поиск"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    )}
                    <ul className="bg-[#2C2C2C] left-0 w-full max-h-[300px] overflow-y-auto overflow-x-hidden">
                        {filteredValue.map((filter, index) => (
                            <li
                                onClick={() => {
                                    onChange(filter.name);
                                    setIsOpenFilter(false);
                                    setSearchValue('');
                                }}
                                key={filter.name + index}
                                className="flex gap-2 px-[5px] md:px-[24px] py-[12px] hover:bg-[#444242] cursor-pointer"
                            >
                                {filter.icon && (
                                    <Image src={filter.icon} alt={filter.name} width={24} height={24} className="object-contain" />
                                )}
                                <span>{filter.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mobile drawer */}
            <div
                className={clsx(
                    'md:hidden fixed bottom-0 left-0 w-full max-h-[70%] bg-[#2C2C2C] z-50 p-4 overflow-y-auto rounded-t-2xl transition-transform duration-300 ease-in-out pb-[50px]',
                    isOpenFilter ? 'translate-y-0' : 'translate-y-[110%]'
                )}
                style={{ transform: isOpenFilter ? 'translateY(0%)' : 'translateY(110%)' }}
            >
                <div className="flex justify-end mb-2">
                    <button onClick={() => setIsOpenFilter(false)}>
                        <X className="text-white" />
                    </button>
                </div>
                {showSearch && (
                    <input
                        className="bg-[#1A1A1A] w-full outline-0 p-[5px] mb-3"
                        placeholder="Поиск"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                )}
                <ul className="w-full pb-[50px]">
                    {filteredValue.map((filter, index) => (
                        <li
                            onClick={() => {
                                onChange(filter.name);
                                setIsOpenFilter(false);
                                setSearchValue('');
                            }}
                            key={filter.name + index}
                            className="flex gap-2 px-[5px] py-[12px] hover:bg-[#444242] cursor-pointer"
                        >
                            {filter.icon && <Image src={filter.icon} alt={filter.name} width={24} height={24} className="object-contain" />}
                            <span>{filter.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
