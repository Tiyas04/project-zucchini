import { H1, P } from "@repo/ui/core/typography";

export default function DummyHero() {
  return (
    <div className="bg-white border-b border-gray-200 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <H1 className="text-6xl font-bold text-gray-900 mb-6">NITRUTSAV 2026</H1>
        <P className="text-xl text-gray-600 max-w-2xl mx-auto">
          The annual literary and cultural fest of NIT Rourkela
        </P>
      </div>
    </div>
  );
}
