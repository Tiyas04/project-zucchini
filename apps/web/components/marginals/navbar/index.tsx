"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems, navbarImages } from "@/config/marginals";
import { Images } from "@/config/events";
import GradientUnderline from "./gradient";
import CountdownTimer from "./countdown-timer";
import MusicVisualizer from "./music-visualizer";
import { useEventCategory } from "@/contexts/event-category-context";
import MobileMusicVisualizer from "./mobile-music-visualizer";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { activeCategory, setActiveCategory, categories } = useEventCategory();

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const handleCloseMenu = () => setIsClosing(true);

  const toggleMenu = () => {
    if (isMenuOpen) handleCloseMenu();
    else setIsMenuOpen(true);
  };

  /* Removed unused handlers: handleCloseCategoryMenu, toggleCategoryMenu */

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    /* Removed handleCloseCategoryMenu() call */
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-9999 w-full px-6 pt-4 md:pt-8 pb-2 transition-all duration-300  ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[85rem] mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="md:hidden relative size-12 z-50">
            <Image
              src={navbarImages.mobileLogo}
              alt="Nitrutsav Logo"
              fill
              className="object-contain items-start"
            />
          </Link>

          <nav className="hidden md:flex gap-5 lmd:gap-8 lg:gap-12 text-white font-inria">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative group text-base lg:text-lg  tracking-wide transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {item.label}
                  <div
                    className={`absolute left-0 -bottom-2 h-[3px] transition-all duration-300 overflow-hidden ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  >
                    <GradientUnderline className="w-full h-full" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="block md:hidden">
          <MobileMusicVisualizer />
        </div>

        <div className="flex items-center gap-4 lg:gap-12">
          <div className="hidden md:block">
            <CountdownTimer />
          </div>

          <div className="hidden md:block">
            <MusicVisualizer />
          </div>

          {/* Removed Mobile Event Category Button */}

          {/* Mobile Burger Menu */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white relative w-8 h-8 focus:outline-none z-50"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isMenuOpen && !isClosing
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <Menu size={32} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isMenuOpen && !isClosing
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
              }`}
            >
              <X size={32} />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 min-h-screen bg-black/70 flex flex-col items-center justify-center md:hidden backdrop-blur-sm"
          style={{
            zIndex: 45,
            animation: isClosing
              ? "slideFadeOut 0.3s ease-in forwards"
              : "slideFadeIn 0.3s ease-out forwards",
          }}
          onAnimationEnd={() => {
            if (isClosing) {
              setIsMenuOpen(false);
              setIsClosing(false);
              setIsEventsDropdownOpen(false);
            }
          }}
        >
          <nav className="flex flex-col gap-8 text-white text-2xl text-center font-inria">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const isEventItem = item.label === "Events";

              if (isEventItem) {
                return (
                  <div key={item.label} className="flex flex-col items-center">
                    <button
                      onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
                      className={`cursor-pointer relative group transition-opacity duration-300 ${
                        isActive || isEventsDropdownOpen
                          ? "opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {item.label}
                      <div
                        className={`absolute left-0 -bottom-2 h-[3px] transition-all duration-300 overflow-hidden ${
                          isActive || isEventsDropdownOpen ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      >
                        <GradientUnderline className="w-full h-full" />
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-4 mt-2 ${
                        isEventsDropdownOpen
                          ? "max-h-[300px] opacity-100 pt-4"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {categories.map((category) => (
                        <Link
                          key={category}
                          href="/events"
                          onClick={() => {
                            handleCategorySelect(category);
                            handleCloseMenu();
                          }}
                          className={`text-lg uppercase tracking-wider transition-all duration-300 ${
                            activeCategory === category
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-[#EA0B0F] via-[#F3BC16] to-[#FF0092]"
                              : "text-white/70 hover:text-white"
                          }`}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`cursor-pointer relative group transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={handleCloseMenu}
                >
                  {item.label}
                  <div
                    className={`absolute left-0 -bottom-2 h-[3px] transition-all duration-300 overflow-hidden ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  >
                    <GradientUnderline className="w-full h-full" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Removed Mobile Event Category Dropdown Overlay */}
    </header>
  );
}
