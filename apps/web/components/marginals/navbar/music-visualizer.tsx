import { useAudio } from "@/contexts/audio-context";

export default function MusicVisualizer() {
  const { isPlaying, play, pause } = useAudio();

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div
      onClick={togglePlay}
      className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 cursor-pointer"
    >
      <div className="w-full h-full rounded-full border-2 border-white/60 backdrop-blur-sm fill-[rgba(217,217,217,0.20)]" />
      <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`visualizer-bar bar-${i} w-[3px] bg-white/80`}
            style={{
              animationPlayState: isPlaying ? "running" : "paused",
              height: isPlaying ? undefined : "3px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
