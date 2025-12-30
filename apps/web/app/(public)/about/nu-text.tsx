import Lines from "@/components/ui/lines";

export default function NUHeading({ lineLength = 130 }) {
  return (
    <div className={`max-w-5xl mx-auto flex items-center justify-center gap-6`}>
      <Lines length={lineLength} />
      <div className="text-3xl font-normal leading-normal bg-gradient-to-r from-[#ff0092] via-[#f3bc16] to-[#ea0b0f] bg-clip-text text-transparent  whitespace-nowrap font-berry">
        NITRUTSAV 2026
      </div>
      <Lines flowDirection="rtl" length={lineLength} />
    </div>
  );
}
