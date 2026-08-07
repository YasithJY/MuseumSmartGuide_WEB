import React, { useState, useRef, useEffect } from 'react';
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeMute } from 'react-icons/md';

const AudioPlayer = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);

  useEffect(() => {
    // Reset player states when source changes
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback interrupted:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = () => {
    let nextRate = 1;
    if (playbackRate === 1) nextRate = 1.25;
    else if (playbackRate === 1.25) nextRate = 1.5;
    else if (playbackRate === 1.5) nextRate = 2;
    else nextRate = 1;

    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-primary/95 text-parchment p-4 rounded-xl border border-gold/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Title & Speed controls */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
        <span className="text-xs uppercase text-gold tracking-widest font-bold font-heading">
          Audio Guide Narrator
        </span>
        <span className="text-sm font-semibold text-stone-200 truncate max-w-[200px]">
          {title || "Overview Guide"}
        </span>
      </div>

      {/* Timeline Controls */}
      <div className="flex-1 flex items-center gap-3 w-full">
        <span className="text-xs text-stone-300 font-mono">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-gold h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-700"
        />
        <span className="text-xs text-stone-300 font-mono">{formatTime(duration)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Speed */}
        <button onClick={changeSpeed} className="text-xs border border-stone-600 px-2 py-1 rounded font-bold hover:border-gold transition-colors">
          {playbackRate}x
        </button>

        {/* Play/Pause */}
        <button onClick={togglePlay} className="p-3 bg-gold hover:bg-yellow-600 text-primary rounded-full transition-all duration-300 hover:scale-105">
          {isPlaying ? <MdPause className="w-5 h-5" /> : <MdPlayArrow className="w-5 h-5" />}
        </button>

        {/* Mute */}
        <button onClick={toggleMute} className="text-stone-300 hover:text-gold transition-colors">
          {isMuted ? <MdVolumeMute className="w-5 h-5" /> : <MdVolumeUp className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
