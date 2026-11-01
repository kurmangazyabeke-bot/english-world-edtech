'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Radio,
} from 'lucide-react';
import { speech, SpeechRate } from '../lib/speech';
import { sounds } from '../lib/soundEffects';

interface AudioPlayerProps {
  title: string;
  subtitle?: string;
  audioFileSrc?: string;
  fullSpeechText?: string;
  onSentenceChange?: (index: number) => void;
  sentences?: string[];
}

export function AudioPlayer({
  title,
  subtitle,
  audioFileSrc,
  fullSpeechText,
  onSentenceChange,
  sentences = [],
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'recording' | 'tts'>(
    audioFileSrc ? 'recording' : 'tts'
  );
  const [rate, setRate] = useState<SpeechRate>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsRunningRef = useRef(false);

  useEffect(() => {
    setIsSpeechSupported(speech.isSupported());
  }, []);

  // Update audio element speed when rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    speech.setRate(rate);
  }, [rate]);

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

  // Handle Play / Pause for recorded audio
  const toggleRecordingPlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      sounds.playClick();
      audioRef.current.playbackRate = rate;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Playback blocked or failed, switching to TTS fallback:', e);
          setMode('tts');
          toggleTtsPlay();
        });
    }
  };

  // Handle Play / Stop for Web Speech API TTS
  const toggleTtsPlay = async () => {
    if (isPlaying) {
      speech.stop();
      ttsRunningRef.current = false;
      setIsPlaying(false);
      setCurrentSentenceIdx(-1);
      onSentenceChange?.(-1);
      return;
    }

    sounds.playClick();
    setIsPlaying(true);
    ttsRunningRef.current = true;

    if (sentences.length > 0) {
      // Speak sentence by sentence with visual highlight
      for (let i = 0; i < sentences.length; i++) {
        if (!ttsRunningRef.current) break;
        setCurrentSentenceIdx(i);
        onSentenceChange?.(i);
        await speech.speak(sentences[i], { rate });
        // small pause between sentences
        await new Promise((r) => setTimeout(r, 400));
      }
      setIsPlaying(false);
      ttsRunningRef.current = false;
      setCurrentSentenceIdx(-1);
      onSentenceChange?.(-1);
    } else if (fullSpeechText) {
      await speech.speak(fullSpeechText, { rate });
      setIsPlaying(false);
      ttsRunningRef.current = false;
    }
  };

  const handlePlayToggle = () => {
    if (mode === 'recording' && audioFileSrc) {
      toggleRecordingPlay();
    } else {
      toggleTtsPlay();
    }
  };

  const handleStop = () => {
    sounds.playClick();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    speech.stop();
    ttsRunningRef.current = false;
    setIsPlaying(false);
    setCurrentSentenceIdx(-1);
    onSentenceChange?.(-1);
  };

  const handleRateCycle = () => {
    sounds.playClick();
    const rates: SpeechRate[] = [0.75, 1.0, 1.25];
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    setRate(rates[nextIdx]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border/90 shadow-card">
      {audioFileSrc && (
        <audio
          ref={audioRef}
          src={audioFileSrc}
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
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Header Info & Audio source switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
            <h4 className="font-display font-extrabold text-base sm:text-lg text-indigo-deep">
              {title}
            </h4>
          </div>
          {subtitle && (
            <p className="text-xs font-semibold text-brand-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Source selector */}
        {audioFileSrc && (
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold self-stretch sm:self-auto justify-center">
            <button
              onClick={() => {
                if (isPlaying) handleStop();
                setMode('recording');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                mode === 'recording'
                  ? 'bg-white text-brand-blue shadow-xs'
                  : 'text-slate-500 hover:text-indigo-deep'
              }`}
            >
              Original Audio
            </button>
            <button
              onClick={() => {
                if (isPlaying) handleStop();
                setMode('tts');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                mode === 'tts'
                  ? 'bg-white text-brand-purple shadow-xs'
                  : 'text-slate-500 hover:text-indigo-deep'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Smart Voice</span>
            </button>
          </div>
        )}
      </div>

      {!isSpeechSupported && mode === 'tts' && (
        <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 mb-3">
          Notice: Your browser does not support Web Speech API. Please use a modern browser like Chrome, Edge or Safari.
        </div>
      )}

      {/* Progress Bar (Recording Mode) */}
      {mode === 'recording' && (
        <div className="space-y-1 mb-4">
          <div className="w-full bg-slate-100 rounded-full h-2 cursor-pointer overflow-hidden">
            <div
              className="bg-brand-blue h-full rounded-full transition-all"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Sentence indicator in TTS Mode */}
      {mode === 'tts' && sentences.length > 0 && (
        <div className="mb-4 bg-purple-50/60 border border-purple-100 rounded-2xl p-3 text-xs font-bold text-indigo-deep flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-brand-purple animate-pulse" />
            <span>Interactive Sentence Reading Mode</span>
          </span>
          <span className="text-brand-purple">
            {currentSentenceIdx >= 0
              ? `Sentence ${currentSentenceIdx + 1} of ${sentences.length}`
              : 'Ready to read'}
          </span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Main Play/Pause Button */}
          <button
            onClick={handlePlayToggle}
            className={`px-5 py-2.5 rounded-2xl font-display font-black text-sm flex items-center gap-2 text-white transition-all shadow-md btn-bounce ${
              isPlaying
                ? 'bg-amber-500 shadow-amber-500/25'
                : 'bg-brand-blue hover:bg-brand-blueHover shadow-brand-blue/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Listen Audio</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-slate-700" />
            </button>
          )}
        </div>

        {/* Speed Selector (0.75x, 1x, 1.25x) */}
        <button
          onClick={handleRateCycle}
          title="Adjust pronunciation speed"
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-indigo-deep transition-colors"
        >
          <Gauge className="w-3.5 h-3.5 text-brand-blue" />
          <span>Speed: {rate}x</span>
        </button>
      </div>
    </div>
  );
}
