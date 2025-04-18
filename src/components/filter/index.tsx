import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

interface FilterProps {
    name: string;
    selectedValue: string;
    onChange: (val: string) => void;
    showText?: boolean;
    filters: { name: string; icon: string }[];
    showSearch?: boolean;
}

export function Filter({ name, filters, onChange, selectedValue = '', showSearch = false }: FilterProps) {
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const filterRef = useRef();
    const [searchValue, setSearchValue] = useState('');

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
        if (!searchValue) return filters; // Если поиск пустой, возвращаем все фильтры
        return filters.filter((filter) => filter.name.toLowerCase().includes(searchValue.toLowerCase()));
    }, [filters, searchValue]);

    return (
        <div ref={filterRef} className="relative inline-block md:max-w-[250px] max-h-[300px] w-full">
            <button
                className="bg-[#2C2C2C] w-full cursor-pointer flex gap-3 h-[70px] justify-between items-center px-[25px] max-w-full"
                onClick={handleClickFilter}
            >
                {selectedValue === '' ? name : selectedValue} {isOpenFilter ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isOpenFilter && (
                <div className="bg-[#2C2C2C] px-[8px] absolute z-70 w-full">
                    {showSearch && (
                        <input
                            className="bg-[#1A1A1A] w-full outline-0 p-[5px] mb-3"
                            placeholder="Поиск"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    )}
                    <ul className="bg-[#2C2C2C] left-0 w-full max-h-[300px] overflow-y-auto overflow-x-hidden z-70">
                        {filteredValue.map((filter, index) => {
                            return (
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
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
