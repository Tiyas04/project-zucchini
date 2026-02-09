"use client";

import { useRef } from "react";
import { useParallax } from "./hooks";
import {
  BackgroundLayer,
  PeacockLeftLayer,
  OwlRightDecorationLayer,
  GirlLayer,
  LogoLayer,
  GradientOverlay,
  PeacockRightLayer,
  Parrot,
} from "./layers";
import FireworksEffect from "@/components/coming-soon/fireworks-effects";
import Button from "../ui/button";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mouse, scrollY } = useParallax(containerRef);

  return (
    <main
      ref={containerRef}
      className="h-screen w-screen overflow-visible relative 2xl:max-h-[56.25vw] 2xl:min-h-[56.25vw]"
    >
      <FireworksEffect />

      <BackgroundLayer mouse={mouse} scrollY={scrollY} />

      <PeacockLeftLayer mouse={mouse} scrollY={scrollY} />
      <PeacockRightLayer mouse={mouse} scrollY={scrollY} />
      <Parrot mouse={mouse} scrollY={scrollY} />
      <OwlRightDecorationLayer mouse={mouse} scrollY={scrollY} />

      <LogoLayer mouse={mouse} scrollY={scrollY} />
      <GirlLayer mouse={mouse} scrollY={scrollY} />

      {/* <div className="absolute md:bottom-40 bottom-24 left-1/2 -translate-x-1/2 z-34">
        <Link href="/register">
          <Button className="h-[56px] md:h-[75px] w-[200px] md:w-[275px] text-white">
            Register Now
          </Button>
        </Link>
      </div> */}
    </main>
  );
}
