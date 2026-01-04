import { useAudio } from "@/contexts/audio-context";

export default function MobileMusicVisualizer() {
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
      className="music-visualizer text-white font-berry text-sm drop-shadow-[2px 0.5px] bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-2 py-1"
      onClick={togglePlay}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center gap-[2px]">
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
        <div className="text-xs">SOUND : {isPlaying ? "ON" : "OFF"}</div>
      </div>
    </div>
  );
}
