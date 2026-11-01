'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Gauge,
  Sparkles,
  Music2,
  Radio,
  FileAudio,
} from 'lucide-react';
import { AudioTrack } from '../types';
import { speech, SpeechRate } from '../lib/speech';
import { sounds } from '../lib/soundEffects';

interface AudioPlayerProps {
  title?: string;
  subtitle?: string;
  tracks?: AudioTrack[];
  audioFileSrc?: string;
  audioFileName?: string;
  fullSpeechText?: string;
  sentences?: string[];
  onSentenceChange?: (index: number) => void;
  variant?: 'compact' | 'featured' | 'inline';
}

export function AudioPlayer({
  title,
  subtitle,
  tracks = [],
  audioFileSrc,
  audioFileName,
  fullSpeechText,
  sentences = [],
  onSentenceChange,
  variant = 'featured',
}: AudioPlayerProps) {
  // If tracks are provided, default to first track; else synthesize from audioFileSrc
  const initialTracks: AudioTrack[] =
    tracks.length > 0
      ? tracks
      : audioFileSrc
      ? [
          {
            id: 'default',
            title: title || 'Audio Recording',
            subtitle: subtitle || 'Lesson Audio',
            src: audioFileSrc,
            originalFileName: audioFileName || decodeURIComponent(audioFileSrc.split('/').pop() || 'audio.mp4'),
            type: 'story',
          },
        ]
      : [];

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const activeTrack = initialTracks[activeTrackIndex] || null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<SpeechRate>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [mode, setMode] = useState<'recording' | 'tts'>(
    activeTrack ? 'recording' : 'tts'
  );
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const ttsRunningRef = useRef(false);

  // Sync playback rate to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
    speech.setRate(playbackRate);
  }, [playbackRate]);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Change track cleanup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      audioRef.current.load();
    }
    speech.stop();
    ttsRunningRef.current = false;
  }, [activeTrackIndex, activeTrack?.src]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      speech.stop();
      ttsRunningRef.current = false;
    };
  }, []);

  const togglePlay = () => {
    sounds.playClick();
    if (mode === 'recording' && activeTrack) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Audio play failed, falling back to TTS:', err);
            setMode('tts');
            toggleTts();
          });
      }
    } else {
      toggleTts();
    }
  };

  const toggleTts = async () => {
    if (isPlaying) {
      speech.stop();
      ttsRunningRef.current = false;
      setIsPlaying(false);
      setCurrentSentenceIdx(-1);
      onSentenceChange?.(-1);
      return;
    }

    setIsPlaying(true);
    ttsRunningRef.current = true;

    if (sentences.length > 0) {
      for (let i = 0; i < sentences.length; i++) {
        if (!ttsRunningRef.current) break;
        setCurrentSentenceIdx(i);
        onSentenceChange?.(i);
        await speech.speak(sentences[i], { rate: playbackRate });
        await new Promise((r) => setTimeout(r, 350));
      }
      setIsPlaying(false);
      ttsRunningRef.current = false;
      setCurrentSentenceIdx(-1);
      onSentenceChange?.(-1);
    } else if (fullSpeechText) {
      await speech.speak(fullSpeechText, { rate: playbackRate });
      setIsPlaying(false);
      ttsRunningRef.current = false;
    }
  };

  const handleSkip = (seconds: number) => {
    sounds.playClick();
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + seconds)
      );
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const handleRateCycle = () => {
    sounds.playClick();
    const rates: SpeechRate[] = [0.75, 1.0, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Waveform heights generator
  const waveBarsCount = 28;

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-[#1b194b] to-[#121136] text-white p-5 sm:p-7 border border-indigo-700/50 shadow-2xl overflow-hidden">
      {/* Decorative ambient gradient glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-brand-blue/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-brand-purple/20 blur-3xl pointer-events-none" />

      {activeTrack && (
        <audio
          ref={audioRef}
          src={activeTrack.src}
          loop={isLooping}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => {
            if (!isLooping) {
              setIsPlaying(false);
              setCurrentTime(0);
            }
          }}
        />
      )}

      {/* ================= PLAYLIST SELECTOR TABS (If multiple tracks) ================= */}
      {initialTracks.length > 1 && (
        <div className="mb-5 pb-4 border-b border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
          {initialTracks.map((tr, idx) => {
            const isCurrent = activeTrackIndex === idx;
            return (
              <button
                key={tr.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTrackIndex(idx);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-display font-extrabold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-lg shadow-brand-blue/25 scale-[1.02]'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isCurrent && isPlaying ? (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                      <span className="w-1 h-4 bg-amber-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </span>
                  ) : (
                    <FileAudio className="w-3.5 h-3.5 opacity-80" />
                  )}
                  <span>{tr.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================= HEADER ROW: Track Title & Source Pills ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-black border border-emerald-400/30">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isPlaying ? 'animate-ping' : ''}`} />
              <span>Authentic Audio Recording</span>
            </span>

            {activeTrack && (
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                📁 {activeTrack.originalFileName}
              </span>
            )}
          </div>

          <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
            {activeTrack ? activeTrack.title : title || 'Audio Player'}
          </h3>
          <p className="text-xs font-semibold text-slate-300">
            {activeTrack ? activeTrack.subtitle : subtitle}
          </p>
        </div>

        {/* Audio Mode Switcher (Recording vs Smart Voice) */}
        <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15 text-xs font-extrabold self-stretch sm:self-auto justify-center">
          <button
            onClick={() => {
              if (isPlaying) togglePlay();
              setMode('recording');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              mode === 'recording'
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Recording
          </button>
          <button
            onClick={() => {
              if (isPlaying) togglePlay();
              setMode('tts');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              mode === 'tts'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Smart Voice</span>
          </button>
        </div>
      </div>

      {/* ================= DYNAMIC SOUND WAVE VISUALIZER ================= */}
      <div className="my-6 py-3 px-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between gap-1 sm:gap-1.5 h-16 relative overflow-hidden">
        {Array.from({ length: waveBarsCount }).map((_, i) => {
          // Calculate stylized bar heights
          const baseHeight = 20 + Math.sin(i * 0.45) * 15;
          const playingHeight = isPlaying
            ? Math.min(95, Math.max(15, baseHeight + ((i * 17) % 55) * (Math.random() * 0.4 + 0.8)))
            : baseHeight * 0.4;

          const isHighlighted = (i / waveBarsCount) * 100 <= progressPercent;

          return (
            <div
              key={i}
              className="flex-1 flex items-center justify-center h-full"
            >
              <div
                className={`w-full max-w-[6px] rounded-full transition-all duration-150 ${
                  isHighlighted
                    ? 'bg-gradient-to-t from-brand-blue via-brand-purple to-emerald-400 shadow-sm'
                    : 'bg-white/20'
                }`}
                style={{
                  height: `${playingHeight}%`,
                  transition: 'height 180ms ease, background-color 150ms ease',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ================= INTERACTIVE PROGRESS SCRUBBER ================= */}
      <div className="space-y-1.5 mb-5 relative z-10">
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="w-full bg-white/15 hover:bg-white/25 rounded-full h-3 cursor-pointer relative overflow-hidden transition-colors group"
        >
          <div
            className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-amber-300 rounded-full transition-all duration-75 relative shadow-glow"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-300">
          <span className="text-white font-bold">{formatTime(currentTime)}</span>
          <span className="text-slate-400">
            {duration ? formatTime(duration) : '0:00'}
          </span>
        </div>
      </div>

      {/* ================= CONTROLS ROW ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 relative z-10">
        {/* Left: Secondary toggles (Loop, Speed) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Rate button */}
          <button
            onClick={handleRateCycle}
            title="Adjust playback speed"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold font-mono text-white transition-colors"
          >
            <Gauge className="w-3.5 h-3.5 text-amber-300" />
            <span>{playbackRate}x</span>
          </button>

          {/* Repeat / Loop button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsLooping(!isLooping);
            }}
            title={isLooping ? 'Disable loop' : 'Loop this track'}
            className={`p-2 rounded-xl transition-colors ${
              isLooping
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'bg-white/10 hover:bg-white/20 text-slate-300'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Main Playback Controls */}
        <div className="flex items-center gap-3">
          {/* Replay 5s */}
          <button
            onClick={() => handleSkip(-5)}
            title="Rewind 5 seconds"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center btn-bounce"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] font-black font-mono ml-0.5">5s</span>
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center text-white transition-all shadow-xl btn-bounce ${
              isPlaying
                ? 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/40 scale-105'
                : 'bg-gradient-to-tr from-brand-blue to-brand-purple shadow-brand-blue/40 hover:scale-105'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-0.5" />
            )}
          </button>

          {/* Forward 5s */}
          <button
            onClick={() => handleSkip(5)}
            title="Forward 5 seconds"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center btn-bounce"
          >
            <span className="text-[10px] font-black font-mono mr-0.5">5s</span>
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Volume Control */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setIsMuted(!isMuted);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4 text-slate-200" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 sm:w-20 accent-brand-blue cursor-pointer h-1.5 rounded-lg bg-white/20"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
}
