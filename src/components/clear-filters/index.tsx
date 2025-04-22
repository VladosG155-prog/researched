import { FilterXIcon } from 'lucide-react';

export function ClearFilters({ onClear }: { onClear: () => void }) {
    return (
        <button
            onClick={onClear}
            className="md:bg-[#2C2C2C] cursor-pointer flex gap-3 h-[40px] md:h-[70px] justify-center items-center px-[12px] md:-[25px] text-[12px] md:text-[16px]"
        >
            <FilterXIcon />
            Очистить все
        </button>
    );
}
