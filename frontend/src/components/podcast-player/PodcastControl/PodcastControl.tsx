import { Attributes, InputHTMLAttributes, useEffect, useRef } from "react";
import Backward15Svg from "../../svg/backward15/backward15Svg";
import Forward15Svg from "../../svg/forward15/forward15Svg";
import PauseSvg from "../../svg/pause/PauseSvg";
import PlaySvg from "../../svg/play/playSvg";

interface podcastControlProps {
  playerState: {
    isPlaying: boolean;
    progress: number;
    isMuted: boolean;
    volume: number;
    duration: string | number;
    timePassed: string | number;
  };
  togglePlay: () => void;
  handleTimeForward: () => void;
  handleTimeBackward: () => void;
  handleVideoProgress: (event: any) => void;
}
const PodcastControl = ({
  playerState,
  togglePlay,
  handleTimeForward,
  handleTimeBackward,
  handleVideoProgress,
}: podcastControlProps) => {
  const thumb = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement | any>(null);

  useEffect(() => {
    const val = (slider?.current?.value / slider?.current?.max) * 100 + "%";

    progress!.current!.style.width = val;
    thumb!.current!.style.left = val;
  }, [slider.current?.value]);
  return (
    <div className="flex flex-col justify-center items-center gap-y-20 px-5">
      <div className="flex flex-row justify-center items-center gap-x-5">
        <span onClick={handleTimeForward} className="hover:cursor-pointer">
          <Forward15Svg />
        </span>
        {!playerState.isPlaying ? (
          <span onClick={togglePlay} className="hover:cursor-pointer">
            <PlaySvg />
          </span>
        ) : (
          <span onClick={togglePlay} className="hover:cursor-pointer">
            <PauseSvg />
          </span>
        )}

        <span onClick={handleTimeBackward} className="hover:cursor-pointer">
          <Backward15Svg />
        </span>
      </div>
      <div className="px-7 w-full">
        <div className="w-full podcast-range ">
          <input
            className=" podcast-slider"
            type="range"
            min="0"
            max="100"
            value={playerState.progress}
            ref={slider}
            onChange={handleVideoProgress}
          />
          <div className={`podcast-thumb`} ref={thumb}>
            <div className="flex flex-row mx-auto items-center gap-x-1">
              {playerState.timePassed <= 0 ? (
                <>
                  <span className="text-purple-800 text-xs font-normal">
                    00{" "}
                  </span>
                  <span className="text-purple-800 text-xs font-normal">
                    {" "}
                    از{" "}
                  </span>
                  <span className="text-purple-800 text-xs font-normal">
                    00
                  </span>
                </>
              ) : (
                <>
                  <span className="text-purple-800  text-xs font-normal">
                    {playerState.duration}
                  </span>
                  <span className="text-purple-800 text-xs font-normal">
                    از{" "}
                  </span>
                  <span className="text-purple-800 text-xs font-bold">
                    {playerState.timePassed}{" "}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="podcast-progress" ref={progress}></div>
        </div>
      </div>
    </div>
  );
};

export default PodcastControl;
