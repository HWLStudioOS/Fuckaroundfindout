"use client";

import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Episode } from "@/lib/content";

type AudioContextValue = {
  current: Episode | null;
  isPlaying: boolean;
  playEpisode: (episode: Episode) => void;
  toggle: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playEpisode = useCallback(
    (episode: Episode) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (current?.slug === episode.slug) {
        if (audio.paused) {
          void audio.play();
        } else {
          audio.pause();
        }
        return;
      }

      setCurrent(episode);
      setCurrentTime(0);
      setIsPlaying(true);
    },
    [current],
  );

  useEffect(() => {
    if (!current || !audioRef.current) return;
    audioRef.current.src = current.audioUrl;
    const saved = window.localStorage.getItem(`baw-progress:${current.slug}`);
    if (saved) audioRef.current.currentTime = Number(saved) || 0;
    void audioRef.current.play().catch(() => setIsPlaying(false));
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (current) {
        window.localStorage.setItem(
          `baw-progress:${current.slug}`,
          Math.floor(audio.currentTime).toString(),
        );
      }
    };
    const onDuration = () => setDuration(audio.duration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDuration);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDuration);
    };
  }, [current]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, []);

  const jump = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds),
    );
  };

  const value = useMemo(
    () => ({ current, isPlaying, playEpisode, toggle }),
    [current, isPlaying, playEpisode, toggle],
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
      {current ? (
        <aside className="global-player" aria-label="Podcast player">
          <div className="global-player__art" data-accent={current.accent}>
            <span>{current.number}</span>
          </div>
          <div className="global-player__copy">
            <span className="eyebrow">Now playing</span>
            <Link href={`/episodes/${current.slug}`}>{current.shortTitle}</Link>
            <span>{current.guest}</span>
          </div>
          <div className="global-player__transport">
            <button type="button" onClick={() => jump(-15)} aria-label="Back 15 seconds">
              <RotateCcw aria-hidden="true" />
              <span>15</span>
            </button>
            <button
              className="global-player__play"
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? "Pause episode" : "Play episode"}
            >
              {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => jump(30)} aria-label="Forward 30 seconds">
              <RotateCw aria-hidden="true" />
              <span>30</span>
            </button>
          </div>
          <div className="global-player__progress">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => {
                if (audioRef.current) audioRef.current.currentTime = Number(event.target.value);
              }}
              aria-label="Episode progress"
            />
            <span>{formatTime(duration)}</span>
          </div>
          <Volume2 className="global-player__volume" aria-hidden="true" />
          <button
            className="global-player__close"
            type="button"
            onClick={() => {
              audioRef.current?.pause();
              setCurrent(null);
            }}
            aria-label="Close player"
          >
            <X aria-hidden="true" />
          </button>
        </aside>
      ) : null}
    </AudioContext.Provider>
  );
}

export function PlayButton({
  episode,
  className = "",
  compact = false,
}: {
  episode: Episode;
  className?: string;
  compact?: boolean;
}) {
  const audio = useContext(AudioContext);
  if (!audio) throw new Error("PlayButton must be used inside AudioProvider");
  const active = audio.current?.slug === episode.slug && audio.isPlaying;

  return (
    <button
      className={`play-button${compact ? " play-button--compact" : ""} ${className}`}
      type="button"
      onClick={() => audio.playEpisode(episode)}
      aria-label={`${active ? "Pause episode" : "Play episode"}: ${episode.title}`}
    >
      <span className="play-button__icon">
        {active ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </span>
      {compact ? null : <span>{active ? "Pause episode" : "Play episode"}</span>}
    </button>
  );
}
