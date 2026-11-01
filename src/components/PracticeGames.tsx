'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCw,
  Sparkles,
  Trophy,
  HelpCircle,
  ArrowRight,
  Shuffle,
} from 'lucide-react';
import { WordItem, ModuleData } from '../types';
import { speech } from '../lib/speech';
import { sounds } from '../lib/soundEffects';
import { useProgress } from '../lib/progress';

// ==========================================
// 1. MATCH THE WORDS GAME
// ==========================================
export function MatchTheWordsGame({ words }: { words: WordItem[] }) {
  const { addXp, markPracticeCompleted } = useProgress();
  const [activeWords, setActiveWords] = useState<WordItem[]>([]);
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedKz, setSelectedKz] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [shuffledKz, setShuffledKz] = useState<WordItem[]>([]);
  const [wrongPair, setWrongPair] = useState<boolean>(false);
  const [score, setScore] = useState(0);

  const initGame = () => {
    // Select 5 words
    const pool = [...words].sort(() => Math.random() - 0.5).slice(0, Math.min(6, words.length));
    setActiveWords(pool);
    setShuffledKz([...pool].sort(() => Math.random() - 0.5));
    setMatchedIds([]);
    setSelectedEn(null);
    setSelectedKz(null);
    setWrongPair(false);
  };

  useEffect(() => {
    initGame();
  }, [words]);

  const handleSelectEn = (word: WordItem) => {
    if (matchedIds.includes(word.id)) return;
    sounds.playClick();
    speech.speak(word.english);
    setSelectedEn(word.id);
    if (selectedKz) {
      checkMatch(word.id, selectedKz);
    }
  };

  const handleSelectKz = (word: WordItem) => {
    if (matchedIds.includes(word.id)) return;
    sounds.playClick();
    setSelectedKz(word.id);
    if (selectedEn) {
      checkMatch(selectedEn, word.id);
    }
  };

  const checkMatch = (enId: string, kzId: string) => {
    if (enId === kzId) {
      sounds.playCorrect();
      setMatchedIds((prev) => [...prev, enId]);
      setSelectedEn(null);
      setSelectedKz(null);
      setScore((s) => s + 10);
      addXp(10);

      if (matchedIds.length + 1 >= activeWords.length) {
        sounds.playCelebration();
        addXp(20);
        if (words[0]?.moduleId) {
          markPracticeCompleted(words[0].moduleId);
        }
      }
    } else {
      sounds.playWrong();
      setWrongPair(true);
      setTimeout(() => {
        setSelectedEn(null);
        setSelectedKz(null);
        setWrongPair(false);
      }, 700);
    }
  };

  const isCompleted = matchedIds.length === activeWords.length && activeWords.length > 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h4 className="font-display font-black text-xl text-indigo-deep">
            Match the Words
          </h4>
          <p className="text-xs font-semibold text-brand-muted">
            Tap an English word on the left and its Kazakh meaning on the right
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Score: {score} XP</span>
          </div>
          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            title="Shuffle new pair set"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-3xl flex items-center justify-center mx-auto mb-3 animate-bounce">
            🎉
          </div>
          <h4 className="font-display font-black text-2xl text-indigo-deep mb-2">
            Awesome Job! All Matched!
          </h4>
          <p className="text-xs font-semibold text-brand-muted mb-6">
            You successfully paired all words in this round (+{score} XP).
          </p>
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-black text-sm flex items-center gap-2 mx-auto shadow-md hover:bg-brand-blueHover btn-bounce"
          >
            <RotateCw className="w-4 h-4" />
            <span>Play Next Round</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: English Words */}
          <div className="space-y-3">
            <div className="text-xs font-black text-brand-blue uppercase tracking-wider mb-1 px-1">
              English Words
            </div>
            {activeWords.map((word) => {
              const isMatched = matchedIds.includes(word.id);
              const isSelected = selectedEn === word.id;

              return (
                <button
                  key={word.id}
                  disabled={isMatched}
                  onClick={() => handleSelectEn(word)}
                  className={`w-full p-3.5 rounded-2xl border text-left font-display font-bold text-sm sm:text-base transition-all flex items-center justify-between ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                      : isSelected
                      ? wrongPair
                        ? 'bg-rose-50 border-rose-400 text-rose-700 animate-shake'
                        : 'bg-brand-blue text-white border-brand-blue shadow-md scale-102'
                      : 'bg-white border-slate-200 text-indigo-deep hover:border-brand-blue hover:bg-blue-50/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{word.emoji}</span>
                    <span>{word.english}</span>
                  </span>
                  {isMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Kazakh Meanings */}
          <div className="space-y-3">
            <div className="text-xs font-black text-brand-purple uppercase tracking-wider mb-1 px-1">
              Қазақша мағынасы
            </div>
            {shuffledKz.map((word) => {
              const isMatched = matchedIds.includes(word.id);
              const isSelected = selectedKz === word.id;

              return (
                <button
                  key={word.id}
                  disabled={isMatched}
                  onClick={() => handleSelectKz(word)}
                  className={`w-full p-3.5 rounded-2xl border text-left font-display font-bold text-sm sm:text-base transition-all flex items-center justify-between ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                      : isSelected
                      ? wrongPair
                        ? 'bg-rose-50 border-rose-400 text-rose-700 animate-shake'
                        : 'bg-indigo-deep text-white border-indigo-deep shadow-md scale-102'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-deep hover:bg-slate-50'
                  }`}
                >
                  <span>{word.kazakh}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. CHOOSE THE ANSWER (Multiple Choice)
// ==========================================
export function ChooseTheAnswerGame({ words }: { words: WordItem[] }) {
  const { addXp } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const currentWord = words[currentIndex % words.length];

  const generateOptions = () => {
    if (!currentWord) return;
    const distractors = words
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.kazakh);

    const allOpts = [...distractors, currentWord.kazakh].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOpts);
    setSelectedOpt(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateOptions();
  }, [currentIndex, words]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOpt(option);
    setIsAnswered(true);

    if (option === currentWord.kazakh) {
      sounds.playCorrect();
      addXp(10);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  if (!currentWord) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
          Choose the Answer
        </span>
        <span className="text-xs font-semibold text-brand-muted">
          Word {((currentIndex) % words.length) + 1} of {words.length}
        </span>
      </div>

      <div className="text-center py-6">
        <div className="text-5xl mb-2">{currentWord.emoji}</div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-display font-black text-3xl text-indigo-deep">
            {currentWord.english}
          </h3>
          <button
            onClick={() => speech.speak(currentWord.english)}
            className="p-2 rounded-full bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs font-mono text-brand-purple mt-1">
          {currentWord.ipa}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {options.map((option, idx) => {
          let btnStyle =
            'bg-slate-50 border-slate-200 text-slate-800 hover:border-brand-blue hover:bg-blue-50/50';

          if (isAnswered) {
            if (option === currentWord.kazakh) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-bold';
            } else if (selectedOpt === option) {
              btnStyle = 'bg-rose-500 text-white border-rose-500';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelect(option)}
              className={`p-4 rounded-2xl border text-center font-display font-bold text-sm sm:text-base transition-all ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-indigo-deep">
            {selectedOpt === currentWord.kazakh
              ? '✨ Correct! +10 XP'
              : `Correct answer was: ${currentWord.kazakh}`}
          </span>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-2xl bg-brand-blue text-white font-display font-black text-sm flex items-center gap-1.5 hover:bg-brand-blueHover btn-bounce"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. LISTEN AND CHOOSE GAME
// ==========================================
export function ListenAndChooseGame({ words }: { words: WordItem[] }) {
  const { addXp } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [options, setOptions] = useState<WordItem[]>([]);

  const currentWord = words[currentIndex % words.length];

  const setupRound = () => {
    if (!currentWord) return;
    const pool = words
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const combined = [...pool, currentWord].sort(() => Math.random() - 0.5);
    setOptions(combined);
    setSelectedOpt(null);
    setIsAnswered(false);

    // Auto play pronunciation after short delay
    setTimeout(() => {
      speech.speak(currentWord.english);
    }, 300);
  };

  useEffect(() => {
    setupRound();
  }, [currentIndex, words]);

  const handleSelect = (word: WordItem) => {
    if (isAnswered) return;
    setSelectedOpt(word.id);
    setIsAnswered(true);

    if (word.id === currentWord.id) {
      sounds.playCorrect();
      addXp(10);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  if (!currentWord) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-full">
          Listen and Choose
        </span>
        <span className="text-xs font-semibold text-brand-muted">
          Round {((currentIndex) % words.length) + 1} of {words.length}
        </span>
      </div>

      <div className="text-center py-6">
        <button
          onClick={() => speech.speak(currentWord.english)}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-transform"
          title="Click to replay sound"
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <p className="text-sm font-bold text-indigo-deep">
          Listen to the pronunciation and select the matching Kazakh word:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {options.map((word) => {
          let btnStyle =
            'bg-slate-50 border-slate-200 text-slate-800 hover:border-brand-purple hover:bg-purple-50/40';

          if (isAnswered) {
            if (word.id === currentWord.id) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-bold';
            } else if (selectedOpt === word.id) {
              btnStyle = 'bg-rose-500 text-white border-rose-500';
            }
          }

          return (
            <button
              key={word.id}
              disabled={isAnswered}
              onClick={() => handleSelect(word)}
              className={`p-4 rounded-2xl border text-center font-display font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${btnStyle}`}
            >
              <span>{word.emoji}</span>
              <span>{word.kazakh}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-indigo-deep">
            {selectedOpt === currentWord.id
              ? `🎉 Correct! It was "${currentWord.english}"`
              : `Answer was: "${currentWord.english}" (${currentWord.kazakh})`}
          </span>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-2xl bg-brand-blue text-white font-display font-black text-sm flex items-center gap-1.5 hover:bg-brand-blueHover btn-bounce"
          >
            <span>Next Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. SPELL THE WORD GAME
// ==========================================
export function SpellTheWordGame({ words }: { words: WordItem[] }) {
  const { addXp } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentWord = words[currentIndex % words.length];

  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [currentIndex, words]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim()) return;

    // Normalize comparison: remove extra spaces, ignore case
    const cleanInput = userInput.trim().toLowerCase().replace(/['’]/g, "'");
    const cleanTarget = currentWord.english.trim().toLowerCase().replace(/['’]/g, "'");

    const matched = cleanInput === cleanTarget;
    setIsSubmitted(true);
    setIsCorrect(matched);

    if (matched) {
      sounds.playCorrect();
      addXp(10);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  if (!currentWord) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Spell the Word
        </span>
        <span className="text-xs font-semibold text-brand-muted">
          Round {((currentIndex) % words.length) + 1} of {words.length}
        </span>
      </div>

      <div className="text-center py-5">
        <div className="text-5xl mb-2">{currentWord.emoji}</div>
        <div className="font-display font-black text-2xl text-indigo-deep mb-1">
          {currentWord.kazakh}
        </div>
        <div className="text-xs font-mono text-brand-purple">
          IPA: {currentWord.ipa}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-indigo-deep mb-1 text-center">
            Type the English word:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isSubmitted && isCorrect}
            placeholder="Type here..."
            className="w-full text-center text-xl font-display font-extrabold py-3.5 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none transition-colors"
          />
        </div>

        {showHint && (
          <div className="text-center text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            Hint: First letter is "{currentWord.english[0]}", length is {currentWord.english.length} letters.
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {!showHint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors"
            >
              Need a hint?
            </button>
          )}

          {!isSubmitted ? (
            <button
              type="submit"
              className="ml-auto px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-black text-sm hover:bg-brand-blueHover shadow-md btn-bounce"
            >
              Check Spelling
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-black text-sm flex items-center gap-1.5 hover:bg-brand-blueHover btn-bounce"
            >
              <span>Next Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {isSubmitted && (
        <div
          className={`mt-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            isCorrect
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Excellent! You spelled "{currentWord.english}" correctly! (+10 XP)</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                Not quite! Correct spelling is: <strong>{currentWord.english}</strong>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. MASTER PRACTICE CONTAINER (Tabbed Hub)
// ==========================================
export function PracticeHub({
  words,
  moduleId,
}: {
  words: WordItem[];
  moduleId?: string;
}) {
  const [activeTab, setActiveTab] = useState<
    'match' | 'choose' | 'listen' | 'spell'
  >('match');

  const tabs = [
    { id: 'match', label: 'Match the Words', icon: Shuffle },
    { id: 'choose', label: 'Choose Answer', icon: HelpCircle },
    { id: 'listen', label: 'Listen & Choose', icon: Volume2 },
    { id: 'spell', label: 'Spell the Word', icon: Sparkles },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-border/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 scale-102'
                  : 'bg-white text-indigo-deep hover:bg-slate-100 border border-brand-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Game */}
      {activeTab === 'match' && <MatchTheWordsGame words={words} />}
      {activeTab === 'choose' && <ChooseTheAnswerGame words={words} />}
      {activeTab === 'listen' && <ListenAndChooseGame words={words} />}
      {activeTab === 'spell' && <SpellTheWordGame words={words} />}
    </div>
  );
}
