"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface EventInfoProps {
  events: any[];
  onSwiper: (swiper: any) => void;
}

export default function EventInfo({ events, onSwiper }: EventInfoProps) {
  return (
    <div className="h-[200px] md:h-[250px] w-full overflow-hidden">
      <Swiper
        direction="vertical"
        onSwiper={onSwiper}
        allowTouchMove={false}
        slidesPerView={1}
        spaceBetween={20}
        speed={500}
        className="h-full"
      >
        {events.map((event, idx) => (
          <SwiperSlide key={idx} className="flex flex-col justify-center gap-6">
            <h1 className="text-2xl md:text-4xl font-calistoga font-bold uppercase tracking-wide text-white">
              {event.name}
            </h1>
            <p className="text-xl md:text-xl font-berkshire leading-relaxed text-white max-w-xl">
              {event.description}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
