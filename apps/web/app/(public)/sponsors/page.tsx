import TitleSponsors from "@/components/sponsors/title";
import React, { JSX } from "react";
import PlatinumSponsors from "../../../components/sponsors/platinum";

const background =
  "https://res.cloudinary.com/drf3eatfm/image/upload/v1767283927/nitrutsav-2026/ggdb93tvuuukh6csh745.webp";

export default function SponsorsPage(): JSX.Element {
  return (
    <div
      className="bg-[#010005] w-full relative text-white grid place-items-center min-h-screen before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-cover before:bg-center before:bg-no-repeat before:z-0 after:content-[''] after:absolute after:inset-0 after:w-full after:h-full after:bg-black/30 after:backdrop-blur-sm after:z-[1] md:after:hidden"
      style={{ "--bg-image": `url(${background})` } as React.CSSProperties}
    >
      <style>{`
        div[style*="--bg-image"]::before {
          background-image: var(--bg-image);
        }
      `}</style>

      <div className="relative z-10">
        <TitleSponsors />
        <PlatinumSponsors />
      </div>
    </div>
  );
}
