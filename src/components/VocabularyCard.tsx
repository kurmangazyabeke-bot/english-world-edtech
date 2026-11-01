'use client';

import React, { useState } from 'react';
import { Volume2, Star, CheckCircle, VolumeX } from 'lucide-react';
import { WordItem } from '../types';
import { speech } from '../lib/speech';
import { sounds } from '../lib/soundEffects';
import { useProgress } from '../lib/progress';

export function VocabularyCard({
  word,
  showCategory = true,
}: {
  word: WordItem;
  showCategory?: boolean;
}) {
  const { progress, toggleWordLearned, toggleWordFavorite } = useProgress();
  const [isPlaying, setIsPlaying] = useState(false);

  const isLearned = progress.learnedWordIds.includes(word.id);
  const isFavorite = progress.favoriteWordIds.includes(word.id);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speech.stop();
      setIsPlaying(false);
      return;
    }
    sounds.playClick();
    setIsPlaying(true);
    speech.speak(word.english, {
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleToggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCorrect();
    toggleWordLearned(word.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    toggleWordFavorite(word.id);
  };

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
        isLearned
          ? 'bg-emerald-50/40 border-emerald-200 shadow-sm'
          : 'bg-white border-brand-border/80 shadow-card hover:shadow-hover hover:-translate-y-0.5'
      }`}
    >
      {/* Top action row */}
      <div className="flex items-center justify-between mb-3">
        {showCategory ? (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
            {word.category}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-slate-400">
            #{word.sourceOrder}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-xl transition-colors ${
              isFavorite
                ? 'text-amber-500 bg-amber-50'
                : 'text-slate-300 hover:text-amber-400 hover:bg-slate-50'
            }`}
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
            />
          </button>

          {/* Learned toggle button */}
          <button
            onClick={handleToggleLearned}
            title={isLearned ? 'Mark as not learned' : 'Mark as learned (+10 XP)'}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all ${
              isLearned
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isLearned ? 'Learned' : 'Learn'}</span>
          </button>
        </div>
      </div>

      {/* Center content */}
      <div className="flex items-start gap-4 my-2">
        {/* Emoji / Illustration Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-bg to-blue-50 border border-blue-100/70 flex items-center justify-center text-3xl shadow-xs flex-shrink-0">
          {word.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* English word */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display font-extrabold text-xl text-indigo-deep tracking-tight">
              {word.english}
            </h4>

            {/* Audio Button */}
            <button
              onClick={handleSpeak}
              title="Listen pronunciation"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-brand-blue text-white animate-pulse shadow-md shadow-brand-blue/30 scale-110'
                  : 'bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white'
              }`}
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 animate-bounce" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* IPA Transcription */}
          <div className="text-xs font-semibold text-brand-purple tracking-wide font-mono mt-0.5">
            {word.ipa}
          </div>

          {/* Kazakh Translation */}
          <div className="text-base font-bold text-slate-800 mt-2 font-display">
            {word.kazakh}
          </div>

          {/* Context note if any */}
          {word.contextNote && (
            <div className="text-[11px] font-semibold text-amber-700 bg-amber-50/90 border border-amber-200/60 rounded-lg px-2 py-0.5 mt-2 inline-block">
              ⚠️ {word.contextNote}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-brand-muted">
        <span>Grade {word.grade} • {word.moduleName}</span>
        <button
          onClick={handleSpeak}
          className="text-brand-blue hover:underline font-bold flex items-center gap-1"
        >
          <span>Listen</span>
          <Volume2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
