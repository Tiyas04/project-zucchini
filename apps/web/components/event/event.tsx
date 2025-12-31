"use client";

import Image from "next/image";
import {
  FlagshipEvents,
  ProShows,
  MainEvents,
  FunEvents,
  WorkshopandExihibition,
  Images,
} from "@/config/events";
import EventSwiper from "./eventswiper";
import EventInfo from "./eventinfo";
import EventCategory from "./eventcatagory";
import { useState, useRef, useEffect } from "react";
import { inriaSans, calistoga, berkshireSwash, baloo } from "@/fonts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Category Mapping
const categories: Record<string, any[]> = {
  "Flagship Events": FlagshipEvents,
  "Pro Shows": ProShows,
  "Fun Events": FunEvents,
  "Main Events": MainEvents,
  "Workshops and Exhibition": WorkshopandExihibition,
};

export default function Event() {
  const [activeCategory, setActiveCategory] = useState("Flagship Events");
  const [activeIndex, setActiveIndex] = useState(0);
  const textSwiperRef = useRef<any>(null);

  // Get current events list
  const currentEvents = categories[activeCategory] || ProShows;
  const activeEvent = currentEvents[activeIndex];

  // Sync Text Swiper with activeIndex
  useEffect(() => {
    if (textSwiperRef.current) {
      textSwiperRef.current.slideTo(activeIndex);
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* BACKGROUNDS */}
      <Image
        src={Images.BackgroundImg2}
        alt="Color Background"
        fill
        className="object-cover opacity-[40%] blur-[50px] contrast-150 brightness-60 saturate-400"
      />

      <Image
        src={Images.BackgroundImg1}
        alt="Base Background"
        fill
        className="absolute inset-0 opacity-[70%] blur-[2px] mix-blend-color-dodge grayscale scale-120"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={Images.centreBackgroundImg}
          alt="Center Background"
          height={2116}
          width={712}
          className="object-contain opacity-[70%] grayscale mix-blend-color-dodge scale-110"
        />
      </div>

      {/* DARK MASK */}
      <div
        className="
                    absolute inset-0 bg-black/55 pointer-events-none
                    [mask-image:radial-gradient(circle_at_center,transparent_30%,black_80%)]
                "
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col w-full min-h-screen ">
        {/* HERO SWIPER */}
        <div className="flex flex-col items-center justify-center mt-6 md:mt-8 mb-6">
          <EventSwiper events={currentEvents} onSlideChange={setActiveIndex} />
        </div>

        {/* EVENT INFO & CATEGORY MENU */}
        <div className="w-full max-w-[90vw] mx-auto mt-2 mb-2 flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-14 px-4 text-white">
          {/* LEFT: EVENT DETAILS (VERTICAL SWIPER) */}
          <EventInfo
            events={currentEvents}
            onSwiper={(swiper) => (textSwiperRef.current = swiper)}
          />

          {/* RIGHT: CATEGORY MENU */}
          <EventCategory
            categories={Object.keys(categories)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
    </div>
  );
}
