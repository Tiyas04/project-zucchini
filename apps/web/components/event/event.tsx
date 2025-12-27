"use client";

import Navbar from "../marginals/navbar";
import CountdownTimer from "../hero/countdown-timer";
import MusicVisualizer from "../hero/music-visualizer";
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
import { useState } from "react";
import { inriaSans, calistoga, berkshireSwash } from "@/fonts";

// Category Mapping
const categories: Record<string, any[]> = {
  "Flagship Events": FlagshipEvents,
  "Pro Shows": ProShows,
  "Fun Events": FunEvents,
  "Main Events": MainEvents,
  Workshops: WorkshopandExihibition,
};

export default function Event() {
  const [activeCategory, setActiveCategory] = useState("Pro Shows");
  const [activeIndex, setActiveIndex] = useState(0);

  // Get current events list
  const currentEvents = categories[activeCategory] || ProShows;
  const activeEvent = currentEvents[activeIndex];

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
      <div className="relative z-10 flex flex-col w-full min-h-screen md:pt-10 pb-20">
        {/* TOP SECTION */}
        <div className="flex flex-col w-full gap-2 md:gap-8">
          <Navbar />
          <CountdownTimer />
          <MusicVisualizer />
        </div>

        {/* HERO SWIPER */}
        <div className="flex flex-col items-center justify-center mt-16 md:mt-36 mb-8">
          <EventSwiper events={currentEvents} onSlideChange={setActiveIndex} />
        </div>

        {/* EVENT INFO & CATEGORY MENU */}
        <div className="w-full max-w-[90vw] mx-auto mt-8 flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-14 px-4 text-white">
          {/* LEFT: EVENT DETAILS */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-7xl font-calistoga uppercase tracking-wide text-white">
              {activeEvent?.name || "Event Name"}
            </h1>
            <p className="text-xl md:text-2xl font-berkshire leading-relaxed text-white max-w-xl">
              {activeEvent?.description || "Event description goes here."}
            </p>
          </div>

          {/* RIGHT: CATEGORY MENU */}
          <div className="flex flex-col items-end justify-start gap-3 pt-2 pr-4">
            {Object.keys(categories).map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                                        group relative flex items-center text-xl uppercase tracking-wider transition-all duration-300 font-calistoga
                                        ${isActive ? "" : "font-light text-white hover:text-white/80"}
                                    `}
                >
                  {/* TEXT WITH GRADIENT IF ACTIVE */}
                  <span
                    className={
                      isActive
                        ? "bg-clip-text text-transparent bg-gradient-to-l from-[#EA0B0F] via-[#F3BC16] to-[#FF0092]"
                        : ""
                    }
                  >
                    {category}
                  </span>

                  {/* ICON IF ACTIVE */}
                  {isActive && (
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-8 h-8">
                      <Image
                        src={Images.iconimage}
                        alt="Active Icon"
                        fill
                        className="object-contain rotate-90"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
