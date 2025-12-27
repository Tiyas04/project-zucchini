"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import { Images } from "@/config/events";

export default function EventSwiper({
  events,
  onSlideChange,
}: {
  events: any[];
  onSlideChange?: (index: number) => void;
}) {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const endlessSlides = [...events, ...events, ...events];
  const baseLength = events.length;

  // Reset to middle when events change
  useEffect(() => {
    if (!swiperRef.current) return;
    setActiveIndex(0);
    onSlideChange?.(0);
    swiperRef.current.slideTo(baseLength, 0, false);
  }, [events, baseLength, onSlideChange]);

  const handleScroll = (swiper: any) => {
    const index = swiper.activeIndex;
    const realIndex = index % baseLength;

    setActiveIndex(realIndex);
    onSlideChange?.(realIndex);

    if (index < baseLength * 0.5) {
      swiper.slideTo(index + baseLength, 0, false);
    }
    if (index > baseLength * 1.5) {
      swiper.slideTo(index - baseLength, 0, false);
    }
  };

  return (
    <div className="relative w-full max-w-[90vw] text-white py-4">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView="auto"
        spaceBetween={32}
        freeMode
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: false,
        }}
        grabCursor
        modules={[Mousewheel, FreeMode]}
        onSlideChange={handleScroll}
        className="!overflow-visible transform-gpu"
      >
        {endlessSlides.map((event, index) => {
          const isActive = index % baseLength === activeIndex;

          return (
            <SwiperSlide key={index} className="!w-[280px] md:!w-[374px]">
              <div
                className={`
                                    relative h-[346px] md:h-[463px] w-full
                                    transition-all duration-500 ease-out
                                    ${
                                      isActive
                                        ? "scale-100 z-20 shadow-2xl"
                                        : "scale-90 z-10 opacity-60 blur-[1px]"
                                    }
                                `}
              >
                {isActive ? (
                  <div
                    className="p-[5px] md:p-[7px] h-full w-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,250,190,1), rgba(231,88,31,1), rgba(141,35,87,1), rgba(5,90,68,1), rgba(251,34,158,1), rgba(153,6,190,1), rgba(255,255,255,1))",
                    }}
                  >
                    <PosterCard event={event} />
                  </div>
                ) : (
                  <div className="h-full w-full p-[5px] md:p-[7px]">
                    <PosterCard event={event} />
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* DECORATIVE WHITE LINES */}
      <div className="absolute top-[13px] md:top-[17px] left-[300px] md:left-[398px] right-0 h-[2px] bg-white pointer-events-none z-10" />
      <div className="absolute top-[356px] md:top-[477px] left-[300px] md:left-[398px] right-0 h-[2px] bg-white pointer-events-none z-10" />
    </div>
  );
}

function PosterCard({ event }: { event: any }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={event.posterurl || Images.logoImg}
        alt={event.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 280px, 374px"
      />
    </div>
  );
}
