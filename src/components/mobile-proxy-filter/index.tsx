import { SwiperSlide, Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Pagination } from 'swiper/modules';
import Image from 'next/image';
export function MobileProxyFilters({ filters, pathname, handleClickFilter }) {
    return (
        <Swiper
            spaceBetween={8}
            modules={[Pagination]}
            className="!pb-[50px]"
            slidesPerView={2}
            slidesPerGroup={2}
            pagination={{ clickable: true }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            {filters.map((proxy, index) => (
                <SwiperSlide key={index}>
                    {' '}
                    <button
                        key={proxy.name}
                        onClick={() => handleClickFilter(proxy.link)}
                        className={`h-[50px] w-full relative flex-shrink-0 ${
                            '/' + proxy.link === pathname ? 'bg-[#DEDEDE] text-black' : 'bg-[#2C2C2C] text-white'
                        }`}
                    >
                        {proxy.name}
                        {proxy.link === 'proxy-depin' && (
                            <Image className="absolute top-0 h-[85px] w-full" alt="grass" width={10} height={10} src="/grasstobutton.png" />
                        )}
                    </button>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
