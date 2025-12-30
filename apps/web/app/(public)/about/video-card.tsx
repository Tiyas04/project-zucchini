import Lines from "@/components/ui/lines";

export default function VideoCard() {
  const url = "https://www.youtube.com/embed/tf1e1E3EwZE";
  return (
    <div className=" flex flex-col items-center w-lg gap-2">
      <div className="w-full relative">
        {/* top lines */}
        <div className="absolute -top-12 z-10">
          <Lines length={180} direction="horizontal" flowDirection="rtl" />
        </div>
        <div className="absolute -top-8 z-10">
          <Lines length={250} direction="horizontal" flowDirection="rtl" />
        </div>
        <div className="absolute -top-4 z-10">
          <Lines length={500} direction="horizontal" flowDirection="rtl" />
        </div>

        {/* bottom lines */}
        <div className="absolute -bottom-12 right-0 z-10">
          <Lines length={180} direction="horizontal" flowDirection="ltr" />
        </div>
        <div className="absolute -bottom-8 right-0 z-10">
          <Lines length={250} direction="horizontal" flowDirection="ltr" />
        </div>
        <div className="absolute -bottom-4 right-0 z-10">
          <Lines length={500} direction="horizontal" flowDirection="ltr" />
        </div>

        <div className="video-card-body relative w-full aspect-video overflow-hidden">
          <iframe
            className="w-full h-full outline-none border-none -z-10 absolute"
            src={url}
            title="NITRUTSAV Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
