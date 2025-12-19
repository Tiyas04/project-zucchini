"use client";

import Image from "next/image";
import FireworksEffect from "@/components/coming-soon/fireworks-effects";
import { images } from "@/config/coming-soon";

export default function ComingSoon() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <FireworksEffect />

      <Image
        src={images.background}
        alt="Carnival Background"
        fill
        priority
        className="object-cover z-1"
      />

      {/* Layer 2: Black overlay */}
      <div className="absolute inset-0 bg-black opacity-55 z-2" />

      <div className="absolute inset-0 z-3 flex flex-col items-center justify-around gap-[120px] pointer-events-none">
        {/*Top*/}
        <Image
          src={images.logo}
          alt="NITRUTSAV"
          width={500}
          height={200}
          className="w-[80%] max-w-[500px] h-auto opacity-30 mt-[5%] hidden md:block"
        />

        <Image
          src={images.logo}
          alt="NITRUTSAV"
          width={800}
          height={240}
          className="w-[80%] max-w-[800px] h-auto opacity-100"
        />

        {/*bottom*/}
        <Image
          src={images.logo}
          alt="NITRUTSAV"
          width={500}
          height={200}
          className="w-[80%] max-w-[500px] h-auto opacity-30 mb-[5%] hidden md:block"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-3 pointer-events-auto w-[clamp(200px,50%,380px)] h-auto animate-float">
        <Image
          src={images.balloon}
          alt="Coming Soon Balloon"
          width={400}
          height={300}
          className="w-full h-auto transition-transform duration-300 drop-shadow-2xl"
        />
      </div>
    </section>
  );
}
