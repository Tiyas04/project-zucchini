"use client";

import Image from "next/image";
import { heroImages } from "@/config/hero";

export default function MusicVisualizer() {
  return (
    <div className="hidden md:block absolute top-[2rem] right-[3rem] size-[4.5vw]">
      {/* Background Circle */}
      <Image
        width={72}
        height={72}
        alt=""
        className="w-full h-full absolute inset-0"
        src={heroImages.ellipse}
      />

      {/* Visualizer Bars */}
      <div className="absolute inset-0 flex items-center justify-center gap-[0.15vw]">
        <span className="visualizer-bar bar-1"></span>
        <span className="visualizer-bar bar-2"></span>
        <span className="visualizer-bar bar-3"></span>
        <span className="visualizer-bar bar-4"></span>
        <span className="visualizer-bar bar-5"></span>
      </div>
    </div>
  );
}
