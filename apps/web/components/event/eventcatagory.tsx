"use client";

import Image from "next/image";
import { Images } from "@/config/events";

interface EventCategoryProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function EventCategory({
  categories,
  activeCategory,
  setActiveCategory,
}: EventCategoryProps) {
  return (
    <div className="flex flex-col items-end justify-start gap-3 pt-2 pr-4">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
                group relative flex items-center text-xs md:text-xl uppercase tracking-wider transition-all duration-300 font-calistoga
                ${isActive ? "scale-110" : "font-light text-white hover:text-white/80"}
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
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-8 h-8">
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
  );
}
