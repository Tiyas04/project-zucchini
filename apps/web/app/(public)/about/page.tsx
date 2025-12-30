import type { Metadata } from "next";
import ContactSection from "@/components/about/contact";
import DummyAbout from "@/components/about/dummy-about";
import { SectionHeading } from "@/components/ui";
import AboutSection from "@/components/about/about";
import AboutCard from "./about-card";
import VideoCard from "./video-card";

export const metadata: Metadata = {
  title: "About | Nitrutsav 2026",
  description:
    "Learn about Nitrutsav 2026, NIT Rourkela's premier literary and cultural festival celebrating creativity, innovation, and cultural heritage.",
};

export default function AboutPage() {
  return (
    <main className="about-bg-image min-h-screen grid place-items-center">
      {/* <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="w-full">
            <SectionHeading title="ABOUT US " className="text-center" containerClassName="mb-20" />
            <DummyAbout />
          </div>
        </div>
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="w-full">
            {" "}
            <SectionHeading
              title="CONTACT US "
              className="text-center"
              containerClassName="mb-20"
            />
            <ContactSection />
          </div>
        </div>

        <div className="mt-20">d</div>
      </div> */}

      {/* <AboutSection /> */}

      <div className="w-full py-52">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="-skew-y-13">
            <AboutCard />
          </div>
          <div className="skew-y-13">
            <VideoCard />
          </div>
        </div>
      </div>
    </main>
  );
}
