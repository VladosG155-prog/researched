'use client';
import { SwiperSlide, Swiper } from 'swiper/react';
import 'swiper/css';

import Image from 'next/image';

export function MobileProxyFilters({ filters, pathname, handleClickFilter }) {
    return (
        <Swiper
            spaceBetween={8}
            slidesPerView={2.4} // немного больше двух кнопок
            freeMode={true}
            className="!pb-3" // уменьшил паддинг снизу, чтобы не было пустоты от точек
        >
            {filters.map((proxy, index) => (
                <SwiperSlide key={index}>
                    <button
                        onClick={() => handleClickFilter(proxy.link)}
                        className={`h-[40px] text-[12px] md:text-[16px] md:h-[50px] w-full relative flex-shrink-0 ${
                            '/' + proxy.link === pathname ? 'bg-[#DEDEDE] text-black' : 'bg-[#2C2C2C] text-white'
                        }`}
                    >
                        {proxy.name}
                        {proxy.link === 'proxy-depin' && (
                            <Image
                                className="absolute top-0 h-[65px] md:h-[85px] w-full"
                                alt="grass"
                                width={10}
                                height={10}
                                src="/grasstobutton.png"
                            />
                        )}
                    </button>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
