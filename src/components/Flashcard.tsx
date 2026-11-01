'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { WordItem } from '../types';
import { speech } from '../lib/speech';
import { sounds } from '../lib/soundEffects';
import { useProgress } from '../lib/progress';

export function FlashcardDeck({ words }: { words: WordItem[] }) {
  const { toggleWordLearned, addMistakeWord, addXp } = useProgress();
  const [deck, setDeck] = useState<WordItem[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  useEffect(() => {
    setDeck(words);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setKnownCount(0);
  }, [words]);

  const currentWord = deck[currentIndex];

  const handleFlip = () => {
    sounds.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentWord) return;
    sounds.playClick();
    speech.speak(currentWord.english);
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
      sounds.playCelebration();
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    sounds.playClick();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRepeat = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setKnownCount(0);
  };

  const handleKnow = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCorrect();
    toggleWordLearned(currentWord.id);
    setKnownCount((prev) => prev + 1);
    addXp(5);
    handleNext();
  };

  const handleLearnAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playWrong();
    addMistakeWord(currentWord.id);
    handleNext();
  };

  if (!currentWord && !isFinished) {
    return <div className="text-center py-8">No words available.</div>;
  }

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-border text-center max-w-lg mx-auto shadow-card">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
          🏆
        </div>
        <h3 className="font-display font-extrabold text-2xl text-indigo-deep mb-2">
          Flashcard Deck Complete!
        </h3>
        <p className="text-sm font-semibold text-brand-muted mb-6">
          You reviewed all {deck.length} words in this set! You marked {knownCount} words as known.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRepeat}
            className="px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-bold text-sm flex items-center gap-2 hover:bg-brand-blueHover shadow-md shadow-brand-blue/20 btn-bounce"
          >
            <RotateCw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
          <button
            onClick={handleShuffle}
            className="px-6 py-3 rounded-2xl bg-slate-100 text-indigo-deep font-display font-bold text-sm flex items-center gap-2 hover:bg-slate-200 btn-bounce"
          >
            <Shuffle className="w-4 h-4" />
            <span>Shuffle Deck</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="max-w-xl mx-auto">
      {/* Top Deck Controls & Counter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
            Card {currentIndex + 1} of {deck.length}
          </span>
          <span className="text-xs font-bold text-brand-muted">
            ({progressPercent}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Shuffle deck"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-blue hover:border-brand-blue shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handleRepeat}
            title="Restart deck"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-blue hover:border-brand-blue shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-brand-blue h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flippable Card Area */}
      <div
        onClick={handleFlip}
        className="perspective-1000 cursor-pointer min-h-[320px] sm:min-h-[350px] w-full select-none"
      >
        <div
          className={`relative w-full h-full min-h-[320px] sm:min-h-[350px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-hover border border-brand-border ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ============ FRONT FACE (English Word) ============ */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-8 flex flex-col justify-between backface-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
                English Word • Tap to flip
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(e);
                }}
                className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Pronounce word"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center my-auto py-4">
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform">
                {currentWord.emoji}
              </div>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-indigo-deep tracking-tight mb-2">
                {currentWord.english}
              </h3>
              <div className="inline-block text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                Click anywhere to flip for meaning & IPA
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-2 border-t border-slate-100">
              <span>{currentWord.category}</span>
              <span className="flex items-center gap-1 text-brand-blue font-bold">
                <RotateCw className="w-3.5 h-3.5" />
                Flip
              </span>
            </div>
          </div>

          {/* ============ BACK FACE (Translation & IPA) ============ */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 to-indigo-deep text-white rounded-3xl p-8 flex flex-col justify-between backface-hidden rotate-y-180">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full">
                Kazakh Translation & IPA
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(e);
                }}
                className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-indigo-deep flex items-center justify-center transition-colors"
                title="Pronounce English word"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center my-auto py-2">
              <div className="text-xs font-mono tracking-widest text-brand-purple mb-2">
                {currentWord.ipa}
              </div>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">
                {currentWord.kazakh}
              </h3>
              <div className="text-base font-bold text-slate-300">
                "{currentWord.english}"
              </div>
              {currentWord.contextNote && (
                <div className="text-xs text-amber-300 bg-amber-400/20 border border-amber-400/30 rounded-xl px-3 py-1 mt-3 inline-block">
                  {currentWord.contextNote}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleLearnAgain}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-rose-300" />
                <span>Learn Again</span>
              </button>
              <button
                onClick={handleKnow}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I Know This! (+5 XP)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows & Action Bar */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 text-indigo-deep font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleFlip}
          className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-deep hover:bg-indigo-100 transition-colors font-bold"
          title="Flip card"
        >
          <RotateCw className="w-5 h-5 text-indigo-700" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 rounded-2xl bg-brand-blue text-white font-display font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-brand-blueHover shadow-md shadow-brand-blue/20 btn-bounce"
        >
          <span>{currentIndex === deck.length - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
