import { SectionHeading } from "@/components/ui";
import NUText from "./nu-text";

export default function AboutCard() {
  return (
    <div className="max-w-lg flex flex-col items-center w-full gap-4">
      <SectionHeading title="About Us" lineLength={150} />
      <div className="about-card-body font-inria text-xl">
        NITRUTSAV&apos;26 is the annual cultural extravaganza of NIT Rourkela — a celebration of
        creativity, talent, and youthful spirit. Bringing together artists, performers, and
        innovators from across the nation, the fest promises three days of high-energy events,
        captivating performances, and unforgettable experiences. With a renewed vision and bigger
        stage, NITRUTSAV&apos;26 aims to redefine fest culture and create memories that last a
        lifetime.
      </div>

      <NUText lineLength={70} />
    </div>
  );
}
