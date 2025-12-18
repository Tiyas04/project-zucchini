import { H2, P } from "@repo/ui/core/typography";

export default function DummyAbout() {
  return (
    <section className="bg-gray-50 border-b min-h-screen flex items-center justify-center border-gray-200 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <H2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          About NITRUTSAV&apos;26
        </H2>
        <P className="text-lg text-gray-700 leading-relaxed text-left">
          NITRUTSAV&apos;26 is the annual cultural extravaganza of NIT Rourkela — a celebration of
          creativity, talent, and youthful spirit. Bringing together artists, performers, and
          innovators from across the nation, the fest promises three days of high-energy events,
          captivating performances, and unforgettable experiences. With a renewed vision and bigger
          stage, NITRUTSAV&apos;26 aims to redefine fest culture and create memories that last a
          lifetime.
        </P>
      </div>
    </section>
  );
}
