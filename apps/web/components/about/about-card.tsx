import { SectionHeading } from "@/components/ui";
import NUText from "./nu-text";

export default function AboutCard({
  length,
}: {
  length: {
    1: number;
    2: number;
  };
}) {
  const { 1: length1, 2: length2 } = length;
  return (
    <div className="max-w-lg lmd:max-w-md llg:max-w-lg w-full flex flex-col items-center gap-4">
      <SectionHeading title="About Us" lineLength={length1} lineClassName="lsm:block hidden" />
      <div className="about-card-body font-inria text-lg llg:text-xl">
        NITRUTSAV&apos;26 is the annual literary and cultural extravaganza of NIT Rourkela and
        Odisha&apos;s largest cultural fest— a celebration of creativity, talent, and youthful
        spirit. Bringing together artists, performers, and innovators from across the nation, the
        fest promises three days of high-energy events, captivating performances, and unforgettable
        experiences. With a renewed vision and bigger stage, NITRUTSAV&apos;26 aims to redefine fest
        culture and create memories that last a lifetime.
      </div>

      <NUText lineLength={length2} />
    </div>
  );
}
