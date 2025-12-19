"use client";

import Image from "next/image";
import Navbar from "../marginals/navbar";
import CountdownTimer from "./countdown-timer";
import MusicVisualizer from "./music-visualizer";
import { heroImages } from "@/config/hero";
import FireworksEffects from "../coming-soon/fireworks-effects";

export default function Hero() {
  return (
    <main className="min-h-screen bg-[#010005] overflow-hidden relative font-inria">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            width={1920}
            height={1080}
            alt="Background"
            className="absolute h-full w-full object-cover"
            src={heroImages.background}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(223.4786651662683deg, rgba(0, 0, 0, 0) 37.108%, rgba(0, 0, 0, 0.82) 89.847%)",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:block">
        <Navbar />

        <CountdownTimer />

        {/* Music Visualizer - Top Right */}
        <MusicVisualizer />

        {/* Logo - Bottom Left (Desktop) / Center (Mobile) */}
        <div className="flex-1 flex items-center justify-center md:block md:absolute md:bottom-[8rem] md:left-[4rem] md:flex-none">
          <div className="w-[90vw] md:w-[40vw]">
            <Image
              width={500}
              height={500}
              alt="NITRUTSAV Logo"
              className="w-full h-full object-contain"
              src={heroImages.logo}
            />
          </div>
        </div>

        {/* Date - Bottom Left */}
        <div className="text-center md:text-left pb-12 md:pb-0 md:absolute md:bottom-[3rem] md:left-[5rem]">
          <p className="text-white text-2xl md:text-[3.4vw] font-bold font-baloo tracking-wide">
            7th-9th February, 2026
          </p>
        </div>
      </div>
    </main>
  );
}
