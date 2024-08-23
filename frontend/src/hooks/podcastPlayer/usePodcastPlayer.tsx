import React, {
  FC,
  MutableRefObject,
  Ref,
  RefObject,
  useEffect,
  useState,
} from "react";
// import MusicPlayer from "../pages/MusicPlayer";
interface usePodcastPlayerConts {
  isPlaying: boolean;
  progress: number;
  isMuted: boolean;
  volume: number;
  duration: number | string;
  timePassed: number | string;
}

interface usePodcastPlayerReturns {
  playerState: usePodcastPlayerConts;

  togglePlay: () => void;
  toggleMute: () => void;
  handleTimeForward: () => void;
  handleTimeBackward: () => void;
  handleVideoProgress: (event: Event) => void;
  handleUpdateTime: () => void;
  handleVideoVolume: (e:Event) => void;
}

const usePodcastPlayer = (audioElement: any): usePodcastPlayerReturns => {
  const [playerState, setPlayerState] = useState<usePodcastPlayerConts>({
    isPlaying: false,
    progress: 0,
    isMuted: false,
    volume: 100,
    duration: 0,
    timePassed: "",
  });

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  const toggleMute = () => {
    setPlayerState({
      ...playerState,
      isMuted: !playerState.isMuted,
    });
  };
  // const handleVideoSpeed = (e) => {
  //   const speedPlay = Number(e.target.value);
  //   audioElement.current.playbackRate = speedPlay;
  //   setPlayerState({
  //     ...playerState,
  //     speed: speedPlay,
  //   });
  // };

  // video timebar handler

  const handleVideoProgress = (event: any) => {
    const manualChange = Number(event.target.value);
    audioElement.current.currentTime =
      (audioElement.current.duration / 100) * manualChange;
    setPlayerState({
      ...playerState,
      progress: manualChange,
    });
  };

  // video player volumebar handler

  const handleVideoVolume = (e: any) => {
    const videoVolume = Number(e.target.value);

    audioElement.current.volume = videoVolume / 100;

    setPlayerState({
      ...playerState,
      volume: videoVolume,
    });
  };

  const handleVideoVolumeUp = (e: Event) => {
    setPlayerState({
      ...playerState,
      volume: playerState.volume < 99 ? playerState.volume + 10 : 100,
    });
  };

  const handleVideoVolumeDown = (e: Event) => {
    setPlayerState({
      ...playerState,
      volume:
        playerState.volume > 0 ? playerState.volume - 10 : playerState.volume,
    });
  };

  const handleUpdateTime = () => {
    const progress =
      (audioElement.current.currentTime / audioElement.current.duration) * 100;

    let seconds = Math.floor(audioElement.current.currentTime);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    let seconds2 = Math.floor(audioElement.current.duration);
    let minutes2 = Math.floor(seconds2 / 60);
    let hours2 = Math.floor(minutes2 / 60);

    seconds2 = seconds2 % 60;
    minutes2 = minutes2 % 60;

    const timePassed = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    const duration = minutes2 + ":" + seconds2;
    setPlayerState({
      ...playerState,
      progress,
      timePassed,
      duration,
    });
  };

  const handleTimeForward = () => {
    audioElement.current.currentTime += 15;
  };

  const handleTimeBackward = () => {
    audioElement.current.currentTime -= 15;
  };

  useEffect(() => {
    playerState.isPlaying
      ? audioElement.current.play()
      : audioElement.current.pause();
  }, [playerState.isPlaying, audioElement]);

  useEffect(() => {
    if (playerState.volume === 0) {
      setPlayerState({
        ...playerState,
        isMuted: true,
      });
    } else {
      setPlayerState({
        ...playerState,
        isMuted: false,
      });
    }
  }, [playerState.volume]);
  return {
    playerState,
    togglePlay,
    toggleMute,
    handleTimeBackward,
    handleTimeForward,
    handleUpdateTime,
    handleVideoProgress,
    handleVideoVolume,
  };
};
export default usePodcastPlayer;
